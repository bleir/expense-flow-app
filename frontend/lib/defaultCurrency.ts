"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { currenciesApi } from "@/lib/currenciesApi";

export const DEFAULT_CURRENCY_STORAGE_KEY = "expense-flow-default-currency-id";

export function useDefaultCurrency() {
  const [currencyId, setCurrencyId] = useState("");

  const { data: currencies } = useQuery({
    queryKey: ["currencies"],
    queryFn: currenciesApi.getAll,
  });

  useEffect(() => {
    setCurrencyId(localStorage.getItem(DEFAULT_CURRENCY_STORAGE_KEY) ?? "");
  }, []);

  const setDefaultCurrencyId = useCallback((id: string) => {
    setCurrencyId(id);
    localStorage.setItem(DEFAULT_CURRENCY_STORAGE_KEY, id);
  }, []);

  const currency =
    currencies?.find((item) => item.id === currencyId) ?? null;

  return { currencyId, currency, currencies, setDefaultCurrencyId };
}
