import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { requireAuth } from '@/lib/security/auth';

type Provider = 'cloudinary' | 's3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res, ['CLIENT', 'COACH', 'ADMIN']);
  if (!auth) return;

  const provider = (process.env.UPLOADS_PROVIDER || 'local') as Provider | 'local';
  try {
    if (provider === 'cloudinary') {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      if (!cloudName || !apiKey || !apiSecret) {
        return res.status(500).json({ error: 'Cloudinary is not configured' });
      }

      const { folder = 'consultations', public_id } = req.body || {};
      const timestamp = Math.floor(Date.now() / 1000);

      // Build signature string with allowed parameters sorted alphabetically
      const params: Record<string, string | number> = { timestamp, folder };
      if (public_id) params.public_id = public_id;
      const toSign = Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join('&') + apiSecret;
      const signature = crypto.createHash('sha1').update(toSign).digest('hex');

      return res.status(200).json({
        provider: 'cloudinary',
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        fields: {
          api_key: apiKey,
          timestamp,
          folder,
          signature,
          ...(public_id ? { public_id } : {}),
        },
      });
    }

    if (provider === 's3') {
      // Placeholder: implement AWS S3 pre-signed URLs when AWS SDK is available
      return res.status(501).json({ error: 'S3 signing not yet implemented on this deployment' });
    }

    return res.status(501).json({ error: 'Uploads provider not supported. Set UPLOADS_PROVIDER=cloudinary or s3.' });
  } catch (err) {
    console.error('Sign upload error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = { api: { bodyParser: true } };

