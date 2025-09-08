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
      `SELECT id, fullName, email, phone, created_at as createdAt, updated_at as updatedAt FROM users WHERE coach_id = ? ORDER BY created_at DESC`,
      [auth.userId]
    );
    return res.status(200).json({ clients });
  } catch (err) {
    console.error('List clients error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: false } };

