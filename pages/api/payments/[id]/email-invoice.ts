import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import InvoiceGenerator from '@/lib/pdf/invoiceGenerator';
import EmailService from '@/lib/email/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
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

    // Get payment details
    const payment = await db.get(`
      SELECT * FROM payments 
      WHERE id = $1 AND user_id = $1
    `, [id, user.id]);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Get appointment details if linked
    const appointment = await db.get(`
      SELECT a.*, u.fullName as dietitian_name 
      FROM appointments a
      LEFT JOIN users u ON a.dietitian_id = u.id
      WHERE a.payment_id = $1
    `, [payment.id]);

    // Prepare customer data
    const customer = {
      fullName: user.fullName || user.firstName + ' ' + user.lastName,
      email: user.email,
      phone: user.phone
    };

    // Generate invoice PDF
    const invoiceResult = await InvoiceGenerator.generateFromPayment(
      payment,
      customer,
      appointment
    );

    if (!invoiceResult.success) {
      return res.status(500).json({ 
        error: 'Failed to generate invoice',
        details: invoiceResult.error 
      });
    }

    // Send invoice via email
    const emailService = new EmailService();
    const emailResult = await emailService.sendInvoiceEmail(user, payment, invoiceResult.filePath);

    if (!emailResult.success) {
      return res.status(500).json({ 
        error: 'Failed to send invoice email',
        details: emailResult.error 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice sent successfully to your email address',
      messageId: emailResult.messageId
    });

  } catch (error) {
    console.error('Email invoice API error:', error);
    res.status(500).json({ 
      error: 'Failed to send invoice email',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}