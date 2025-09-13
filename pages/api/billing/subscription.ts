import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;
  const db = await getDatabaseAdapter();
  try {
    if (req.method === 'GET') {
      const sub = await db.get(`SELECT cs.*, p.code, p.name, p.price_inr, p.pricing_model FROM coach_subscriptions cs JOIN plans p ON p.id = cs.plan_id WHERE cs.coach_id = ? ORDER BY cs.updated_at DESC`, [auth.userId]);
      return res.status(200).json({ subscription: sub || null });
    }
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Subscription error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: false } };

