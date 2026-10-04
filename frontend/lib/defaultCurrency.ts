"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { currenciesApi } from "@/lib/currenciesApi";
import { useQueryKeys } from "@/lib/queryKeys";

const LEGACY_CURRENCY_STORAGE_KEY = "expense-flow-default-currency-id";

export function defaultCurrencyStorageKey(userId: string) {
  return `${LEGACY_CURRENCY_STORAGE_KEY}:${userId}`;
}

export function useDefaultCurrency() {
  const queryKeys = useQueryKeys();
  const userId = queryKeys.userId;
  const [currencyId, setCurrencyId] = useState("");

  const { data: currencies } = useQuery({
    queryKey: queryKeys.currencies,
    queryFn: currenciesApi.getAll,
    enabled: Boolean(userId),
  });

  useEffect(() => {
    if (!userId) {
      setCurrencyId("");
      return;
    }

    const key = defaultCurrencyStorageKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      setCurrencyId(stored);
      return;
    }

    const legacy = localStorage.getItem(LEGACY_CURRENCY_STORAGE_KEY);
    if (legacy) {
      localStorage.setItem(key, legacy);
      localStorage.removeItem(LEGACY_CURRENCY_STORAGE_KEY);
      setCurrencyId(legacy);
      return;
    }

    setCurrencyId("");
  }, [userId]);

  const setDefaultCurrencyId = useCallback(
    (id: string) => {
      setCurrencyId(id);
      if (!userId) return;
      localStorage.setItem(defaultCurrencyStorageKey(userId), id);
    },
    [userId],
  );

  const currency =
    currencies?.find((item) => item.id === currencyId) ?? null;

  return { currencyId, currency, currencies, setDefaultCurrencyId };
}
