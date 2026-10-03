"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthUser = { id: string; email: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  setUser: (user: AuthUser | null) => void;
};

const STORAGE_KEY = "expense-flow-user";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    setUserState(JSON.parse(raw) as AuthUser);
  }, []);

  function setUser(next: AuthUser | null) {
    setUserState(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
