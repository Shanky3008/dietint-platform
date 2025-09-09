import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';
import { simpleRateLimit } from '@/lib/security/rateLimit';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WhatsAppService = require('@/lib/whatsapp/whatsappService.js');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!simpleRateLimit(req, res, 'wa:nudge-all-red', { windowMs: 60 * 60 * 1000, max: 4 })) return;

  try {
    const db = await getDatabaseAdapter();
    // Get clients with red risk (no activity >5 days) - approximate using messages/progress
    const clients = await db.query(
      `SELECT u.id, u.fullName, u.phone,
              (SELECT MAX(sent_at) FROM messages m WHERE m.sender_id = u.id OR m.receiver_id = u.id) AS last_sent,
              (SELECT MAX(recorded_date) FROM progress_tracking p WHERE p.user_id = u.id) AS last_rec
       FROM users u WHERE u.coach_id = ? AND u.phone IS NOT NULL`,
      [auth.userId]
    );
    const now = Date.now();
    const wa = new WhatsAppService();
    let sent = 0;
    for (const c of clients) {
      const lastStr = maxDateString(c.last_sent, c.last_rec);
      const days = lastStr ? (now - new Date(lastStr).getTime()) / (1000*60*60*24) : Infinity;
      if (days > 5) {
        try {
          await wa.sendMessage(c.phone, { type: 'text', text: `Hi ${c.fullName}, just checking in. How are you doing with your plan? I\'m here if you need help today.` });
          sent++;
        } catch { /* ignore individual failures */ }
      }
    }
    return res.status(200).json({ sent });
  } catch (err) {
    console.error('Nudge all red error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

function maxDateString(a?: string|null, b?: string|null): string | null {
  if (!a && !b) return null;
  if (a && !b) return a;
  if (b && !a) return b;
  return new Date(a!).getTime() >= new Date(b!).getTime() ? a! : b!;
}

export const config = { api: { bodyParser: false } };

