import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

const DEMO_USER = {
  id: 1,
  username: 'admin',
  full_name: 'Anil Adhikari (SecOps Admin)',
  role: 'Admin',
  is_active: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const isStaticHost = window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app');
      const token = localStorage.getItem('secops_token');

      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData || DEMO_USER);
        } catch (err) {
          console.error("Session expired:", err);
          localStorage.removeItem('secops_token');
          setUser(isStaticHost ? DEMO_USER : null);
        }
      } else if (isStaticHost) {
        // Auto-login demo user on GitHub Pages live demo
        setUser(DEMO_USER);
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authAPI.login(username, password);
      localStorage.setItem('secops_token', data.access_token);
      setUser(data.user || DEMO_USER);
      return data.user || DEMO_USER;
    } catch (err) {
      if (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app')) {
        setUser(DEMO_USER);
        return DEMO_USER;
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('secops_token');
    if (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app')) {
      setUser(DEMO_USER);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
