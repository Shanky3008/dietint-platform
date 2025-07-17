import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/apiClient';

// Define user type for DietInt platform
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'client' | 'nutritionist';
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  medicalHistory?: string[];
  dietaryPreferences?: string[];
  allergies?: string[];
  goals?: string[];
  occupation?: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Professional nutritionist profile
export interface NutritionistProfile {
  id: string;
  userId: string;
  professionalName: 'Gouri Priya Mylavarapu';
  experience: '15+ years';
  location: 'Hyderabad, India';
  qualifications: string[];
  specializations: string[];
  languages: string[];
  consultationFee: number;
  availability: {
    days: string[];
    slots: { start: string; end: string; }[];
  };
  bio: string;
  isVerified: boolean;
  rating: number;
  totalConsultations: number;
}

// Define authentication context type
interface AuthContextProps {
  user: User | null;
  nutritionistProfile: NutritionistProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateNutritionistProfile: (data: Partial<NutritionistProfile>) => Promise<void>;
  refreshToken: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  isClient: boolean;
  isNutritionist: boolean;
}

// Define register data type
export interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  role: 'client' | 'nutritionist';
}

// Create authentication context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [nutritionistProfile, setNutritionistProfile] = useState<NutritionistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const isAuthenticated = !!user;
  const isClient = user?.role === 'client';
  const isNutritionist = user?.role === 'nutritionist';

  // Load user data from storage on app start
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('@dietint_user');
        const tokenJSON = await AsyncStorage.getItem('@dietint_token');
        
        if (userJSON && tokenJSON) {
          const storedUser = JSON.parse(userJSON);
          const storedToken = JSON.parse(tokenJSON);
          
          // Check if token is expired
          if (storedToken.expiresAt && new Date(storedToken.expiresAt) > new Date()) {
            // Set authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken.accessToken}`;
            
            try {
              // Verify token and get fresh user data
              const response = await api.get('/api/auth/me');
              const userData = response.data;
              
              setUser(userData);
              await AsyncStorage.setItem('@dietint_user', JSON.stringify(userData));
              
              // Load nutritionist profile if user is nutritionist
              if (userData.role === 'nutritionist') {
                await loadNutritionistProfile(userData.id);
              }
            } catch (err) {
              console.error('Token validation failed:', err);
              // Clear invalid session
              await clearSession();
            }
          } else {
            // Token expired, clear session
            await clearSession();
          }
        }
      } catch (err) {
        console.error('Failed to load user from storage:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Clear session helper
  const clearSession = async () => {
    await AsyncStorage.multiRemove([
      '@dietint_user',
      '@dietint_token',
      '@dietint_nutritionist_profile'
    ]);
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setNutritionistProfile(null);
  };

  // Load nutritionist profile
  const loadNutritionistProfile = async (userId: string) => {
    try {
      const response = await api.get(`/api/nutritionist/profile/${userId}`);
      const profile = response.data;
      
      setNutritionistProfile(profile);
      await AsyncStorage.setItem('@dietint_nutritionist_profile', JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to load nutritionist profile:', err);
    }
  };

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/api/auth/login', { 
        username, 
        password,
        platform: 'mobile' // Identify mobile platform
      });
      
      const { user: userData, token } = response.data;
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
      
      // Store user data and token
      await AsyncStorage.setItem('@dietint_user', JSON.stringify(userData));
      await AsyncStorage.setItem('@dietint_token', JSON.stringify(token));
      
      setUser(userData);
      
      // Load nutritionist profile if needed
      if (userData.role === 'nutritionist') {
        await loadNutritionistProfile(userData.id);
      }
      
      // Update last login
      await api.patch('/api/auth/update-last-login');
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response?.status === 401) {
        setError('Invalid credentials. Please check your username and password.');
      } else if (err.response?.status === 403) {
        setError('Account is not active. Please contact support.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/api/auth/register', {
        ...userData,
        platform: 'mobile'
      });
      
      const { user: newUser, token } = response.data;
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
      
      // Store user data and token
      await AsyncStorage.setItem('@dietint_user', JSON.stringify(newUser));
      await AsyncStorage.setItem('@dietint_token', JSON.stringify(token));
      
      setUser(newUser);
      
      // Create nutritionist profile if needed
      if (newUser.role === 'nutritionist') {
        const profileData = {
          userId: newUser.id,
          professionalName: 'Gouri Priya Mylavarapu',
          experience: '15+ years',
          location: 'Hyderabad, India',
          qualifications: ['MSc Nutrition', 'Certified Dietitian'],
          specializations: ['Weight Management', 'Diabetes Care', 'Indian Diet'],
          languages: ['English', 'Hindi', 'Telugu'],
          consultationFee: 500,
          availability: {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            slots: [
              { start: '09:00', end: '12:00' },
              { start: '14:00', end: '18:00' }
            ]
          },
          bio: 'Experienced nutritionist specializing in Indian diets and holistic wellness.',
          isVerified: true,
          rating: 4.8,
          totalConsultations: 0
        };
        
        try {
          const profileResponse = await api.post('/api/nutritionist/profile', profileData);
          setNutritionistProfile(profileResponse.data);
          await AsyncStorage.setItem('@dietint_nutritionist_profile', JSON.stringify(profileResponse.data));
        } catch (profileErr) {
          console.error('Failed to create nutritionist profile:', profileErr);
        }
      }
      
    } catch (err: any) {
      console.error('Registration error:', err);
      
      if (err.response?.status === 409) {
        setError('Username or email already exists. Please choose different credentials.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Notify server about logout
      await api.post('/api/auth/logout');
      
      // Clear local session
      await clearSession();
      
    } catch (err) {
      console.error('Logout error:', err);
      // Clear local session even if server call fails
      await clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) throw new Error('No user logged in');
      
      const response = await api.patch(`/api/users/${user.id}`, data);
      const updatedUser = response.data;
      
      await AsyncStorage.setItem('@dietint_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
    } catch (err: any) {
      console.error('Update profile error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update nutritionist profile function
  const updateNutritionistProfile = async (data: Partial<NutritionistProfile>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user || !nutritionistProfile) throw new Error('No nutritionist profile found');
      
      const response = await api.patch(`/api/nutritionist/profile/${nutritionistProfile.id}`, data);
      const updatedProfile = response.data;
      
      await AsyncStorage.setItem('@dietint_nutritionist_profile', JSON.stringify(updatedProfile));
      setNutritionistProfile(updatedProfile);
      
    } catch (err: any) {
      console.error('Update nutritionist profile error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update nutritionist profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const tokenJSON = await AsyncStorage.getItem('@dietint_token');
      if (!tokenJSON) throw new Error('No token found');
      
      const currentToken = JSON.parse(tokenJSON);
      
      const response = await api.post('/api/auth/refresh', {
        refreshToken: currentToken.refreshToken
      });
      
      const { token } = response.data;
      
      // Update authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
      
      // Store new token
      await AsyncStorage.setItem('@dietint_token', JSON.stringify(token));
      
    } catch (err) {
      console.error('Token refresh failed:', err);
      // Clear session on refresh failure
      await clearSession();
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Set up token refresh interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && user) {
          // Token expired, try to refresh
          try {
            await refreshToken();
            // Retry the original request
            return api.request(error.config);
          } catch (refreshError) {
            // Refresh failed, logout user
            await logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      nutritionistProfile,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile,
      updateNutritionistProfile,
      refreshToken,
      error,
      clearError,
      isClient,
      isNutritionist
    }}>
      {children}
    </AuthContext.Provider>
  );
};