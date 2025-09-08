import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;

  const { client_id, plan_id } = req.body || {};
  if (!client_id || !plan_id) {
    return res.status(400).json({ error: 'client_id and plan_id are required' });
  }

  try {
    const db = await getDatabaseAdapter();
    await db.run(
      `INSERT INTO client_plans (client_id, plan_id, assigned_by, status) VALUES (?, ?, ?, 'active')`,
      [client_id, plan_id, auth.userId]
    );
    return res.status(201).json({ success: true });
  } catch (err: any) {
    console.error('Assign plan error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };
