import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';

type RiskBand = 'green' | 'yellow' | 'red';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;

  try {
    const db = await getDatabaseAdapter();

    // Find clients linked to this coach
    const clients = await db.query(
      `SELECT id, fullName, email FROM users WHERE coach_id = ? ORDER BY id DESC`,
      [auth.userId]
    );

    // For each client, compute last activity as the latest of message sent or progress recorded
    const results = [] as Array<{ client_id: number; name: string; last_activity: string | null; risk: RiskBand }>;

    const now = Date.now();
    for (const c of clients) {
      const lastMsg = await db.get(
        `SELECT MAX(sent_at) AS last_sent FROM messages WHERE sender_id = ? OR receiver_id = ?`,
        [c.id, c.id]
      );
      const lastProgress = await db.get(
        `SELECT MAX(recorded_date) AS last_rec FROM progress_tracking WHERE user_id = ?`,
        [c.id]
      );

      const lastA = maxDateString(lastMsg?.last_sent, lastProgress?.last_rec);
      const risk = scoreRisk(lastA ? new Date(lastA).getTime() : undefined, now);
      results.push({ client_id: c.id, name: c.fullName || c.email, last_activity: lastA, risk });
    }

    res.status(200).json({ clients: results, generated_at: new Date().toISOString() });
  } catch (err) {
    console.error('Risk API error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function maxDateString(a?: string | null, b?: string | null): string | null {
  if (!a && !b) return null;
  if (a && !b) return a;
  if (b && !a) return b;
  return new Date(a!).getTime() >= new Date(b!).getTime() ? a! : b!;
}

function scoreRisk(lastActivityMs: number | undefined, nowMs: number): RiskBand {
  if (!lastActivityMs) return 'red';
  const days = (nowMs - lastActivityMs) / (1000 * 60 * 60 * 24);
  if (days <= 2) return 'green';
  if (days <= 5) return 'yellow';
  return 'red';
}

export const config = { api: { bodyParser: false } };

