import type { NextApiRequest, NextApiResponse } from 'next';

type Bucket = { remaining: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function simpleRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  key: string,
  { windowMs = 10 * 60 * 1000, max = 30 }: { windowMs?: number; max?: number } = {}
): boolean {
  const id = getKey(req, key);
  const now = Date.now();
  let b = buckets.get(id);
  if (!b || b.resetAt <= now) {
    b = { remaining: max, resetAt: now + windowMs };
  }
  if (b.remaining <= 0) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return false;
  }
  b.remaining -= 1;
  buckets.set(id, b);
  res.setHeader('X-RateLimit-Remaining', String(b.remaining));
  res.setHeader('X-RateLimit-Reset', String(b.resetAt));
  return true;
}

function getKey(req: NextApiRequest, key: string): string {
  const auth = req.headers.authorization || '';
  const ip = (req.headers['x-forwarded-for'] as string) || (req.socket?.remoteAddress ?? '');
  return `${key}:${auth}:${ip}`;
}

