import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';
import { simpleRateLimit } from '@/lib/security/rateLimit';

function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;
  const db = await getDatabaseAdapter();

  try {
    if (req.method === 'POST') {
      if (!simpleRateLimit(req, res, 'invites:create', { windowMs: 60 * 60 * 1000, max: 20 })) return;
      const { coach_id = auth.userId, expires_at } = req.body || {};
      const code = generateCode(6);
      await db.run(
        `INSERT INTO invite_codes (code, coach_id, expires_at) VALUES (?, ?, ?)`,
        [code, coach_id || null, expires_at || null]
      );
      return res.status(201).json({ code, coach_id: coach_id || null, expires_at: expires_at || null });
    }

    if (req.method === 'GET') {
      const { coach_id } = req.query;
      const rows = coach_id
        ? await db.query(`SELECT * FROM invite_codes WHERE coach_id = ? ORDER BY created_at DESC`, [coach_id])
        : await db.query(`SELECT * FROM invite_codes ORDER BY created_at DESC`);
      return res.status(200).json({ invites: rows });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Invites API error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };
