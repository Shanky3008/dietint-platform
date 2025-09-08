import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Socket } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface MessageData {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  userId?: string;
  coachId?: string;
  consultationId?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'coach' | 'admin';
  isOnline: boolean;
  lastSeen?: Date;
}

export interface ConsultationRoom {
  id: string;
  clientId: string;
  coachId: string;
  status: 'active' | 'ended' | 'scheduled';
  startTime: Date;
  endTime?: Date;
  messages: MessageData[];
}

// In-memory storage for consultation rooms and active users
const consultationRooms = new Map<string, ConsultationRoom>();
const activeUsers = new Map<string, UserData>();

// Socket.io server configuration
export const configureSocketIO = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://coachpulse.in', 'https://www.coachpulse.in']
        : ['http://localhost:3000', 'http://localhost:3002'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Use module-level maps to persist state across connections

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining
    socket.on('join', (userData: UserData) => {
      activeUsers.set(socket.id, { ...userData, isOnline: true });
      socket.join(`user_${userData.id}`);
      
      // Notify about user status
      socket.broadcast.emit('user_status', {
        userId: userData.id,
        isOnline: true,
        lastSeen: new Date()
      });
    });

    // Handle joining consultation room
    socket.on('join_consultation', (consultationId: string) => {
      socket.join(`consultation_${consultationId}`);
      
      // Send consultation history if available
      const consultation = consultationRooms.get(consultationId);
      if (consultation) {
        socket.emit('consultation_history', consultation.messages);
      }
    });

    // Handle sending messages
    socket.on('send_message', (messageData: MessageData) => {
      const message: MessageData = {
        ...messageData,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      // Store message in consultation room
      if (messageData.consultationId) {
        const consultation = consultationRooms.get(messageData.consultationId);
        if (consultation) {
          consultation.messages.push(message);
        }
        
        // Broadcast to consultation room
        socket.to(`consultation_${messageData.consultationId}`).emit('new_message', message);
      }

      // Send confirmation back to sender
      socket.emit('message_sent', message);
    });

    // Handle typing indicators
    socket.on('typing_start', (data: { consultationId: string; userId: string; userName: string }) => {
      socket.to(`consultation_${data.consultationId}`).emit('user_typing', {
        userId: data.userId,
        userName: data.userName,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data: { consultationId: string; userId: string }) => {
      socket.to(`consultation_${data.consultationId}`).emit('user_typing', {
        userId: data.userId,
        isTyping: false
      });
    });

    // Handle video call signaling
    socket.on('video_call_request', (data: { consultationId: string; from: string; to: string }) => {
      socket.to(`user_${data.to}`).emit('incoming_video_call', {
        consultationId: data.consultationId,
        from: data.from,
        callId: `call_${Date.now()}`
      });
    });

    socket.on('video_call_answer', (data: { callId: string; accept: boolean; to: string }) => {
      socket.to(`user_${data.to}`).emit('video_call_answered', {
        callId: data.callId,
        accepted: data.accept
      });
    });

    socket.on('video_call_end', (data: { callId: string; to: string }) => {
      socket.to(`user_${data.to}`).emit('video_call_ended', {
        callId: data.callId
      });
    });

    // Handle coach availability
    socket.on('coach_status', (data: { userId: string; available: boolean }) => {
      const user = activeUsers.get(socket.id);
      if (user && user.role === 'coach') {
        socket.broadcast.emit('coach_availability', {
          coachId: data.userId,
          available: data.available
        });
      }
    });

    // Handle consultation status updates
    socket.on('consultation_status', (data: { consultationId: string; status: string }) => {
      const consultation = consultationRooms.get(data.consultationId);
      if (consultation) {
        consultation.status = data.status as 'active' | 'ended' | 'scheduled';
        
        // Notify all participants
        socket.to(`consultation_${data.consultationId}`).emit('consultation_updated', {
          consultationId: data.consultationId,
          status: data.status
        });
      }
    });

    // Handle file sharing
    socket.on('share_file', (data: { 
      consultationId: string; 
      fileName: string; 
      fileType: string; 
      fileUrl: string;
      sender: string;
    }) => {
      const message: MessageData = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: data.fileUrl,
        sender: data.sender,
        timestamp: new Date(),
        type: 'file',
        consultationId: data.consultationId
      };

      // Store and broadcast file message
      const consultation = consultationRooms.get(data.consultationId);
      if (consultation) {
        consultation.messages.push(message);
      }
      
      socket.to(`consultation_${data.consultationId}`).emit('new_message', message);
      socket.emit('message_sent', message);
    });

    // Handle quick consultation requests
    socket.on('quick_consultation_request', (data: { 
      clientId: string; 
      message: string; 
      urgency: 'low' | 'medium' | 'high' 
    }) => {
      // Notify available coaches
      socket.broadcast.emit('quick_consultation_available', {
        clientId: data.clientId,
        message: data.message,
        urgency: data.urgency,
        requestId: `req_${Date.now()}`
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const user = activeUsers.get(socket.id);
      if (user) {
        activeUsers.delete(socket.id);
        
        // Notify about user going offline
        socket.broadcast.emit('user_status', {
          userId: user.id,
          isOnline: false,
          lastSeen: new Date()
        });
      }
      
      console.log('User disconnected:', socket.id);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      socket.emit('error_message', {
        message: 'An error occurred. Please try again.',
        timestamp: new Date()
      });
    });
  });

  return io;
};

// Helper function to create or get consultation room
export const getOrCreateConsultationRoom = (
  consultationId: string,
  clientId: string,
  coachId: string
): ConsultationRoom => {
  const existingRoom = consultationRooms.get(consultationId);
  if (existingRoom) {
    return existingRoom;
  }

  const newRoom: ConsultationRoom = {
    id: consultationId,
    clientId,
    coachId,
    status: 'active',
    startTime: new Date(),
    messages: []
  };

  consultationRooms.set(consultationId, newRoom);
  return newRoom;
};

// Helper function to get active users
export const getActiveUsers = (): UserData[] => {
  return Array.from(activeUsers.values());
};

// Helper function to check if user is online
export const isUserOnline = (userId: string): boolean => {
  return Array.from(activeUsers.values()).some(user => user.id === userId && user.isOnline);
};
