'use client';
import { storage } from '@/lib/localstorage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = storage.get('auth_token');
    const storedUser = storage.get('auth_user');

    if (storedToken) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    storage.set('auth_token', token);
    storage.set('auth_user', userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.remove('auth_token');
    storage.remove('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
