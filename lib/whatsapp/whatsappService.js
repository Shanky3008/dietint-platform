// WhatsApp Business API integration for NutriWise
const axios = require('axios');
const { BRAND_CONFIG } = require('../branding');
const { getDatabaseAdapter } = require('../database');

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.businessPhoneNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '+1234567890';
    this.apiVersion = 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  // Send WhatsApp message using Business API
  async sendMessage(to, messageData) {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        console.log('WhatsApp API not configured, skipping message send');
        return { success: false, error: 'WhatsApp API not configured' };
      }

      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: to.replace(/[^\d]/g, ''), // Clean phone number
        ...messageData
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Log message to database
      await this.logMessage({
        recipient: to,
        message_type: messageData.type,
        status: 'sent',
        message_id: response.data.messages[0].id,
        content: JSON.stringify(messageData)
      });

      return { success: true, messageId: response.data.messages[0].id };

    } catch (error) {
      console.error('WhatsApp message failed:', error.response?.data || error.message);
      
      // Log failed message
      await this.logMessage({
        recipient: to,
        message_type: messageData.type,
        status: 'failed',
        error: error.response?.data?.error?.message || error.message,
        content: JSON.stringify(messageData)
      });

      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  async logMessage(logData) {
    try {
      const db = await getDatabaseAdapter();
      
      await db.run(`
        INSERT INTO whatsapp_logs (
          recipient, message_type, status, message_id, error, content, sent_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        logData.recipient,
        logData.message_type,
        logData.status,
        logData.message_id || null,
        logData.error || null,
        logData.content,
        new Date().toISOString()
      ]);
      
    } catch (error) {
      console.error('Failed to log WhatsApp message:', error);
    }
  }

  // Welcome message for new users
  async sendWelcomeMessage(phoneNumber, userName) {
    const messageData = {
      type: 'template',
      template: {
        name: 'welcome_message',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: BRAND_CONFIG.name }
            ]
          }
        ]
      }
    };

    return await this.sendMessage(phoneNumber, messageData);
  }

  // Appointment confirmation message
  async sendAppointmentConfirmation(phoneNumber, userName, appointment, dietitian) {
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

    const messageData = {
      type: 'text',
      text: `🎉 *Appointment Confirmed!*

Hi ${userName}! Your nutrition consultation has been confirmed.

📅 *Appointment Details:*
• Dietitian: ${dietitian.fullName}
• Date: ${formattedDate}
• Time: ${formattedTime}
• Duration: ${appointment.duration || 60} minutes
• Type: ${appointment.meeting_type === 'online' ? 'Online Video Call 📹' : 'In-Person 🏥'}

${appointment.meeting_link ? `🔗 Meeting Link: ${appointment.meeting_link}` : ''}

🎯 *Prepare for your session:*
• Complete your health questionnaire
• List any specific goals or concerns
• Prepare recent lab results
• Note current medications/supplements

Questions? Reply to this message or call ${BRAND_CONFIG.contact.phone}

Looking forward to helping you achieve your health goals! 💪

Best regards,
${BRAND_CONFIG.name} Team 🧠`
    };

    return await this.sendMessage(phoneNumber, messageData);
  }

  // Appointment reminder (1 day before)
  async sendAppointmentReminder(phoneNumber, userName, appointment, dietitian) {
    const appointmentDate = new Date(appointment.appointment_date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const messageData = {
      type: 'text',
      text: `⏰ *Appointment Reminder*

Hi ${userName}! This is a reminder that your nutrition consultation is *tomorrow*.

📅 *Tomorrow's Appointment:*
• Dietitian: ${dietitian.fullName}
• Date: ${formattedDate}
• Time: ${formattedTime}
• Type: ${appointment.meeting_type === 'online' ? 'Online Video Call 📹' : 'In-Person 🏥'}

${appointment.meeting_link ? `🔗 Meeting Link: ${appointment.meeting_link}` : ''}

✅ *Last-minute preparation:*
• Test your internet connection and camera
• Find a quiet, private space
• Have a glass of water and notebook ready
• Review any questions you want to ask

Need to reschedule? Please let us know at least 2 hours before your appointment.

See you tomorrow! 😊

${BRAND_CONFIG.name} Team 🧠`
    };

    return await this.sendMessage(phoneNumber, messageData);
  }

  // Send diet plan
  async sendDietPlan(phoneNumber, userName, dietPlan) {
    const messageData = {
      type: 'text',
      text: `🥗 *Your Personalized Diet Plan is Ready!*

Hi ${userName}! Your customized nutrition plan has been prepared by our expert dietitians.

📋 *Diet Plan: "${dietPlan.title}"*
${dietPlan.description ? `\n📝 *Description:* ${dietPlan.description}` : ''}

🎯 *Duration:* ${dietPlan.start_date ? new Date(dietPlan.start_date).toLocaleDateString() : 'Starting now'} ${dietPlan.end_date ? `to ${new Date(dietPlan.end_date).toLocaleDateString()}` : ''}

📱 *Next Steps:*
• Log into your ${BRAND_CONFIG.name} dashboard to view the complete plan
• Download the meal planning guide
• Set up your progress tracking
• Schedule a follow-up consultation if needed

🔗 *Access your plan:* ${BRAND_CONFIG.social.website}/dashboard

💡 *Remember:* Consistency is key! Follow your plan and track your progress for the best results.

Questions about your diet plan? Reply to this message anytime!

Here's to your health journey! 🚀

${BRAND_CONFIG.name} Team 🧠`
    };

    return await this.sendMessage(phoneNumber, messageData);
  }

  // Payment confirmation
  async sendPaymentConfirmation(phoneNumber, userName, payment, service) {
    const messageData = {
      type: 'text',
      text: `💳 *Payment Received!*

Hi ${userName}! We've successfully received your payment.

🧾 *Receipt Details:*
• Amount: ${payment.currency || 'USD'} $${payment.amount}
• Service: ${service || 'NutriWise Service'}
• Transaction ID: ${payment.transaction_id || 'N/A'}
• Date: ${new Date(payment.payment_date || payment.created_at).toLocaleDateString()}

📧 A detailed receipt has been sent to your email address.

Thank you for choosing ${BRAND_CONFIG.name}! 💚

${BRAND_CONFIG.name} Team 🧠`
    };

    return await this.sendMessage(phoneNumber, messageData);
  }

  // General support message
  async sendSupportMessage(phoneNumber, userName, message) {
    const messageData = {
      type: 'text',
      text: `Hi ${userName}! 👋

${message}

Need immediate assistance? Here are some quick options:

🔗 *Dashboard:* ${BRAND_CONFIG.social.website}/dashboard
📧 *Email:* ${BRAND_CONFIG.contact.email}
📞 *Phone:* ${BRAND_CONFIG.contact.phone}

Our support team is here to help you succeed on your nutrition journey!

Best regards,
${BRAND_CONFIG.name} Team 🧠`
    };

    return await this.sendMessage(phoneNumber, messageData);
  }

  // Generate click-to-chat URL
  generateWhatsAppURL(phoneNumber, message) {
    const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
  }

  // Get business phone number for click-to-chat
  getBusinessWhatsAppURL(prefilledMessage = '') {
    const defaultMessage = prefilledMessage || `Hi! I'm interested in ${BRAND_CONFIG.name} nutrition services. Can you help me get started?`;
    return this.generateWhatsAppURL(this.businessPhoneNumber, defaultMessage);
  }

  // Webhook verification for WhatsApp Business API
  verifyWebhook(mode, token, challenge) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    
    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('WhatsApp webhook verified');
        return challenge;
      } else {
        console.log('WhatsApp webhook verification failed');
        return null;
      }
    }
    return null;
  }

  // Process incoming webhook messages
  async processWebhook(body) {
    try {
      if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;

        if (value?.messages) {
          for (const message of value.messages) {
            await this.handleIncomingMessage(message, value.contacts?.[0]);
          }
        }

        if (value?.statuses) {
          for (const status of value.statuses) {
            await this.handleMessageStatus(status);
          }
        }
      }
      return { success: true };
    } catch (error) {
      console.error('WhatsApp webhook processing error:', error);
      return { success: false, error: error.message };
    }
  }

  async handleIncomingMessage(message, contact) {
    // Auto-reply logic for incoming messages
    const phoneNumber = message.from;
    const messageText = message.text?.body?.toLowerCase();
    const customerName = contact?.profile?.name || 'there';

    // Simple keyword-based auto-replies
    let replyMessage = '';

    if (messageText?.includes('appointment') || messageText?.includes('book')) {
      replyMessage = `Hi ${customerName}! 📅 To book an appointment, please visit our website: ${BRAND_CONFIG.social.website}/dashboard or call us at ${BRAND_CONFIG.contact.phone}. Our team will be happy to schedule your consultation!`;
    } else if (messageText?.includes('price') || messageText?.includes('cost')) {
      replyMessage = `Hi ${customerName}! 💰 For pricing information, please visit our website: ${BRAND_CONFIG.social.website} or speak with our team at ${BRAND_CONFIG.contact.phone}. We offer personalized nutrition plans starting at $29/month!`;
    } else if (messageText?.includes('diet plan') || messageText?.includes('meal plan')) {
      replyMessage = `Hi ${customerName}! 🥗 Our personalized diet plans are created by certified dietitians. Visit ${BRAND_CONFIG.social.website}/dashboard to get started or book a consultation!`;
    } else {
      replyMessage = `Hi ${customerName}! 👋 Thank you for contacting ${BRAND_CONFIG.name}. Our team will get back to you shortly. For immediate assistance, visit ${BRAND_CONFIG.social.website} or call ${BRAND_CONFIG.contact.phone}.`;
    }

    // Send auto-reply
    await this.sendMessage(phoneNumber, {
      type: 'text',
      text: replyMessage
    });

    // Log the incoming message for follow-up
    await this.logMessage({
      recipient: phoneNumber,
      message_type: 'incoming',
      status: 'received',
      content: JSON.stringify({ text: message.text?.body, contact: contact?.profile?.name })
    });
  }

  async handleMessageStatus(status) {
    // Update message status in logs
    try {
      const db = await getDatabaseAdapter();
      await db.run(`
        UPDATE whatsapp_logs 
        SET status = ?, updated_at = ? 
        WHERE message_id = ?
      `, [status.status, new Date().toISOString(), status.id]);
    } catch (error) {
      console.error('Failed to update message status:', error);
    }
  }
}

module.exports = WhatsAppService;