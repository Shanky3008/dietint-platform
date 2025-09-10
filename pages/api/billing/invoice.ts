import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';
import { simpleRateLimit } from '@/lib/security/rateLimit';

function periodNow() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

function buildUpiLink(vpa: string, name: string, amount: number, ref: string) {
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: String(amount),
    cu: 'INR',
    tn: ref,
    tr: ref,
  });
  return `upi://pay?${params.toString()}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!simpleRateLimit(req, res, 'billing:invoice', { windowMs: 5*60*1000, max: 20 })) return;
  try {
    const db = await getDatabaseAdapter();
    const coachId = auth.role === 'COACH' ? auth.userId : Number(req.body?.coach_id || auth.userId);
    const period = periodNow();
    // Check existing invoice
    let invoice = await db.get(`SELECT * FROM invoices WHERE coach_id = ? AND period = ?`, [coachId, period]);
    // Get active clients count snapshot
    const countRow = await db.get(`SELECT COUNT(*) as c FROM users WHERE coach_id = ? AND role = 'CLIENT'`, [coachId]);
    const activeCount = Number(countRow?.c || 0);
    const amount = activeCount * 200; // rupees
    if (!invoice) {
      const ref = `INV-${period.replace('-','')}-${coachId}-${Math.random().toString(36).slice(2,8)}`;
      await db.run(
        `INSERT INTO invoices (coach_id, period, amount, active_clients_snapshot, ref, status) VALUES (?, ?, ?, ?, ?, 'due')`,
        [coachId, period, amount, activeCount, ref]
      );
      invoice = await db.get(`SELECT * FROM invoices WHERE coach_id = ? AND period = ?`, [coachId, period]);
    } else if (invoice.status === 'due') {
      // keep snapshot but update amount in case pricing or snapshot changed
      await db.run(`UPDATE invoices SET amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [amount, invoice.id]);
      invoice = await db.get(`SELECT * FROM invoices WHERE id = ?`, [invoice.id]);
    }
    // Resolve UPI settings
    const vpa = (await db.get(`SELECT value FROM settings WHERE key = ?`, ['upi_vpa']))?.value || process.env.UPI_VPA || '';
    const name = (await db.get(`SELECT value FROM settings WHERE key = ?`, ['upi_name']))?.value || process.env.UPI_PAYEE_NAME || '';
    const upiLink = (vpa && name) ? buildUpiLink(vpa, name, invoice.amount, invoice.ref) : '';
    return res.status(200).json({ invoice, upi: { vpa, name, link: upiLink } });
  } catch (err) {
    console.error('Invoice error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };

