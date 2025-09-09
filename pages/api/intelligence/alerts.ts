import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getDatabaseAdapter();
    const clients = await db.query(
      `SELECT u.id, u.fullName, 
              (SELECT MAX(sent_at) FROM messages m WHERE m.sender_id = u.id OR m.receiver_id = u.id) AS last_sent,
              (SELECT MAX(recorded_date) FROM progress_tracking p WHERE p.user_id = u.id) AS last_rec
       FROM users u WHERE u.coach_id = ?`,
      [auth.userId]
    );

    const now = Date.now();
    const alerts: Array<{ type: string; priority: 'low'|'medium'|'high'; client_id: number; client_name: string; message: string }>
      = [];

    for (const c of clients) {
      const lastStr = maxDateString(c.last_sent, c.last_rec);
      const days = lastStr ? (now - new Date(lastStr).getTime()) / (1000*60*60*24) : Infinity;
      if (days > 5) {
        alerts.push({
          type: 'nudge',
          priority: 'high',
          client_id: c.id,
          client_name: c.fullName,
          message: `${c.fullName} hasn\'t been active for ${Math.floor(days)} days. Send a check-in nudge.`
        });
      } else if (days > 2) {
        alerts.push({
          type: 'nudge',
          priority: 'medium',
          client_id: c.id,
          client_name: c.fullName,
          message: `${c.fullName} activity is dropping. A friendly reminder may help.`
        });
      }
    }

    alerts.sort((a, b) => priorityOrder(b.priority) - priorityOrder(a.priority));
    return res.status(200).json({ alerts });
  } catch (err) {
    console.error('Alerts error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

function maxDateString(a?: string|null, b?: string|null): string | null {
  if (!a && !b) return null;
  if (a && !b) return a;
  if (b && !a) return b;
  return new Date(a!).getTime() >= new Date(b!).getTime() ? a! : b!;
}

function priorityOrder(p: 'low'|'medium'|'high'): number {
  return p === 'high' ? 3 : p === 'medium' ? 2 : 1;
}

export const config = { api: { bodyParser: false } };

