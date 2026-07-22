import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data.data;
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.errorMessage || 'Invalid email or password';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (name, email, password, role = 'customer', phone = '') => {
    setError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password, role, phone });
      const userData = response.data.data;
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.errorMessage || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const msg = err.errorMessage || 'Failed to update profile';
      throw new Error(msg);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    isCustomer: user?.role === 'customer',
    isOwner: user?.role === 'owner',
    isAdmin: user?.role === 'admin',
    checkAuth,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
