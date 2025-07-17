import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_CONFIG = {
  baseURL: __DEV__ 
    ? 'http://localhost:3002' // Development URL
    : 'https://dietint-platform.vercel.app', // Production URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Create axios instance
export const api = axios.create(API_CONFIG);

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const tokenData = await AsyncStorage.getItem('@dietint_token');
      if (tokenData) {
        const token = JSON.parse(tokenData);
        if (token.accessToken) {
          config.headers.Authorization = `Bearer ${token.accessToken}`;
        }
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    
    // Add platform identifier
    config.headers['X-Platform'] = 'mobile';
    config.headers['X-App-Version'] = '1.0.0';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh on 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokenData = await AsyncStorage.getItem('@dietint_token');
        if (tokenData) {
          const token = JSON.parse(tokenData);
          
          // Attempt to refresh token
          const refreshResponse = await axios.post(`${API_CONFIG.baseURL}/api/auth/refresh`, {
            refreshToken: token.refreshToken
          });
          
          const newToken = refreshResponse.data.token;
          
          // Update stored token
          await AsyncStorage.setItem('@dietint_token', JSON.stringify(newToken));
          
          // Update authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
          
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear session
        await AsyncStorage.multiRemove([
          '@dietint_user',
          '@dietint_token',
          '@dietint_nutritionist_profile'
        ]);
        
        // You might want to navigate to login screen here
        // This would typically be handled by your navigation service
        console.error('Token refresh failed:', refreshError);
      }
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your internet connection.';
    } else if (error.message === 'Network Error') {
      error.message = 'Network error. Please check your internet connection.';
    }
    
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  ME: '/api/auth/me',
  UPDATE_LAST_LOGIN: '/api/auth/update-last-login',

  // User Management
  UPDATE_PROFILE: (id: string) => `/api/users/${id}`,
  UPLOAD_AVATAR: '/api/users/avatar',
  
  // Nutritionist
  NUTRITIONIST_PROFILE: (id: string) => `/api/nutritionist/profile/${id}`,
  CREATE_NUTRITIONIST_PROFILE: '/api/nutritionist/profile',
  UPDATE_NUTRITIONIST_PROFILE: (id: string) => `/api/nutritionist/profile/${id}`,
  
  // Appointments
  APPOINTMENTS: '/api/appointments',
  APPOINTMENT_DETAILS: (id: string) => `/api/appointments/${id}`,
  BOOK_APPOINTMENT: '/api/appointments/book',
  CANCEL_APPOINTMENT: (id: string) => `/api/appointments/${id}/cancel`,
  RESCHEDULE_APPOINTMENT: (id: string) => `/api/appointments/${id}/reschedule`,
  
  // Diet Plans
  DIET_PLANS: '/api/diet-plans',
  DIET_PLAN_DETAILS: (id: string) => `/api/diet-plans/${id}`,
  CREATE_DIET_PLAN: '/api/diet-plans',
  UPDATE_DIET_PLAN: (id: string) => `/api/diet-plans/${id}`,
  
  // Progress Tracking
  PROGRESS: '/api/progress',
  LOG_PROGRESS: '/api/progress/log',
  PROGRESS_HISTORY: '/api/progress/history',
  
  // Health Check-ins
  HEALTH_CHECKINS: '/api/health-checkins',
  SUBMIT_HEALTH_CHECKIN: '/api/health-checkins/submit',
  HEALTH_CHECKIN_HISTORY: '/api/health-checkins/history',
  
  // Photo Food Log
  PHOTO_FOOD_LOG: '/api/photo-food-log',
  ANALYZE_FOOD_PHOTO: '/api/photo-food-log/analyze',
  FOOD_LOG_HISTORY: '/api/photo-food-log/history',
  
  // Messaging
  CONVERSATIONS: '/api/conversations',
  CONVERSATION_MESSAGES: (id: string) => `/api/conversations/${id}/messages`,
  SEND_MESSAGE: '/api/messages/send',
  
  // Notifications
  NOTIFICATIONS: '/api/notifications',
  MARK_READ: (id: string) => `/api/notifications/${id}/read`,
  MARK_ALL_READ: '/api/notifications/read-all',
  
  // Chatbot
  CHATBOT: '/api/chatbot',
  
  // Video Calls
  VIDEO_CALLS: '/api/video-calls',
  CREATE_VIDEO_ROOM: '/api/video-calls/create-room',
  JOIN_VIDEO_ROOM: (id: string) => `/api/video-calls/${id}/join`,
  
  // File Upload
  UPLOAD_FILE: '/api/upload',
  
  // Content
  ARTICLES: '/api/articles',
  ARTICLE_DETAILS: (id: string) => `/api/articles/${id}`,
  
  // Payments
  PAYMENTS: '/api/payments',
  PAYMENT_HISTORY: '/api/payments/history',
  CREATE_PAYMENT: '/api/payments/create',
  
  // Admin (for nutritionist)
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_CLIENTS: '/api/admin/clients',
  ADMIN_APPOINTMENTS: '/api/admin/appointments',
  ADMIN_REPORTS: '/api/admin/reports',
};

// API Service Functions
export const authService = {
  login: (credentials: { username: string; password: string }) =>
    api.post(API_ENDPOINTS.LOGIN, credentials),
  
  register: (userData: any) =>
    api.post(API_ENDPOINTS.REGISTER, userData),
  
  logout: () =>
    api.post(API_ENDPOINTS.LOGOUT),
  
  refreshToken: (refreshToken: string) =>
    api.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken }),
  
  getMe: () =>
    api.get(API_ENDPOINTS.ME),
  
  updateLastLogin: () =>
    api.patch(API_ENDPOINTS.UPDATE_LAST_LOGIN),
};

export const userService = {
  updateProfile: (id: string, data: any) =>
    api.patch(API_ENDPOINTS.UPDATE_PROFILE(id), data),
  
  uploadAvatar: (formData: FormData) =>
    api.post(API_ENDPOINTS.UPLOAD_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const nutritionistService = {
  getProfile: (id: string) =>
    api.get(API_ENDPOINTS.NUTRITIONIST_PROFILE(id)),
  
  createProfile: (data: any) =>
    api.post(API_ENDPOINTS.CREATE_NUTRITIONIST_PROFILE, data),
  
  updateProfile: (id: string, data: any) =>
    api.patch(API_ENDPOINTS.UPDATE_NUTRITIONIST_PROFILE(id), data),
};

export const appointmentService = {
  getAppointments: (params?: any) =>
    api.get(API_ENDPOINTS.APPOINTMENTS, { params }),
  
  getAppointmentDetails: (id: string) =>
    api.get(API_ENDPOINTS.APPOINTMENT_DETAILS(id)),
  
  bookAppointment: (data: any) =>
    api.post(API_ENDPOINTS.BOOK_APPOINTMENT, data),
  
  cancelAppointment: (id: string, reason?: string) =>
    api.patch(API_ENDPOINTS.CANCEL_APPOINTMENT(id), { reason }),
  
  rescheduleAppointment: (id: string, data: any) =>
    api.patch(API_ENDPOINTS.RESCHEDULE_APPOINTMENT(id), data),
};

export const dietPlanService = {
  getDietPlans: (params?: any) =>
    api.get(API_ENDPOINTS.DIET_PLANS, { params }),
  
  getDietPlanDetails: (id: string) =>
    api.get(API_ENDPOINTS.DIET_PLAN_DETAILS(id)),
  
  createDietPlan: (data: any) =>
    api.post(API_ENDPOINTS.CREATE_DIET_PLAN, data),
  
  updateDietPlan: (id: string, data: any) =>
    api.patch(API_ENDPOINTS.UPDATE_DIET_PLAN(id), data),
};

export const progressService = {
  getProgress: (params?: any) =>
    api.get(API_ENDPOINTS.PROGRESS, { params }),
  
  logProgress: (data: any) =>
    api.post(API_ENDPOINTS.LOG_PROGRESS, data),
  
  getProgressHistory: (params?: any) =>
    api.get(API_ENDPOINTS.PROGRESS_HISTORY, { params }),
};

export const healthCheckinService = {
  getHealthCheckins: (params?: any) =>
    api.get(API_ENDPOINTS.HEALTH_CHECKINS, { params }),
  
  submitHealthCheckin: (data: any) =>
    api.post(API_ENDPOINTS.SUBMIT_HEALTH_CHECKIN, data),
  
  getHealthCheckinHistory: (params?: any) =>
    api.get(API_ENDPOINTS.HEALTH_CHECKIN_HISTORY, { params }),
};

export const photoFoodLogService = {
  getPhotoFoodLog: (params?: any) =>
    api.get(API_ENDPOINTS.PHOTO_FOOD_LOG, { params }),
  
  analyzeFoodPhoto: (formData: FormData) =>
    api.post(API_ENDPOINTS.ANALYZE_FOOD_PHOTO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getFoodLogHistory: (params?: any) =>
    api.get(API_ENDPOINTS.FOOD_LOG_HISTORY, { params }),
};

export const messagingService = {
  getConversations: (params?: any) =>
    api.get(API_ENDPOINTS.CONVERSATIONS, { params }),
  
  getConversationMessages: (id: string, params?: any) =>
    api.get(API_ENDPOINTS.CONVERSATION_MESSAGES(id), { params }),
  
  sendMessage: (data: any) =>
    api.post(API_ENDPOINTS.SEND_MESSAGE, data),
};

export const notificationService = {
  getNotifications: (params?: any) =>
    api.get(API_ENDPOINTS.NOTIFICATIONS, { params }),
  
  markAsRead: (id: string) =>
    api.patch(API_ENDPOINTS.MARK_READ(id)),
  
  markAllAsRead: () =>
    api.patch(API_ENDPOINTS.MARK_ALL_READ),
};

export const chatbotService = {
  sendMessage: (data: any) =>
    api.post(API_ENDPOINTS.CHATBOT, data),
};

export const videoCallService = {
  getVideoCalls: (params?: any) =>
    api.get(API_ENDPOINTS.VIDEO_CALLS, { params }),
  
  createVideoRoom: (data: any) =>
    api.post(API_ENDPOINTS.CREATE_VIDEO_ROOM, data),
  
  joinVideoRoom: (id: string) =>
    api.post(API_ENDPOINTS.JOIN_VIDEO_ROOM(id)),
};

export const fileService = {
  uploadFile: (formData: FormData) =>
    api.post(API_ENDPOINTS.UPLOAD_FILE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const contentService = {
  getArticles: (params?: any) =>
    api.get(API_ENDPOINTS.ARTICLES, { params }),
  
  getArticleDetails: (id: string) =>
    api.get(API_ENDPOINTS.ARTICLE_DETAILS(id)),
};

export const paymentService = {
  getPayments: (params?: any) =>
    api.get(API_ENDPOINTS.PAYMENTS, { params }),
  
  getPaymentHistory: (params?: any) =>
    api.get(API_ENDPOINTS.PAYMENT_HISTORY, { params }),
  
  createPayment: (data: any) =>
    api.post(API_ENDPOINTS.CREATE_PAYMENT, data),
};

export const adminService = {
  getDashboard: () =>
    api.get(API_ENDPOINTS.ADMIN_DASHBOARD),
  
  getClients: (params?: any) =>
    api.get(API_ENDPOINTS.ADMIN_CLIENTS, { params }),
  
  getAppointments: (params?: any) =>
    api.get(API_ENDPOINTS.ADMIN_APPOINTMENTS, { params }),
  
  getReports: (params?: any) =>
    api.get(API_ENDPOINTS.ADMIN_REPORTS, { params }),
};

export default api;