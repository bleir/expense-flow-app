"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { AUTH_STORAGE_KEY } from "@/lib/authStorage";

type AuthUser = { id: string; email: string; accessToken: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isReady: boolean;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) setUserState(JSON.parse(raw) as AuthUser);
    setIsReady(true);
  }, []);

  function setUser(next: AuthUser | null) {
    setUserState(next);
    if (next) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: user !== null, isReady, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
