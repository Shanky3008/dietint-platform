'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Avatar,
  Badge,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Send,
  AttachFile,
  VideoCall,
  Phone,
  MoreVert,
  Close,
  Check,
  Schedule,
  Circle,
  Image,
  Description,
  Mic,
  MicOff,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { MessageData, UserData } from '@/lib/socket';

interface MessagingInterfaceProps {
  userId: string;
  userName: string;
  userRole: 'client' | 'nutritionist';
  consultationId: string;
  recipientId: string;
  recipientName: string;
  onClose?: () => void;
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  userId,
  userName,
  userRole,
  consultationId,
  recipientId,
  recipientName,
  onClose
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);
  const [recipientOnline, setRecipientOnline] = useState(false);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3002', {
      path: '/api/socket',
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join', {
        id: userId,
        name: userName,
        role: userRole,
        isOnline: true
      });
      newSocket.emit('join_consultation', consultationId);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('consultation_history', (history: MessageData[]) => {
      setMessages(history);
    });

    newSocket.on('new_message', (message: MessageData) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('message_sent', (message: MessageData) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_typing', (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.userId === recipientId) {
        setRecipientTyping(data.isTyping);
      }
    });

    newSocket.on('user_status', (data: { userId: string; isOnline: boolean }) => {
      if (data.userId === recipientId) {
        setRecipientOnline(data.isOnline);
      }
    });

    newSocket.on('error_message', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId, userName, userRole, consultationId, recipientId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicators
  const handleTypingStart = () => {
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('typing_start', {
        consultationId,
        userId,
        userName
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit('typing_stop', { consultationId, userId });
        setIsTyping(false);
      }
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData: MessageData = {
      id: '', // Will be set by server
      content: newMessage,
      sender: userName,
      timestamp: new Date(),
      type: 'text',
      userId,
      consultationId
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
    
    // Stop typing indicator
    if (isTyping) {
      socket.emit('typing_stop', { consultationId, userId });
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !socket) return;

    setUploadingFile(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('consultationId', consultationId);
      formData.append('userId', userId);

      // Upload file to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { fileUrl } = await response.json();
        
        // Send file message through socket
        socket.emit('share_file', {
          consultationId,
          fileName: file.name,
          fileType: file.type,
          fileUrl,
          sender: userName
        });
      }
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploadingFile(false);
      setShowFileDialog(false);
    }
  };

  const handleVideoCall = () => {
    if (!socket) return;
    
    socket.emit('video_call_request', {
      consultationId,
      from: userId,
      to: recipientId
    });
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', blob, 'voice-message.wav');
        formData.append('consultationId', consultationId);
        formData.append('userId', userId);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok && socket) {
            const { fileUrl } = await response.json();
            socket.emit('share_file', {
              consultationId,
              fileName: 'voice-message.wav',
              fileType: 'audio/wav',
              fileUrl,
              sender: userName
            });
          }
        } catch (error) {
          console.error('Voice message upload failed:', error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image />;
      case 'file':
        return <Description />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, borderRadius: 0, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: recipientOnline ? '#44b700' : '#ccc',
                  color: recipientOnline ? '#44b700' : '#ccc',
                }
              }}
            >
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                {recipientName.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {recipientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {recipientOnline ? 'Online' : 'Offline'}
                {recipientTyping && ' • typing...'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Video Call">
              <IconButton onClick={handleVideoCall} color="primary">
                <VideoCall />
              </IconButton>
            </Tooltip>
            <Tooltip title="Voice Call">
              <IconButton color="primary">
                <Phone />
              </IconButton>
            </Tooltip>
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVert />
            </IconButton>
            {onClose && (
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>
        
        {!isConnected && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            Connection lost. Trying to reconnect...
          </Alert>
        )}
      </Paper>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        <List sx={{ p: 0 }}>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.userId === userId ? 'flex-end' : 'flex-start',
                px: 1,
                py: 0.5
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: '70%',
                  backgroundColor: message.userId === userId ? 'primary.main' : 'grey.100',
                  color: message.userId === userId ? 'white' : 'text.primary',
                  borderRadius: 2,
                  position: 'relative'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  {getMessageIcon(message.type)}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                      {message.content}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7, 
                        display: 'block', 
                        textAlign: 'right',
                        mt: 0.5
                      }}
                    >
                      {formatMessageTime(message.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Typing Indicator */}
      {recipientTyping && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {recipientName} is typing...
          </Typography>
        </Box>
      )}

      {/* File Upload Progress */}
      {uploadingFile && (
        <Box sx={{ px: 2, py: 1 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary">
            Uploading file...
          </Typography>
        </Box>
      )}

      {/* Input Area */}
      <Paper sx={{ p: 2, borderRadius: 0, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <IconButton onClick={() => setShowFileDialog(true)}>
            <AttachFile />
          </IconButton>
          
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTypingStart();
            }}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
          />
          
          <IconButton
            color="primary"
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            sx={{
              backgroundColor: isRecording ? 'error.main' : 'transparent',
              color: isRecording ? 'white' : 'primary.main',
              '&:hover': {
                backgroundColor: isRecording ? 'error.dark' : 'primary.50',
              }
            }}
          >
            {isRecording ? <MicOff /> : <Mic />}
          </IconButton>
          
          <IconButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            color="primary"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
                color: 'grey.500'
              }
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Paper>

      {/* File Upload Dialog */}
      <Dialog open={showFileDialog} onClose={() => setShowFileDialog(false)}>
        <DialogTitle>Share File</DialogTitle>
        <DialogContent>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept="image/*,application/pdf,.doc,.docx,.txt"
          />
          <Button
            fullWidth
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            sx={{ mb: 2 }}
          >
            Choose File
          </Button>
          <Typography variant="body2" color="text.secondary">
            Supported formats: Images, PDF, Word documents, Text files
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFileDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <Schedule sx={{ mr: 1 }} /> Schedule Consultation
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <Description sx={{ mr: 1 }} /> View History
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <Circle sx={{ mr: 1, color: 'error.main' }} /> End Consultation
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MessagingInterface;