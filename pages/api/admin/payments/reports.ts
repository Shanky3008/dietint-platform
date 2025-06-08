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

    const { range = 'month' } = req.query;
    const db = await getDatabaseAdapter();
    
    // Get user ID from token (simplified - in real app, verify JWT and check admin role)
    const user = await db.get('SELECT * FROM users WHERE id = ?', [1]); // For demo
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Date range calculation
    let dateFilter = '';
    const now = new Date();
    
    switch (range) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = `AND p.payment_date >= '${weekAgo.toISOString()}'`;
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        dateFilter = `AND p.payment_date >= '${monthAgo.toISOString()}'`;
        break;
      case 'quarter':
        const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        dateFilter = `AND p.payment_date >= '${quarterAgo.toISOString()}'`;
        break;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        dateFilter = `AND p.payment_date >= '${yearAgo.toISOString()}'`;
        break;
      default:
        dateFilter = '';
    }

    // Fetch payment reports with user information
    const payments = await db.query(`
      SELECT 
        p.id,
        u.fullName as user_name,
        u.email as user_email,
        p.amount,
        p.currency,
        p.status,
        p.payment_method,
        p.service_name,
        p.payment_date,
        a.appointment_date,
        (p.amount * 0.15) as commission
      FROM payments p
      INNER JOIN users u ON p.user_id = u.id
      LEFT JOIN appointments a ON p.id = a.payment_id
      WHERE p.amount > 0 ${dateFilter}
      ORDER BY p.payment_date DESC
    `);

    // Calculate statistics
    const stats = await db.get(`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_revenue,
        COUNT(*) as total_payments,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN amount END), 0) as avg_payment,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount * 0.15 ELSE 0 END), 0) as commission_earned
      FROM payments p
      WHERE p.amount > 0 ${dateFilter}
    `);

    // Format payments data
    const formattedPayments = payments.map(payment => ({
      ...payment,
      service_name: payment.service_name || 'NutriWise Service',
      currency: payment.currency || 'USD',
      commission: parseFloat((payment.amount * 0.15).toFixed(2))
    }));

    res.status(200).json({
      success: true,
      payments: formattedPayments,
      stats: {
        total_revenue: stats?.total_revenue || 0,
        total_payments: stats?.total_payments || 0,
        pending_amount: stats?.pending_amount || 0,
        avg_payment: stats?.avg_payment || 0,
        commission_earned: stats?.commission_earned || 0
      },
      range
    });

  } catch (error) {
    console.error('Payment reports API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payment reports',
      details: error.message 
    });
  }
}