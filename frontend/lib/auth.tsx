"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthUser = { id: string; email: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isReady: boolean;
  setUser: (user: AuthUser | null) => void;
};

const STORAGE_KEY = "expense-flow-user";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setUserState(JSON.parse(raw) as AuthUser);
    setIsReady(true);
  }, []);

  function setUser(next: AuthUser | null) {
    setUserState(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
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
