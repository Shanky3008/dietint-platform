'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Send,
  Chat,
  Close,
  Warning,
  HealthAndSafety,
  Psychology,
  Restaurant,
  LocalHospital,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatbotWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
}

const QUICK_QUESTIONS = [
  "What are the nutritional benefits of dal?",
  "How can I manage diabetes with Indian foods?",
  "What should I eat during summer in India?",
  "Best breakfast options for weight loss?",
  "PCOD diet plan with Indian foods",
  "Healthy snacks for children"
];

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: 'Gouri Priya is typing...',
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact me directly for consultation.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text: string) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  const positionStyles = {
    'bottom-right': { bottom: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 1000,
          background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
          }
        }}
      >
        <Chat />
      </Fab>

      {/* Chat Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 80,
            right: 20,
            m: 0,
            width: 400,
            height: 600,
            maxWidth: '90vw',
            maxHeight: '80vh',
            borderRadius: 3,
            boxShadow: 3
          }
        }}
      >
        {/* Header */}
        <DialogTitle sx={{ pb: 1, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                <Psychology />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Nutrition AI Assistant
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  by Gouri Priya Mylavarapu
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Disclaimer */}
          <AnimatePresence>
            {showDisclaimer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity="info"
                  icon={<HealthAndSafety />}
                  action={
                    <Button
                      size="small"
                      onClick={() => setShowDisclaimer(false)}
                      sx={{ color: 'info.main' }}
                    >
                      Got it
                    </Button>
                  }
                  sx={{ m: 2, borderRadius: 2 }}
                >
                  <Typography variant="body2">
                    <strong>Health Disclaimer:</strong> This AI provides general nutritional information based on 15+ years of experience. 
                    For personalized medical advice, please consult healthcare providers.
                  </Typography>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Questions */}
          {messages.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Quick Questions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {QUICK_QUESTIONS.slice(0, 3).map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage(question)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'primary.50',
                        borderColor: 'primary.main'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <List sx={{ p: 0 }}>
              {messages.map((message) => (
                <ListItem key={message.id} sx={{ px: 0, py: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      sx={{
                        px: 2,
                        py: 1,
                        maxWidth: '80%',
                        bgcolor: message.isUser ? 'primary.main' : 'grey.100',
                        color: message.isUser ? 'white' : 'text.primary',
                        borderRadius: 2,
                        ...(message.isTyping && {
                          bgcolor: 'secondary.50',
                          border: '1px solid',
                          borderColor: 'secondary.200'
                        })
                      }}
                    >
                      {message.isTyping ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} color="secondary" />
                          <Typography variant="body2" color="text.secondary">
                            {message.text}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(message.text)
                          }}
                        />
                      )}
                    </Paper>
                  </Box>
                </ListItem>
              ))}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Input Area */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about nutrition, Indian foods, diet plans..."
                multiline
                maxRows={3}
                fullWidth
                size="small"
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <IconButton
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                color="primary"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
              >
                {isLoading ? <CircularProgress size={20} /> : <Send />}
              </IconButton>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              💡 Ask about Indian nutrition, seasonal foods, therapeutic diets, or weight management
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatbotWidget;