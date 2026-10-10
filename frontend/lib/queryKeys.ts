"use client";

import { useAuth } from "@/lib/auth";

export function useQueryKeys() {
  const { user } = useAuth();
  const userId = user?.id ?? "";

  return {
    userId,
    profile: ["profile", userId] as const,
    categories: ["categories", userId] as const,
    currencies: ["currencies", userId] as const,
    transactions: ["transactions", userId] as const,
  };
}
