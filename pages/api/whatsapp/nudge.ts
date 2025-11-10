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

  if (!simpleRateLimit(req, res, 'wa:nudge', { windowMs: 10 * 60 * 1000, max: 30 })) return;
  const { client_id, text } = req.body || {};
  if (!client_id || !text) {
    return res.status(400).json({ error: 'client_id and text are required' });
  }

  try {
    const db = await getDatabaseAdapter();
    // Ensure this client belongs to the coach
    const client = await db.get(`SELECT fullName, phone FROM users WHERE id = ? AND coach_id = ?`, [client_id, auth.userId]);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    if (!client.phone) return res.status(400).json({ error: 'Client has no phone number' });

    const wa = new WhatsAppService();
    await wa.sendMessage(client.phone, { type: 'text', text });
    return res.status(200).json({ success: true });
  } catch (err) {
    await logger.error('Nudge error', err instanceof Error ? err : new Error(String(err)));
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };
