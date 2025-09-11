import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const db = await getDatabaseAdapter();
    
    // Get user ID from token (simplified - in real app, verify JWT)
    const user = await db.get('SELECT * FROM users WHERE id = $1', [1]); // For demo, using user ID 1
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Fetch payments for the user
    const payments = await db.query(`
      SELECT 
        id,
        amount,
        currency,
        status,
        payment_method,
        transaction_id,
        service_name,
        payment_date,
        created_at,
        description
      FROM payments 
      WHERE user_id = $1 
      ORDER BY payment_date DESC, created_at DESC
    `, [user.id]);

    // Calculate payment statistics
    const stats = await db.get(`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_spent,
        COUNT(*) as total_payments,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
        MAX(CASE WHEN status = 'completed' THEN payment_date END) as last_payment_date
      FROM payments 
      WHERE user_id = $1
    `, [user.id]);

    // Format payments data
    const formattedPayments = payments.map((payment: any) => ({
      ...payment,
    service_name: payment.service_name || 'CoachPulse Service',
      currency: payment.currency || 'USD'
    }));

    res.status(200).json({
      success: true,
      payments: formattedPayments,
      stats: {
        total_spent: stats?.total_spent || 0,
        total_payments: stats?.total_payments || 0,
        pending_amount: stats?.pending_amount || 0,
        last_payment_date: stats?.last_payment_date || null
      }
    });

  } catch (error) {
    console.error('Payment history API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payment history',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
