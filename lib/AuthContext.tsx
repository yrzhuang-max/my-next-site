'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  userEmail: string | null;
  refreshAuth: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const refreshAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUserEmail(null);
      return;
    }
    try {
      const res = await fetch(`${base}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem('token');
        setUserEmail(null);
        return;
      }
      const data = await res.json();
      setUserEmail(data.user.email);
    } catch {
      localStorage.removeItem('token');
      setUserEmail(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserEmail(null);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ userEmail, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
