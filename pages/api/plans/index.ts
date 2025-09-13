import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const db = await getDatabaseAdapter();
  const rows = await db.query(`SELECT id, code, name, price_inr, billing_period, pricing_model, features, limits FROM plans WHERE is_active = 1 OR is_active = TRUE ORDER BY price_inr ASC`);
  res.status(200).json({ plans: rows });
}

export const config = { api: { bodyParser: false } };

