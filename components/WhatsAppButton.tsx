'use client';

import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { WhatsApp, Close } from '@mui/icons-material';
import { BRAND_CONFIG } from '@/lib/branding';

interface WhatsAppButtonProps {
  position?: 'bottom-right' | 'bottom-left';
  size?: 'small' | 'medium' | 'large';
  phoneNumber?: string;
  showDialog?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  position = 'bottom-right',
  size = 'large',
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+1234567890',
  showDialog = true
}) => {
  const [open, setOpen] = useState(false);
  const [messageType, setMessageType] = useState('general');
  const [customMessage, setCustomMessage] = useState('');

  const messageTemplates = {
    general: `Hi! I'm interested in ${BRAND_CONFIG.name} nutrition services. Can you help me get started?`,
    appointment: `Hello! I'd like to book a nutrition consultation appointment. What times are available?`,
    diet_plan: `Hi! I'm interested in getting a personalized diet plan. Can you provide more information?`,
    support: `Hello! I need help with my ${BRAND_CONFIG.name} account. Can someone assist me?`,
    pricing: `Hi! Could you please share the pricing details for your nutrition services?`,
    custom: customMessage
  };

  const handleWhatsAppClick = () => {
    if (showDialog) {
      setOpen(true);
    } else {
      sendWhatsAppMessage(messageTemplates.general);
    }
  };

  const sendWhatsAppMessage = (message: string) => {
    const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const handleSendMessage = () => {
    const message = messageType === 'custom' ? customMessage : messageTemplates[messageType as keyof typeof messageTemplates];
    sendWhatsAppMessage(message);
  };

  const positionStyles = {
    'bottom-right': { position: 'fixed', bottom: 20, right: 20, zIndex: 1000 },
    'bottom-left': { position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }
  };

  return (
    <>
      <Fab
        color="success"
        aria-label="WhatsApp"
        size={size}
        onClick={handleWhatsAppClick}
        sx={{
          ...positionStyles[position],
          backgroundColor: '#25D366',
          '&:hover': {
            backgroundColor: '#128C7E',
          },
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)',
            },
            '70%': {
              boxShadow: '0 0 0 10px rgba(37, 211, 102, 0)',
            },
            '100%': {
              boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)',
            },
          },
        }}
      >
        <WhatsApp />
      </Fab>

      {showDialog && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              padding: 1
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WhatsApp sx={{ color: '#25D366' }} />
            <div>
              <Typography variant="h6">Contact us on WhatsApp</Typography>
              <Typography variant="body2" color="text.secondary">
                Get instant support from our nutrition experts
              </Typography>
            </div>
            <Button
              onClick={() => setOpen(false)}
              sx={{ marginLeft: 'auto', minWidth: 'auto', padding: 1 }}
            >
              <Close />
            </Button>
          </DialogTitle>

          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select message type</InputLabel>
                <Select
                  value={messageType}
                  label="Select message type"
                  onChange={(e) => setMessageType(e.target.value)}
                >
                  <MenuItem value="general">General Inquiry</MenuItem>
                  <MenuItem value="appointment">Book Appointment</MenuItem>
                  <MenuItem value="diet_plan">Diet Plan Information</MenuItem>
                  <MenuItem value="pricing">Pricing Details</MenuItem>
                  <MenuItem value="support">Support & Help</MenuItem>
                  <MenuItem value="custom">Custom Message</MenuItem>
                </Select>
              </FormControl>

              {messageType === 'custom' ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type your message here..."
                />
              ) : (
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Preview message:
                  </Typography>
                  <Typography variant="body1">
                    {messageTemplates[messageType as keyof typeof messageTemplates]}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Sending to:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {phoneNumber}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, backgroundColor: '#e8f5e9', borderRadius: 2 }}>
              <Typography variant="body2" color="success.main">
                💡 <strong>Tip:</strong> Our nutrition experts typically respond within a few minutes during business hours ({BRAND_CONFIG.contact.hours}).
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              variant="contained"
              disabled={messageType === 'custom' && !customMessage.trim()}
              sx={{
                backgroundColor: '#25D366',
                '&:hover': { backgroundColor: '#128C7E' },
                minWidth: 120
              }}
              startIcon={<WhatsApp />}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default WhatsAppButton;