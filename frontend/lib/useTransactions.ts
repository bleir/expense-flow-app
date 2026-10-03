"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { transactionsApi } from "@/lib/transactionsApi";

export function useTransactions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => transactionsApi.getAll(),
    enabled: options?.enabled ?? true,
  });
}
