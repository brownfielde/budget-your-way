import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // TODO: fetch current user from backend
    // axios.get('/api/auth/me').then(resp => setUser(resp.data));
  }, []);

  const login = async (email: string, password: string) => {
    // placeholder: replace with real API
    const resp = await axios.post<User>('/api/auth/login', { email, password });
    setUser(resp.data);
  };

  const logout = () => {
    // placeholder: replace with real API
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};