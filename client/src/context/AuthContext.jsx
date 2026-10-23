import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const TOKEN_KEY = 'rockcity_admin_token';
const ADMIN_USER_KEY = 'rockcity_admin_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getAdminProfile();
        if (res.success && res.data) {
          setAdmin(res.data);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.loginAdmin(email, password);
    if (res.success && res.token) {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.admin));
      setToken(res.token);
      setAdmin(res.admin);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setToken(null);
    setAdmin(null);
  };

  const isAuthenticated = Boolean(token && admin);

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
