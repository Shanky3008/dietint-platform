import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the registration request to the backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await backendResponse.json();

    // Forward the response status and data
    res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error('Registration proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to connect to authentication server' 
    });
  }
}