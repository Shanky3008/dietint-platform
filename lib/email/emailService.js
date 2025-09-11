// Email service for CoachPulse notifications
const nodemailer = require('nodemailer');
const { getDatabaseAdapter } = require('../database');
const { BRAND_CONFIG } = require('../branding');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Support multiple email providers
    const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
    
    switch (emailProvider) {
      case 'resend':
        return nodemailer.createTransporter({
          host: 'smtp.resend.com',
          port: 465,
          secure: true,
          auth: {
            user: 'resend',
            pass: process.env.RESEND_API_KEY
          }
        });
      
      case 'sendgrid':
        return nodemailer.createTransporter({
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
          }
        });
      
      case 'gmail':
        return nodemailer.createTransporter({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        });
      
      default: // SMTP
        return nodemailer.createTransporter({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
    }
  }

  async sendEmail(emailData) {
    try {
      const { to, subject, html, text, attachments = [] } = emailData;
      
      const mailOptions = {
        from: {
          name: BRAND_CONFIG.name,
          address: process.env.FROM_EMAIL || BRAND_CONFIG.contact.email
        },
        to,
        subject,
        html,
        text,
        attachments
      };

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      
      // Log email to database
      await this.logEmail({
        recipient: to,
        subject,
        status: 'sent',
        message_id: result.messageId,
        type: emailData.type || 'general'
      });

      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Log failed email
      await this.logEmail({
        recipient: emailData.to,
        subject: emailData.subject,
        status: 'failed',
        error: error.message,
        type: emailData.type || 'general'
      });

      return { success: false, error: error.message };
    }
  }

  async logEmail(logData) {
    try {
      const db = await getDatabaseAdapter();
      
      await db.run(`
        INSERT INTO email_logs (
          recipient, subject, status, message_id, error, type, sent_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        logData.recipient,
        logData.subject,
        logData.status,
        logData.message_id || null,
        logData.error || null,
        logData.type,
        new Date().toISOString()
      ]);
      
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }

  // Welcome email for new registrations
  async sendWelcomeEmail(user) {
    const html = this.generateWelcomeEmailHTML(user);
    const text = this.generateWelcomeEmailText(user);

    return await this.sendEmail({
      to: user.email,
      subject: `Welcome to ${BRAND_CONFIG.name}! Your journey to better health starts now 🧠`,
      html,
      text,
      type: 'welcome'
    });
  }

  // Appointment confirmation email
  async sendAppointmentConfirmation(user, appointment, dietitian) {
    const html = this.generateAppointmentConfirmationHTML(user, appointment, dietitian);
    const text = this.generateAppointmentConfirmationText(user, appointment, dietitian);

    return await this.sendEmail({
      to: user.email,
      subject: `Appointment Confirmed with ${dietitian.fullName} - ${BRAND_CONFIG.name}`,
      html,
      text,
      type: 'appointment_confirmation'
    });
  }

  // Appointment reminder email (1 day before)
  async sendAppointmentReminder(user, appointment, dietitian) {
    const html = this.generateAppointmentReminderHTML(user, appointment, dietitian);
    const text = this.generateAppointmentReminderText(user, appointment, dietitian);

    return await this.sendEmail({
      to: user.email,
      subject: `Reminder: Your appointment with ${dietitian.fullName} tomorrow`,
      html,
      text,
      type: 'appointment_reminder'
    });
  }

  // Payment receipt email
  async sendPaymentReceipt(user, payment, appointment) {
    const html = this.generatePaymentReceiptHTML(user, payment, appointment);
    const text = this.generatePaymentReceiptText(user, payment, appointment);

    return await this.sendEmail({
      to: user.email,
      subject: `Payment Receipt - ${BRAND_CONFIG.name} #${payment.id}`,
      html,
      text,
      type: 'payment_receipt',
      attachments: payment.invoice_pdf ? [{
        filename: `invoice-${payment.id}.pdf`,
        path: payment.invoice_pdf
      }] : []
    });
  }

  // Invoice email with PDF attachment
  async sendInvoiceEmail(user, payment, invoiceFilePath) {
    try {
      const emailData = {
        to: user.email,
        subject: `Invoice #${payment.id} - ${BRAND_CONFIG.name}`,
        text: this.generateInvoiceEmailText(user, payment),
        html: this.generateInvoiceEmailHTML(user, payment),
        type: 'invoice',
        attachments: [{
          filename: `invoice-${payment.id}.pdf`,
          path: invoiceFilePath,
          contentType: 'application/pdf'
        }]
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Invoice email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate email templates
  generateWelcomeEmailHTML(user) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${BRAND_CONFIG.name}</title>
        <style>
            body { font-family: ${BRAND_CONFIG.fonts.primary}; line-height: 1.6; color: ${BRAND_CONFIG.colors.text.primary}; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, ${BRAND_CONFIG.colors.primary} 0%, ${BRAND_CONFIG.colors.secondary} 100%); color: white; border-radius: 8px 8px 0 0; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 30px; background: white; border: 1px solid #e0e0e0; }
            .button { display: inline-block; padding: 12px 24px; background: ${BRAND_CONFIG.colors.primary}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .feature { display: flex; align-items: center; margin: 15px 0; }
            .feature-icon { font-size: 24px; margin-right: 12px; }
            .footer { text-align: center; padding: 20px; color: ${BRAND_CONFIG.colors.text.secondary}; font-size: 14px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">${BRAND_CONFIG.logo.full}</div>
                <p>${BRAND_CONFIG.tagline}</p>
            </div>
            
            <div class="content">
                <h2>Welcome to ${BRAND_CONFIG.name}, ${user.fullName}! 👋</h2>
                
                <p>We're thrilled to have you join our community of health-conscious individuals who are taking control of their nutrition journey with intelligent, personalized guidance.</p>
                
                <h3>What you can do now:</h3>
                
                <div class="feature">
                    <span class="feature-icon">🧠</span>
                    <div>
                        <strong>Get AI-Powered Insights</strong><br>
                        Receive personalized nutrition recommendations based on your unique profile
                    </div>
                </div>
                
                <div class="feature">
                    <span class="feature-icon">👨‍⚕️</span>
                    <div>
                        <strong>Book Expert Consultations</strong><br>
                        Connect with certified dietitians for professional guidance
                    </div>
                </div>
                
                <div class="feature">
                    <span class="feature-icon">📊</span>
                    <div>
                        <strong>Track Your Progress</strong><br>
                        Monitor your health metrics and see real results
                    </div>
                </div>
                
                <div class="feature">
                    <span class="feature-icon">🥗</span>
                    <div>
                        <strong>Get Personalized Meal Plans</strong><br>
                        Receive custom diet plans tailored to your goals and preferences
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${BRAND_CONFIG.social.website}/dashboard" class="button">
                        Get Started Now
                    </a>
                </div>
                
                <p><strong>Need help getting started?</strong></p>
                <p>Our support team is here to help you every step of the way. Simply reply to this email or visit our help center.</p>
                
                <p>Here's to your health and success!</p>
                <p><strong>The ${BRAND_CONFIG.name} Team</strong></p>
            </div>
            
            <div class="footer">
                <p>${BRAND_CONFIG.business.name}</p>
                <p>${BRAND_CONFIG.contact.address}</p>
                <p>
                    <a href="${BRAND_CONFIG.social.website}" style="color: ${BRAND_CONFIG.colors.primary};">Visit Website</a> | 
                    <a href="${BRAND_CONFIG.social.website}/contact" style="color: ${BRAND_CONFIG.colors.primary};">Contact Support</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateWelcomeEmailText(user) {
    return `
Welcome to ${BRAND_CONFIG.name}, ${user.fullName}!

${BRAND_CONFIG.tagline}

We're thrilled to have you join our community of health-conscious individuals taking control of their nutrition journey.

What you can do now:
• Get AI-Powered Insights - Receive personalized nutrition recommendations
• Book Expert Consultations - Connect with certified dietitians  
• Track Your Progress - Monitor your health metrics
• Get Personalized Meal Plans - Custom diet plans for your goals

Get started: ${BRAND_CONFIG.social.website}/dashboard

Need help? Simply reply to this email or contact our support team.

Here's to your health and success!
The ${BRAND_CONFIG.name} Team

${BRAND_CONFIG.business.name}
${BRAND_CONFIG.contact.address}
${BRAND_CONFIG.social.website}
    `;
  }

  generateAppointmentConfirmationHTML(user, appointment, dietitian) {
    const appointmentDate = new Date(appointment.appointment_date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmed - ${BRAND_CONFIG.name}</title>
        <style>
            body { font-family: ${BRAND_CONFIG.fonts.primary}; line-height: 1.6; color: ${BRAND_CONFIG.colors.text.primary}; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; background: ${BRAND_CONFIG.colors.primary}; color: white; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: white; border: 1px solid #e0e0e0; }
            .appointment-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid ${BRAND_CONFIG.colors.primary}; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: ${BRAND_CONFIG.colors.primary}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
            .footer { text-align: center; padding: 20px; color: ${BRAND_CONFIG.colors.text.secondary}; font-size: 14px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${BRAND_CONFIG.logo.emoji} Appointment Confirmed!</h1>
                <p>Your consultation is scheduled</p>
            </div>
            
            <div class="content">
                <h2>Hi ${user.fullName},</h2>
                
                <p>Great news! Your appointment has been confirmed. We're excited to help you on your nutrition journey.</p>
                
                <div class="appointment-card">
                    <h3>📅 Appointment Details</h3>
                    <p><strong>Dietitian:</strong> ${dietitian.fullName}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${formattedTime}</p>
                    <p><strong>Duration:</strong> ${appointment.duration || 60} minutes</p>
                    <p><strong>Type:</strong> ${appointment.meeting_type === 'online' ? 'Online Video Call' : 'In-Person'}</p>
                    ${appointment.meeting_link ? `<p><strong>Meeting Link:</strong> <a href="${appointment.meeting_link}">${appointment.meeting_link}</a></p>` : ''}
                </div>
                
                <h3>🎯 Prepare for your session:</h3>
                <ul>
                    <li>Complete your health questionnaire in your dashboard</li>
                    <li>List any specific goals or concerns you'd like to discuss</li>
                    <li>Prepare any recent lab results or medical reports</li>
                    <li>Note any medications or supplements you're currently taking</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${BRAND_CONFIG.social.website}/dashboard" class="button">View Dashboard</a>
                    ${appointment.meeting_link ? `<a href="${appointment.meeting_link}" class="button">Join Meeting</a>` : ''}
                </div>
                
                <p><strong>Questions?</strong> Feel free to contact us at ${BRAND_CONFIG.contact.email} or ${BRAND_CONFIG.contact.phone}.</p>
                
                <p>Looking forward to helping you achieve your health goals!</p>
                <p><strong>The ${BRAND_CONFIG.name} Team</strong></p>
            </div>
            
            <div class="footer">
                <p>Add this appointment to your calendar</p>
                <p>${BRAND_CONFIG.business.name} | ${BRAND_CONFIG.contact.email}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateAppointmentConfirmationText(user, appointment, dietitian) {
    const appointmentDate = new Date(appointment.appointment_date);
    const formattedDate = appointmentDate.toLocaleDateString();
    const formattedTime = appointmentDate.toLocaleTimeString();

    return `
Appointment Confirmed - ${BRAND_CONFIG.name}

Hi ${user.fullName},

Your appointment has been confirmed!

APPOINTMENT DETAILS:
Dietitian: ${dietitian.fullName}
Date: ${formattedDate}
Time: ${formattedTime}
Duration: ${appointment.duration || 60} minutes
Type: ${appointment.meeting_type === 'online' ? 'Online Video Call' : 'In-Person'}
${appointment.meeting_link ? `Meeting Link: ${appointment.meeting_link}` : ''}

PREPARE FOR YOUR SESSION:
• Complete your health questionnaire
• List specific goals or concerns
• Prepare recent lab results
• Note current medications/supplements

View Dashboard: ${BRAND_CONFIG.social.website}/dashboard

Questions? Contact us:
${BRAND_CONFIG.contact.email}
${BRAND_CONFIG.contact.phone}

The ${BRAND_CONFIG.name} Team
    `;
  }

  generateAppointmentReminderHTML(user, appointment, dietitian) {
    const appointmentDate = new Date(appointment.appointment_date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Reminder - ${BRAND_CONFIG.name}</title>
        <style>
            body { font-family: ${BRAND_CONFIG.fonts.primary}; line-height: 1.6; color: ${BRAND_CONFIG.colors.text.primary}; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; background: ${BRAND_CONFIG.colors.accent}; color: white; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: white; border: 1px solid #e0e0e0; }
            .reminder-card { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid ${BRAND_CONFIG.colors.accent}; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: ${BRAND_CONFIG.colors.primary}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
            .footer { text-align: center; padding: 20px; color: ${BRAND_CONFIG.colors.text.secondary}; font-size: 14px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏰ Appointment Reminder</h1>
                <p>Your consultation is tomorrow!</p>
            </div>
            
            <div class="content">
                <h2>Hi ${user.fullName},</h2>
                
                <p>This is a friendly reminder that your nutrition consultation is scheduled for tomorrow.</p>
                
                <div class="reminder-card">
                    <h3>📅 Tomorrow's Appointment</h3>
                    <p><strong>Dietitian:</strong> ${dietitian.fullName}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${formattedTime}</p>
                    <p><strong>Type:</strong> ${appointment.meeting_type === 'online' ? 'Online Video Call' : 'In-Person'}</p>
                    ${appointment.meeting_link ? `<p><strong>Meeting Link:</strong> <a href="${appointment.meeting_link}">${appointment.meeting_link}</a></p>` : ''}
                </div>
                
                <h3>✅ Last-minute preparation:</h3>
                <ul>
                    <li>Test your internet connection and camera (for online sessions)</li>
                    <li>Find a quiet, private space for your consultation</li>
                    <li>Have a glass of water and notebook ready</li>
                    <li>Review any questions you want to ask</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    ${appointment.meeting_link ? `<a href="${appointment.meeting_link}" class="button">Join Meeting</a>` : ''}
                    <a href="${BRAND_CONFIG.social.website}/dashboard" class="button">View Dashboard</a>
                </div>
                
                <p><strong>Need to reschedule?</strong> Please contact us at least 2 hours before your appointment.</p>
                
                <p>We're looking forward to seeing you tomorrow!</p>
                <p><strong>The ${BRAND_CONFIG.name} Team</strong></p>
            </div>
            
            <div class="footer">
                <p>Contact us: ${BRAND_CONFIG.contact.email} | ${BRAND_CONFIG.contact.phone}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateAppointmentReminderText(user, appointment, dietitian) {
    const appointmentDate = new Date(appointment.appointment_date);
    const formattedDate = appointmentDate.toLocaleDateString();
    const formattedTime = appointmentDate.toLocaleTimeString();

    return `
Appointment Reminder - ${BRAND_CONFIG.name}

Hi ${user.fullName},

Your nutrition consultation is scheduled for TOMORROW!

APPOINTMENT DETAILS:
Dietitian: ${dietitian.fullName}
Date: ${formattedDate}
Time: ${formattedTime}
Type: ${appointment.meeting_type === 'online' ? 'Online Video Call' : 'In-Person'}
${appointment.meeting_link ? `Meeting Link: ${appointment.meeting_link}` : ''}

LAST-MINUTE PREPARATION:
• Test internet and camera (online sessions)
• Find quiet, private space
• Have water and notebook ready
• Review your questions

${appointment.meeting_link ? `Join Meeting: ${appointment.meeting_link}` : ''}
Dashboard: ${BRAND_CONFIG.social.website}/dashboard

Need to reschedule? Contact us at least 2 hours before.

Contact: ${BRAND_CONFIG.contact.email} | ${BRAND_CONFIG.contact.phone}

The ${BRAND_CONFIG.name} Team
    `;
  }

  generatePaymentReceiptHTML(user, payment, appointment) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt - ${BRAND_CONFIG.name}</title>
        <style>
            body { font-family: ${BRAND_CONFIG.fonts.primary}; line-height: 1.6; color: ${BRAND_CONFIG.colors.text.primary}; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; background: ${BRAND_CONFIG.colors.primary}; color: white; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: white; border: 1px solid #e0e0e0; }
            .receipt-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: ${BRAND_CONFIG.colors.primary}; text-align: center; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: ${BRAND_CONFIG.colors.text.secondary}; font-size: 14px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💳 Payment Received</h1>
                <p>Thank you for your payment!</p>
            </div>
            
            <div class="content">
                <h2>Hi ${user.fullName},</h2>
                
                <p>We've successfully received your payment. Here are the details:</p>
                
                <div class="receipt-card">
                    <h3>📄 Receipt #${payment.id}</h3>
                    <p><strong>Date:</strong> ${new Date(payment.payment_date || payment.created_at).toLocaleDateString()}</p>
                    <p><strong>Service:</strong> ${appointment ? 'Nutrition Consultation' : 'NutriWise Service'}</p>
                    <p><strong>Payment Method:</strong> ${payment.payment_method || 'Online Payment'}</p>
                    <p><strong>Transaction ID:</strong> ${payment.transaction_id || 'N/A'}</p>
                    
                    <div class="amount">
                        ${payment.currency || 'USD'} $${payment.amount}
                    </div>
                </div>
                
                ${appointment ? `
                <h3>📅 Appointment Details</h3>
                <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${new Date(appointment.appointment_date).toLocaleTimeString()}</p>
                ` : ''}
                
                <p>A detailed invoice has been attached to this email for your records.</p>
                
                <p><strong>Questions about your payment?</strong> Contact our support team at ${BRAND_CONFIG.contact.email}</p>
                
                <p>Thank you for choosing ${BRAND_CONFIG.name}!</p>
                <p><strong>The ${BRAND_CONFIG.name} Team</strong></p>
            </div>
            
            <div class="footer">
                <p>${BRAND_CONFIG.business.name}</p>
                <p>This is an automated receipt. Please save for your records.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generatePaymentReceiptText(user, payment, appointment) {
    return `
Payment Receipt - ${BRAND_CONFIG.name}

Hi ${user.fullName},

Payment successfully received!

RECEIPT #${payment.id}
Date: ${new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
Service: ${appointment ? 'Nutrition Consultation' : 'NutriWise Service'}
Payment Method: ${payment.payment_method || 'Online Payment'}
Transaction ID: ${payment.transaction_id || 'N/A'}
Amount: ${payment.currency || 'USD'} $${payment.amount}

${appointment ? `
APPOINTMENT DETAILS:
Date: ${new Date(appointment.appointment_date).toLocaleDateString()}
Time: ${new Date(appointment.appointment_date).toLocaleTimeString()}
` : ''}

A detailed invoice is attached for your records.

Questions? Contact: ${BRAND_CONFIG.contact.email}

Thank you for choosing ${BRAND_CONFIG.name}!
The ${BRAND_CONFIG.name} Team
    `;
  }

  generateInvoiceEmailHTML(user, payment) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice #${payment.id} - ${BRAND_CONFIG.name}</title>
        <style>
            body { font-family: ${BRAND_CONFIG.fonts.primary}; line-height: 1.6; color: ${BRAND_CONFIG.colors.text.primary}; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; background: ${BRAND_CONFIG.colors.primary}; color: white; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: white; border: 1px solid #e0e0e0; }
            .invoice-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: ${BRAND_CONFIG.colors.primary}; text-align: center; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: ${BRAND_CONFIG.colors.primary}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
            .footer { text-align: center; padding: 20px; color: ${BRAND_CONFIG.colors.text.secondary}; font-size: 14px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📄 Invoice #${payment.id}</h1>
                <p>Your invoice is ready</p>
            </div>
            
            <div class="content">
                <h2>Hi ${user.fullName},</h2>
                
                <p>Thank you for your payment! Your invoice is attached to this email for your records.</p>
                
                <div class="invoice-card">
                    <h3>💳 Payment Summary</h3>
                    <p><strong>Date:</strong> ${new Date(payment.payment_date || payment.created_at).toLocaleDateString()}</p>
                    <p><strong>Service:</strong> NutriWise Service</p>
                    <p><strong>Payment Method:</strong> ${payment.payment_method || 'Online Payment'}</p>
                    <p><strong>Status:</strong> ${payment.status.toUpperCase()}</p>
                    
                    <div class="amount">
                        ${payment.currency || 'USD'} $${payment.amount}
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${BRAND_CONFIG.social.website}/dashboard" class="button">View Dashboard</a>
                    <a href="${BRAND_CONFIG.social.website}/payments" class="button">Payment History</a>
                </div>
                
                <p><strong>Need a copy of this invoice?</strong> You can download it anytime from your dashboard.</p>
                
                <p><strong>Questions about your invoice?</strong> Contact our support team at ${BRAND_CONFIG.contact.email}</p>
                
                <p>Thank you for choosing ${BRAND_CONFIG.name}!</p>
                <p><strong>The ${BRAND_CONFIG.name} Team</strong></p>
            </div>
            
            <div class="footer">
                <p>${BRAND_CONFIG.business.name}</p>
                <p>This invoice has been generated automatically</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateInvoiceEmailText(user, payment) {
    return `
Invoice #${payment.id} - ${BRAND_CONFIG.name}

Hi ${user.fullName},

Your invoice is attached to this email for your records.

PAYMENT SUMMARY:
Date: ${new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
Service: NutriWise Service
Payment Method: ${payment.payment_method || 'Online Payment'}
Status: ${payment.status.toUpperCase()}
Amount: ${payment.currency || 'USD'} $${payment.amount}

Dashboard: ${BRAND_CONFIG.social.website}/dashboard
Payment History: ${BRAND_CONFIG.social.website}/payments

Need a copy? Download anytime from your dashboard.
Questions? Contact: ${BRAND_CONFIG.contact.email}

Thank you for choosing ${BRAND_CONFIG.name}!
The ${BRAND_CONFIG.name} Team
    `;
  }
}

module.exports = EmailService;
