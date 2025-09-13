import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const db = await getDatabaseAdapter();
    const { plan_code } = req.body || {};
    if (!plan_code) return res.status(400).json({ error: 'plan_code is required' });
    const plan = await db.get(`SELECT * FROM plans WHERE code = ? AND (is_active = 1 OR is_active = TRUE)`, [plan_code]);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    // Upsert subscription
    const existing = await db.get(`SELECT id FROM coach_subscriptions WHERE coach_id = ?`, [auth.userId]);
    const periodStart = new Date();
    const end = new Date(periodStart);
    end.setMonth(end.getMonth() + 1);
    if (existing) {
      await db.run(`UPDATE coach_subscriptions SET plan_id = ?, status = 'active', current_period_start = ?, current_period_end = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [plan.id, periodStart.toISOString(), end.toISOString(), existing.id]);
    } else {
      await db.run(`INSERT INTO coach_subscriptions (coach_id, plan_id, status, current_period_start, current_period_end) VALUES (?, ?, 'active', ?, ?)`, [auth.userId, plan.id, periodStart.toISOString(), end.toISOString()]);
    }
    return res.status(200).json({ success: true, plan: { code: plan.code, name: plan.name } });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };

