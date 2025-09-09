import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['CLIENT', 'COACH', 'ADMIN']);
  if (!auth) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getDatabaseAdapter();
    // If coach/admin queries, allow ?client_id= to inspect; otherwise use self
    const qClientId = req.query.client_id ? Number(req.query.client_id) : auth.userId;
    if ((auth.role === 'COACH' || auth.role === 'ADMIN') && req.query.client_id) {
      const owned = await db.get(`SELECT 1 FROM users WHERE id = ? AND (coach_id = ? OR ? = 'ADMIN')`, [qClientId, auth.userId, auth.role]);
      if (!owned && auth.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    }
    const assignment = await db.get(
      `SELECT dp.id, dp.title, dp.description, dp.start_date, dp.end_date, cp.status, cp.assigned_at
       FROM client_plans cp 
       JOIN diet_plans dp ON dp.id = cp.plan_id
       WHERE cp.client_id = ? AND cp.status = 'active'
       ORDER BY cp.assigned_at DESC
       LIMIT 1`,
      [qClientId]
    );
    return res.status(200).json({ plan: assignment || null });
  } catch (err) {
    console.error('Get current plan error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: false } };

