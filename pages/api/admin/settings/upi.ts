import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['ADMIN']);
  if (!auth) return;
  const db = await getDatabaseAdapter();

  if (req.method === 'GET') {
    const vpa = await db.get(`SELECT value FROM settings WHERE key = ?`, ['upi_vpa']);
    const name = await db.get(`SELECT value FROM settings WHERE key = ?`, ['upi_name']);
    return res.status(200).json({
      upi_vpa: vpa?.value || process.env.UPI_VPA || '',
      upi_name: name?.value || process.env.UPI_PAYEE_NAME || ''
    });
  }

  if (req.method === 'POST') {
    const { upi_vpa, upi_name } = req.body || {};
    if (!upi_vpa || !upi_name) return res.status(400).json({ error: 'upi_vpa and upi_name are required' });
    await db.run(`INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`, ['upi_vpa', upi_vpa]);
    await db.run(`INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`, ['upi_name', upi_name]);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}

export const config = { api: { bodyParser: true } };

