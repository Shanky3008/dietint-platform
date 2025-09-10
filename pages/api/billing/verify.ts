import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';
import { simpleRateLimit } from '@/lib/security/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['ADMIN']);
  if (!auth) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!simpleRateLimit(req, res, 'billing:verify', { windowMs: 5*60*1000, max: 50 })) return;
  try {
    const db = await getDatabaseAdapter();
    const { invoice_id } = req.body || {};
    if (!invoice_id) return res.status(400).json({ error: 'invoice_id is required' });
    await db.run(`UPDATE invoices SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [invoice_id]);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Verify invoice error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };

