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
    // Forward the request to the backend server
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Return successful response
    res.status(200).json(data);
  } catch (error) {
    console.error('Login API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to connect to authentication server'
    });
  }
}