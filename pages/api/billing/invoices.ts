import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['ADMIN']);
  if (!auth) return;
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const db = await getDatabaseAdapter();
    const rows = await db.query(`
      SELECT i.*, u.fullName as coach_name, u.email as coach_email
      FROM invoices i
      JOIN users u ON u.id = i.coach_id
      WHERE i.status IN ('due','submitted')
      ORDER BY i.updated_at DESC
    `);
    return res.status(200).json({ invoices: rows });
  } catch (err) {
    console.error('List invoices error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: false } };

