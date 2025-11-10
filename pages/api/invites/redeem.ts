import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import { requireAuth } from '@/lib/security/auth';
import { simpleRateLimit } from '@/lib/security/rateLimit';
import WhatsAppService from '@/lib/whatsapp/whatsappService.js';
import { logger } from '@/lib/security/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res, ['CLIENT', 'COACH', 'ADMIN']);
  if (!auth) return;
  const db = await getDatabaseAdapter();
  const { code, user_id = auth.userId } = req.body || {};
  if (!simpleRateLimit(req, res, 'invites:redeem', { windowMs: 10 * 60 * 1000, max: 30 })) return;

  if (!code || !user_id) {
    return res.status(400).json({ error: 'code and user_id are required' });
  }

  try {
    const invite = await db.get(`SELECT * FROM invite_codes WHERE code = ?`, [code]);
    if (!invite) return res.status(404).json({ error: 'Invalid invite code' });
    if (invite.used_by) return res.status(409).json({ error: 'Invite code already used' });
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Invite code expired' });
    }

    // Mark invite used
    await db.run(`UPDATE invite_codes SET used_by = ?, used_at = CURRENT_TIMESTAMP WHERE id = ?`, [user_id, invite.id]);

    // Link client to coach (if present)
    if (invite.coach_id) {
      await db.run(`UPDATE users SET coach_id = ? WHERE id = ?`, [invite.coach_id, user_id]);
    }

    // Send welcome message via WhatsApp if configured
    try {
      const user = await db.get(`SELECT fullName, phone FROM users WHERE id = ?`, [user_id]);
      if (user?.phone) {
        const wa = new WhatsAppService();
        await wa.sendWelcomeMessage(user.phone, user.fullName || 'there');
      }
    } catch (waErr) {
      await logger.warn('WhatsApp welcome skipped', { error: (waErr as Error).message });
    }

    return res.status(200).json({ success: true, coach_id: invite.coach_id || null });
  } catch (err: any) {
    await logger.error('Redeem invite error', err instanceof Error ? err : new Error(String(err)));
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };
