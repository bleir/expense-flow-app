"use client";

import { useQuery } from "@tanstack/react-query";

import { useQueryKeys } from "@/lib/queryKeys";
import { transactionsApi } from "@/lib/transactionsApi";

export function useTransactions(options?: { enabled?: boolean }) {
  const queryKeys = useQueryKeys();

  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => transactionsApi.getAll(),
    enabled: Boolean(queryKeys.userId) && (options?.enabled ?? true),
  });
}
