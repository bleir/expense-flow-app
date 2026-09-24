"use client";

import { useQuery } from "@tanstack/react-query";

import EditCurrencyDialog from "./EditCurrencyDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import QueryState from "@/components/QueryState";
import { currenciesApi } from "@/lib/currenciesApi";
import { DEFAULT_CURRENCY_STORAGE_KEY } from "@/lib/defaultCurrency";
import { queryKeys } from "@/lib/queryKeys";
import { useDeleteEntity } from "@/lib/useDeleteEntity";

export default function CurrenciesList() {
  const {
    data: currencies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.currencies,
    queryFn: currenciesApi.getAll,
  });

  const deleteMutation = useDeleteEntity({
    queryKey: queryKeys.currencies,
    deleteFn: currenciesApi.delete,
    entityName: "Currency",
    onDeleted: (id) => {
      if (localStorage.getItem(DEFAULT_CURRENCY_STORAGE_KEY) === id) {
        localStorage.removeItem(DEFAULT_CURRENCY_STORAGE_KEY);
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
      <div className="divide-y rounded-lg border">
        {(currencies ?? []).map((currency) => (
          <div
            key={currency.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{currency.symbol}</span>
              <div>
                <p className="text-sm font-medium">{currency.currency}</p>
                <p className="text-xs text-muted-foreground">{currency.code}</p>
              </div>
            </div>
            <div className="flex items-center">
              <EditCurrencyDialog currency={currency} />
              <ConfirmDeleteDialog
                title="Delete currency"
                description="Are you sure you want to delete this currency?"
                ariaLabel="Delete currency"
                isPending={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate(currency.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </QueryState>
  );
}
