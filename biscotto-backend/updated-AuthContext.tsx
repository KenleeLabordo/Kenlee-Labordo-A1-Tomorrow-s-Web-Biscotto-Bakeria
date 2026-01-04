/**
 * Authentication Context - Updated to use Backend API
 * 
 * Manages user login, signup, verification, and password reset flows with MongoDB backend.
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { authAPI } from '../services/api';

type AuthStep = 'unauthenticated' | 'awaiting-verification' | 'awaiting-password-reset' | 'authenticated';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authStep: AuthStep;
  pendingUserEmail: string | null;
  pendingUserId: string | null;
  pendingVerificationCode: string | null;
  pendingResetCode: string | null;
  signup: (email: string, name: string, password: string) => Promise<{ success: boolean; message?: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; role?: 'admin' | 'customer' }>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (code: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep>('unauthenticated');
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingVerificationCode, setPendingVerificationCode] = useState<string | null>(null);
  const [pendingResetCode, setPendingResetCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.getMe();
          const userData = response.user;
          setUser({
            email: userData.email,
            name: userData.name,
            role: userData.role,
            isVerified: userData.isVerified,
            password: '' // We don't store password on frontend
          });
          setAuthStep('authenticated');
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (email: string, name: string, password: string) => {
    try {
      const response = await authAPI.signup(email, name, password);
      setPendingUserId(response.userId);
      setPendingEmail(email);
      setPendingVerificationCode(response.verificationCode); // For demo - remove in production
      setAuthStep('awaiting-verification');
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const verifyEmail = async (code: string) => {
    try {
      if (!pendingUserId) {
        return { success: false, message: 'No pending verification' };
      }

      const response = await authAPI.verifyEmail(pendingUserId, code);
      
      setUser({
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        isVerified: response.user.isVerified,
        password: ''
      });
      setAuthStep('authenticated');
      setPendingUserId(null);
      setPendingEmail(null);
      setPendingVerificationCode(null);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      setUser({
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        isVerified: response.user.isVerified,
        password: ''
      });
      setAuthStep('authenticated');
      
      return { success: true, role: response.user.role };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setAuthStep('unauthenticated');
  };

  const updateUser = async (updatedUser: Partial<User>) => {
    try {
      if (!user) return;

      const response = await authAPI.updateProfile(
        updatedUser.name || user.name,
        updatedUser.email || user.email
      );

      setUser({
        ...user,
        email: response.user.email,
        name: response.user.name
      });
    } catch (error: any) {
      console.error('Update user failed:', error);
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword(email);
      setPendingUserId(response.userId);
      setPendingEmail(email);
      setPendingResetCode(response.resetCode); // For demo - remove in production
      setAuthStep('awaiting-password-reset');
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const resetPassword = async (code: string, newPassword: string) => {
    try {
      if (!pendingUserId) {
        return { success: false, message: 'No pending reset request' };
      }

      await authAPI.resetPassword(pendingUserId, code, newPassword);
      
      setAuthStep('unauthenticated');
      setPendingUserId(null);
      setPendingEmail(null);
      setPendingResetCode(null);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    authStep,
    pendingUserEmail: pendingEmail,
    pendingUserId,
    pendingVerificationCode,
    pendingResetCode,
    signup,
    verifyEmail,
    login,
    logout,
    updateUser,
    requestPasswordReset,
    resetPassword,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
