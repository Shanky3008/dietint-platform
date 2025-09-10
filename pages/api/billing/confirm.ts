import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';
import { simpleRateLimit } from '@/lib/security/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!simpleRateLimit(req, res, 'billing:confirm', { windowMs: 10*60*1000, max: 20 })) return;
  try {
    const db = await getDatabaseAdapter();
    const { invoice_id, utr, proof_url } = req.body || {};
    if (!invoice_id || !utr) return res.status(400).json({ error: 'invoice_id and utr are required' });
    const invoice = await db.get(`SELECT * FROM invoices WHERE id = ?`, [invoice_id]);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    if (auth.role === 'COACH' && invoice.coach_id !== auth.userId) return res.status(403).json({ error: 'Forbidden' });
    await db.run(`UPDATE invoices SET utr = ?, proof_url = ?, status = 'submitted', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [utr, proof_url || null, invoice_id]);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Billing confirm error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };

