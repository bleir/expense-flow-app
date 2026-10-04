"use client";

import { useQuery } from "@tanstack/react-query";

import EditCurrencyDialog from "./EditCurrencyDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import QueryState from "@/components/QueryState";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currenciesApi } from "@/lib/currenciesApi";
import { defaultCurrencyStorageKey } from "@/lib/defaultCurrency";
import { useQueryKeys } from "@/lib/queryKeys";
import { useDeleteEntity } from "@/lib/useDeleteEntity";

export default function CurrenciesList({
  defaultCurrencyId,
}: {
  defaultCurrencyId?: string;
}) {
  const queryKeys = useQueryKeys();
  const {
    data: currencies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.currencies,
    queryFn: currenciesApi.getAll,
    enabled: Boolean(queryKeys.userId),
  });

  const deleteMutation = useDeleteEntity({
    queryKey: queryKeys.currencies,
    deleteFn: currenciesApi.delete,
    entityName: "Currency",
    onDeleted: (id) => {
      if (!queryKeys.userId) return;
      const key = defaultCurrencyStorageKey(queryKeys.userId);
      if (localStorage.getItem(key) === id) {
        localStorage.removeItem(key);
      }
    },
  });

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      isEmpty={!currencies?.length}
      loadingMessage="Loading currencies..."
      errorMessage="Failed to load currencies."
      empty={
        <p className="text-sm text-muted-foreground">No currencies yet.</p>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {(currencies ?? []).map((currency) => {
          const isDefault = currency.id === defaultCurrencyId;

          return (
            <Card
              key={currency.id}
              className="gap-0 py-4 shadow-md ring-1 ring-border/60"
            >
              <CardHeader className="items-center px-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sm font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-200"
                  >
                    {currency.symbol}
                  </span>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base tracking-tight">
                      {currency.currency}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 font-mono text-xs tracking-wide uppercase">
                      {currency.code}
                      {isDefault ? (
                        <span className="rounded-full bg-sky-100 px-1.5 py-0.5 font-sans text-[10px] font-medium tracking-normal text-sky-800 normal-case dark:bg-sky-950 dark:text-sky-200">
                          Default
                        </span>
                      ) : null}
                    </CardDescription>
                  </div>
                </div>
                <CardAction className="flex">
                  <EditCurrencyDialog currency={currency} />
                  <ConfirmDeleteDialog
                    title="Delete currency"
                    description="Are you sure you want to delete this currency?"
                    ariaLabel="Delete currency"
                    isPending={deleteMutation.isPending}
                    onConfirm={() => deleteMutation.mutate(currency.id)}
                  />
                </CardAction>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </QueryState>
  );
}
