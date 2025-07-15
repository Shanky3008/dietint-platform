import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseAdapter } from '@/lib/database';
import InvoiceGenerator from '@/lib/pdf/invoiceGenerator';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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
    const result = await InvoiceGenerator.generateFromPayment(
      payment,
      customer,
      appointment
    );

    if (!result.success) {
      return res.status(500).json({ 
        error: 'Failed to generate invoice',
        details: result.error 
      });
    }

    // Check if file exists
    if (!result.filePath || !fs.existsSync(result.filePath)) {
      return res.status(500).json({ error: 'Invoice file not found' });
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
    res.setHeader('Cache-Control', 'no-cache');

    // Stream the PDF file
    const fileStream = fs.createReadStream(result.filePath);
    fileStream.pipe(res);

    // Clean up the file after sending (optional)
    fileStream.on('end', () => {
      // Optionally delete the file after sending
      // fs.unlinkSync(result.filePath);
    });

  } catch (error) {
    console.error('Invoice generation API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate invoice',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}