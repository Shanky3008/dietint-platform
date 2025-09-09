import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';
import { simpleRateLimit } from '@/lib/security/rateLimit';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WhatsAppService = require('@/lib/whatsapp/whatsappService.js');

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
    if (!simpleRateLimit(req, res, 'plans:assign', { windowMs: 10 * 60 * 1000, max: 60 })) return;
    const db = await getDatabaseAdapter();
    await db.run(
      `INSERT INTO client_plans (client_id, plan_id, assigned_by, status) VALUES (?, ?, ?, 'active')`,
      [client_id, plan_id, auth.userId]
    );

    // Notify client via WhatsApp if configured
    try {
      const client = await db.get(`SELECT fullName, phone FROM users WHERE id = ?`, [client_id]);
      const plan = await db.get(
        `SELECT title, description, start_date, end_date FROM diet_plans WHERE id = ?`,
        [plan_id]
      );
      if (client?.phone && plan?.title) {
        const wa = new WhatsAppService();
        await wa.sendDietPlan(client.phone, client.fullName || 'there', plan);
      }
    } catch (waErr) {
      console.log('WhatsApp diet plan send skipped:', (waErr as Error).message);
    }
    return res.status(201).json({ success: true });
  } catch (err: any) {
    console.error('Assign plan error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };
