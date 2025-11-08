import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export type AuthPayload = {
  userId: number;
  email: string;
  role: string;
  fullName?: string;
};

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set. Please configure it in your environment.');
  }
  return secret;
}

export function getAuth(req: NextApiRequest): AuthPayload | null {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
    if (!token) return null;
    const payload = jwt.verify(token, getJWTSecret()) as AuthPayload;
    return payload;
  } catch {
    return null;
  }
}

export function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  roles?: string[]
): AuthPayload | null {
  const payload = getAuth(req);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  if (roles && !roles.includes(payload.role)) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return payload;
}

