"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@/lib/auth';

type User = any;

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (payload: { name: string; phone: string; email: string; password: string }) => Promise<any>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(auth.getToken());

  useEffect(() => {
    // try to populate user if token exists
    async function load() {
      if (auth.getToken()) {
        try {
          const res = await auth.getCurrentUser();
          setUser(res.data.user);
          setToken(auth.getToken());
        } catch {
          setUser(null);
          setToken(null);
        }
      }
    }
    load();
  }, []);

  async function login(email: string, password: string) {
    const res = await auth.login(email, password);
    console.log({ loginResponse: res });
    setToken(auth.getToken());
    try {
      setUser(res.data.user);
    } catch {
      // ignore
    }
    return res;
  }

  async function register(payload: { name: string; phone: string; email: string; password: string }) {
    const res = await auth.register(payload);
    console.log({ registerResponse: res });
    setToken(auth.getToken());
    try {
      setUser(res.data.user);
    } catch { }

    return res;
  }

  function logout() {
    auth.clearToken();
    setUser(null);
    setToken(null);
  }

  async function refresh() {
    try {
      const res = await auth.getCurrentUser();
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;
