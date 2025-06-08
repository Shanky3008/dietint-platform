// PDF Invoice Generator for NutriWise
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { BRAND_CONFIG } = require('../branding');

class InvoiceGenerator {
  constructor() {
    this.doc = null;
    this.currentY = 0;
  }

  async generateInvoice(invoiceData) {
    try {
      this.doc = new PDFDocument({ margin: 50 });
      
      // Create invoice directory if it doesn't exist
      const invoiceDir = path.join(process.cwd(), 'uploads', 'invoices');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const fileName = `invoice-${invoiceData.payment.id}-${Date.now()}.pdf`;
      const filePath = path.join(invoiceDir, fileName);
      
      // Pipe the PDF to a file
      this.doc.pipe(fs.createWriteStream(filePath));

      // Generate invoice content
      this.addHeader();
      this.addBusinessInfo();
      this.addCustomerInfo(invoiceData.customer);
      this.addInvoiceDetails(invoiceData.payment);
      this.addItemsTable(invoiceData.items || []);
      this.addTotals(invoiceData.payment);
      this.addPaymentInfo(invoiceData.payment);
      this.addFooter();

      // Finalize the PDF
      this.doc.end();

      return {
        success: true,
        fileName,
        filePath,
        relativePath: `/uploads/invoices/${fileName}`
      };

    } catch (error) {
      console.error('Invoice generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  addHeader() {
    // Company logo area (text-based)
    this.doc
      .fontSize(24)
      .fillColor(BRAND_CONFIG.colors.primary)
      .text(BRAND_CONFIG.logo.full, 50, 50, { align: 'left' });

    // Invoice title
    this.doc
      .fontSize(28)
      .fillColor('#000000')
      .text('INVOICE', 400, 50, { align: 'right' });

    this.currentY = 100;
  }

  addBusinessInfo() {
    const startY = this.currentY;
    
    this.doc
      .fontSize(12)
      .fillColor('#000000')
      .text(BRAND_CONFIG.business.name, 50, startY)
      .text(BRAND_CONFIG.contact.address, 50, startY + 15)
      .text(`Email: ${BRAND_CONFIG.contact.email}`, 50, startY + 30)
      .text(`Phone: ${BRAND_CONFIG.contact.phone}`, 50, startY + 45)
      .text(`Website: ${BRAND_CONFIG.social.website}`, 50, startY + 60);

    this.currentY = startY + 90;
  }

  addCustomerInfo(customer) {
    const startY = this.currentY;
    
    // Bill to section
    this.doc
      .fontSize(14)
      .fillColor(BRAND_CONFIG.colors.primary)
      .text('BILL TO:', 50, startY);

    this.doc
      .fontSize(12)
      .fillColor('#000000')
      .text(customer.fullName || customer.name, 50, startY + 20)
      .text(customer.email, 50, startY + 35);

    if (customer.phone) {
      this.doc.text(customer.phone, 50, startY + 50);
    }

    this.currentY = startY + 80;
  }

  addInvoiceDetails(payment) {
    const startY = this.currentY - 80; // Align with customer info
    
    this.doc
      .fontSize(12)
      .fillColor('#666666')
      .text('Invoice Number:', 350, startY)
      .text('Date:', 350, startY + 15)
      .text('Due Date:', 350, startY + 30)
      .text('Status:', 350, startY + 45);

    this.doc
      .fillColor('#000000')
      .text(`INV-${payment.id}`, 450, startY)
      .text(new Date(payment.payment_date || payment.created_at).toLocaleDateString(), 450, startY + 15)
      .text(new Date(payment.payment_date || payment.created_at).toLocaleDateString(), 450, startY + 30)
      .text(payment.status.toUpperCase(), 450, startY + 45);

    this.currentY += 20;
  }

  addItemsTable(items) {
    const startY = this.currentY + 20;
    const tableTop = startY;
    
    // Table header
    this.doc
      .rect(50, tableTop, 500, 25)
      .fillAndStroke(BRAND_CONFIG.colors.light, BRAND_CONFIG.colors.primary);

    this.doc
      .fontSize(10)
      .fillColor('#000000')
      .text('DESCRIPTION', 60, tableTop + 8)
      .text('QTY', 350, tableTop + 8)
      .text('RATE', 400, tableTop + 8)
      .text('AMOUNT', 480, tableTop + 8);

    let position = tableTop + 25;

    // Table rows
    if (items.length === 0) {
      // Default service item
      items = [{
        description: 'NutriWise Nutrition Service',
        quantity: 1,
        rate: 0,
        amount: 0
      }];
    }

    items.forEach((item, index) => {
      const y = position + (index * 25);
      
      this.doc
        .rect(50, y, 500, 25)
        .stroke(BRAND_CONFIG.colors.primary);

      this.doc
        .fontSize(10)
        .text(item.description, 60, y + 8)
        .text(item.quantity.toString(), 350, y + 8)
        .text(`$${item.rate.toFixed(2)}`, 400, y + 8)
        .text(`$${item.amount.toFixed(2)}`, 480, y + 8);
    });

    this.currentY = position + (items.length * 25) + 20;
  }

  addTotals(payment) {
    const startY = this.currentY;
    const subtotal = payment.amount;
    const tax = 0; // Can be calculated if needed
    const total = payment.amount;

    // Totals box
    this.doc
      .rect(350, startY, 200, 80)
      .stroke(BRAND_CONFIG.colors.primary);

    this.doc
      .fontSize(10)
      .text('Subtotal:', 360, startY + 10)
      .text('Tax:', 360, startY + 25)
      .text('Total:', 360, startY + 45);

    this.doc
      .text(`$${subtotal.toFixed(2)}`, 480, startY + 10)
      .text(`$${tax.toFixed(2)}`, 480, startY + 25);

    this.doc
      .fontSize(12)
      .fillColor(BRAND_CONFIG.colors.primary)
      .text(`$${total.toFixed(2)}`, 480, startY + 45);

    this.currentY = startY + 100;
  }

  addPaymentInfo(payment) {
    const startY = this.currentY + 20;
    
    this.doc
      .fontSize(14)
      .fillColor(BRAND_CONFIG.colors.primary)
      .text('PAYMENT INFORMATION', 50, startY);

    this.doc
      .fontSize(10)
      .fillColor('#000000')
      .text(`Payment Method: ${payment.payment_method || 'Online Payment'}`, 50, startY + 20)
      .text(`Transaction ID: ${payment.transaction_id || 'N/A'}`, 50, startY + 35)
      .text(`Payment Date: ${new Date(payment.payment_date || payment.created_at).toLocaleDateString()}`, 50, startY + 50)
      .text(`Status: ${payment.status.toUpperCase()}`, 50, startY + 65);

    this.currentY = startY + 100;
  }

  addFooter() {
    const pageHeight = this.doc.page.height;
    const footerY = pageHeight - 100;
    
    // Thank you message
    this.doc
      .fontSize(12)
      .fillColor(BRAND_CONFIG.colors.primary)
      .text('Thank you for choosing NutriWise!', 50, footerY, { align: 'center', width: 500 });

    this.doc
      .fontSize(10)
      .fillColor('#666666')
      .text('For questions about this invoice, please contact our support team.', 50, footerY + 20, { align: 'center', width: 500 })
      .text(`${BRAND_CONFIG.contact.email} | ${BRAND_CONFIG.contact.phone}`, 50, footerY + 35, { align: 'center', width: 500 });

    // Footer line
    this.doc
      .moveTo(50, footerY + 55)
      .lineTo(550, footerY + 55)
      .stroke(BRAND_CONFIG.colors.primary);

    this.doc
      .fontSize(8)
      .fillColor('#999999')
      .text(`Generated on ${new Date().toLocaleDateString()} | ${BRAND_CONFIG.business.name}`, 50, footerY + 65, { align: 'center', width: 500 });
  }

  // Generate invoice from payment data
  static async generateFromPayment(payment, customer, appointment = null) {
    const generator = new InvoiceGenerator();
    
    const invoiceData = {
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency || 'USD',
        status: payment.status,
        payment_method: payment.payment_method,
        transaction_id: payment.transaction_id,
        payment_date: payment.payment_date,
        created_at: payment.created_at
      },
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone
      },
      items: appointment ? [{
        description: `Nutrition Consultation with ${appointment.dietitian_name || 'Expert Dietitian'}`,
        quantity: 1,
        rate: payment.amount,
        amount: payment.amount
      }] : [{
        description: 'NutriWise Nutrition Service',
        quantity: 1,
        rate: payment.amount,
        amount: payment.amount
      }]
    };

    return await generator.generateInvoice(invoiceData);
  }

  // Generate receipt (simpler version)
  static async generateReceipt(payment, customer) {
    const generator = new InvoiceGenerator();
    generator.doc = new PDFDocument({ margin: 50 });
    
    const receiptDir = path.join(process.cwd(), 'uploads', 'receipts');
    if (!fs.existsSync(receiptDir)) {
      fs.mkdirSync(receiptDir, { recursive: true });
    }

    const fileName = `receipt-${payment.id}-${Date.now()}.pdf`;
    const filePath = path.join(receiptDir, fileName);
    
    generator.doc.pipe(fs.createWriteStream(filePath));

    // Simple receipt layout
    generator.doc
      .fontSize(20)
      .fillColor(BRAND_CONFIG.colors.primary)
      .text(BRAND_CONFIG.logo.full, 50, 50, { align: 'center' });

    generator.doc
      .fontSize(16)
      .fillColor('#000000')
      .text('PAYMENT RECEIPT', 50, 100, { align: 'center' });

    generator.doc
      .fontSize(12)
      .text(`Receipt #: ${payment.id}`, 50, 150)
      .text(`Date: ${new Date(payment.payment_date || payment.created_at).toLocaleDateString()}`, 50, 170)
      .text(`Amount: ${payment.currency || 'USD'} $${payment.amount}`, 50, 190)
      .text(`Method: ${payment.payment_method || 'Online'}`, 50, 210)
      .text(`Status: ${payment.status.toUpperCase()}`, 50, 230);

    generator.doc
      .fontSize(14)
      .fillColor(BRAND_CONFIG.colors.primary)
      .text('Thank you for your payment!', 50, 280, { align: 'center' });

    generator.doc.end();

    return {
      success: true,
      fileName,
      filePath,
      relativePath: `/uploads/receipts/${fileName}`
    };
  }
}

module.exports = InvoiceGenerator;