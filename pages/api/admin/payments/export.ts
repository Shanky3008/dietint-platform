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

    const { format = 'csv', range = 'month' } = req.query;
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

    // Fetch payment data for export
    const payments = await db.query(`
      SELECT 
        p.id as payment_id,
        u.fullName as client_name,
        u.email as client_email,
        p.amount,
        p.currency,
        p.status,
        p.payment_method,
        p.service_name,
        p.transaction_id,
        p.payment_date,
        a.appointment_date,
        (p.amount * 0.15) as commission
      FROM payments p
      INNER JOIN users u ON p.user_id = u.id
      LEFT JOIN appointments a ON p.id = a.payment_id
      WHERE p.amount > 0 ${dateFilter}
      ORDER BY p.payment_date DESC
    `);

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'Payment ID',
        'Client Name',
        'Client Email',
        'Amount',
        'Currency',
        'Status',
        'Payment Method',
        'Service',
        'Transaction ID',
        'Payment Date',
        'Appointment Date',
        'Commission'
      ];

      const csvRows = payments.map(payment => [
        payment.payment_id,
        payment.client_name,
        payment.client_email,
        payment.amount,
        payment.currency || 'USD',
        payment.status,
        payment.payment_method || 'Online',
        payment.service_name || 'NutriWise Service',
        payment.transaction_id || '',
        new Date(payment.payment_date).toLocaleDateString(),
        payment.appointment_date ? new Date(payment.appointment_date).toLocaleDateString() : '',
        (payment.amount * 0.15).toFixed(2)
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="payment-reports-${range}.csv"`);
      res.status(200).send(csvContent);

    } else if (format === 'pdf') {
      // For PDF, we'll create a simple HTML-to-PDF conversion
      // In a real app, you'd use a library like puppeteer or PDFKit
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payment Reports - ${range}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #4CAF50; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .summary { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>NutriWise Payment Reports</h1>
          <div class="summary">
            <h3>Summary (${range})</h3>
            <p><strong>Total Payments:</strong> ${payments.length}</p>
            <p><strong>Total Revenue:</strong> $${payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</p>
            <p><strong>Total Commission:</strong> $${payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount * 0.15), 0).toFixed(2)}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Service</th>
                <th>Payment Date</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              ${payments.map(payment => `
                <tr>
                  <td>${payment.payment_id}</td>
                  <td>${payment.client_name}<br><small>${payment.client_email}</small></td>
                  <td>${payment.currency || 'USD'} $${payment.amount}</td>
                  <td>${payment.status}</td>
                  <td>${payment.service_name || 'NutriWise Service'}</td>
                  <td>${new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td>$${(payment.amount * 0.15).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="payment-reports-${range}.html"`);
      res.status(200).send(htmlContent);

    } else {
      res.status(400).json({ error: 'Invalid format. Use csv or pdf.' });
    }

  } catch (error) {
    console.error('Payment export API error:', error);
    res.status(500).json({ 
      error: 'Failed to export payment reports',
      details: error.message 
    });
  }
}