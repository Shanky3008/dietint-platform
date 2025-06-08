import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || process.env.INTERNAL_API_URL || 'http://localhost:5000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, query } = req;
    const queryString = new URLSearchParams(query as Record<string, string>).toString();
    const url = `${BACKEND_URL}/api/content${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      ...(method !== 'GET' && { body: JSON.stringify(req.body) }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Content API proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
}