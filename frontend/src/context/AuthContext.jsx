import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Optimistically initialize user from cached local storage if available
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('tripledger_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed) {
          parsed.id = parsed.id || parsed._id;
          return parsed;
        }
      }
    } catch (e) {}
    return null;
  });

  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('tripledger_token');
    // If token exists, we do a background sync, but if we have cached user, UI isn't blocked
    return Boolean(token && !localStorage.getItem('tripledger_user'));
  });

  const saveUserSession = (token, userData) => {
    if (token) localStorage.setItem('tripledger_token', token);
    if (userData) {
      const normalizedUser = {
        ...userData,
        id: userData.id || userData._id
      };
      localStorage.setItem('tripledger_user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('tripledger_token');
    localStorage.removeItem('tripledger_user');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('tripledger_token');
    if (token) {
      api.getMe()
        .then(res => {
          if (res.success && res.user) {
            const normalized = {
              ...res.user,
              id: res.user.id || res.user._id
            };
            setUser(normalized);
            localStorage.setItem('tripledger_user', JSON.stringify(normalized));
          } else {
            clearSession();
          }
        })
        .catch(err => {
          console.warn('Background auth sync warning:', err);
          // Only clear if 401 Unauthorized or explicitly invalid
          const msg = (err?.message || '').toLowerCase();
          if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid') || msg.includes('expired')) {
            clearSession();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token && res.user) {
      saveUserSession(res.token, res.user);
    }
    return res;
  };

  const loginWithGoogle = async (credential) => {
    const res = await api.googleLogin(credential);
    if (res.token && res.user) {
      saveUserSession(res.token, res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.token && res.user) {
      saveUserSession(res.token, res.user);
    }
    return res;
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

