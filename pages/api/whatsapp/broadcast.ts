import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';
import WhatsAppService from '@/lib/whatsapp/whatsappService.js';
import { simpleRateLimit } from '@/lib/security/rateLimit';
import { logger } from '@/lib/security/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = requireAuth(req, res, ['COACH', 'ADMIN']);
  if (!auth) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!simpleRateLimit(req, res, 'wa:broadcast', { windowMs: 60 * 60 * 1000, max: 6 })) return;
  const { text } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const db = await getDatabaseAdapter();
    const clients = await db.query(`SELECT fullName, phone FROM users WHERE coach_id = ? AND phone IS NOT NULL`, [auth.userId]);
    const wa = new WhatsAppService();
    let success = 0;
    for (const c of clients) {
      try {
        await wa.sendMessage(c.phone, { type: 'text', text });
        success++;
      } catch (_) {}
    }
    return res.status(200).json({ sent: success, total: clients.length });
  } catch (err) {
    await logger.error('Broadcast error', err instanceof Error ? err : new Error(String(err)));
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };
