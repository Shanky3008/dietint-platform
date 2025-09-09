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
    const plans = await db.query(
      `SELECT id, title, description, start_date, end_date, status FROM diet_plans WHERE dietitian_id = ? ORDER BY updated_at DESC LIMIT 100`,
      [auth.userId]
    );
    return res.status(200).json({ plans });
  } catch (err) {
    console.error('List plans error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: false } };

