import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth.types';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    try {
      await api.post('/auth/request-otp', { email });
      toast.success('OTP sent to your email!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.put('/auth/profile', data);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password change failed');
      throw error;
    }
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      verifyOTP,
      logout,
      updateProfile,
      changePassword,
      isAdmin,
      isManager
    }}>
      {children}
    </AuthContext.Provider>
  );
};