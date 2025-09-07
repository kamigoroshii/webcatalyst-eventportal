import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, handleApiError } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = localStorage.getItem('eventease_token');
      if (storedToken) {
        const response = await authAPI.getMe();
        setUser(response.user);
      }
    } catch (error) {
      // Token is invalid, expired, or backend is not running
      console.warn('Auth check failed:', error.message);
      localStorage.removeItem('eventease_token');
      localStorage.removeItem('eventease_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      localStorage.setItem('eventease_token', response.token);
      localStorage.setItem('eventease_user', JSON.stringify(response.user));
      
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      localStorage.setItem('eventease_token', response.token);
      localStorage.setItem('eventease_user', JSON.stringify(response.user));
      
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('eventease_user');
      localStorage.removeItem('eventease_token');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.user);
      localStorage.setItem('eventease_user', JSON.stringify(response.user));
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loading,
    isAuthenticated: !!user,
    isOrganizer: user?.role === 'organizer',
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};