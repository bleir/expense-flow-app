"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import EditCurrencyDialog from "./EditCurrencyDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { currenciesApi } from "@/lib/currenciesApi";
import {
  DEFAULT_CURRENCY_STORAGE_KEY,
} from "@/lib/defaultCurrency";
import { toast } from "sonner";

export default function CurrenciesList() {
  const queryClient = useQueryClient();

  const {
    data: currencies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currencies"],
    queryFn: currenciesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => currenciesApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      if (localStorage.getItem(DEFAULT_CURRENCY_STORAGE_KEY) === id) {
        localStorage.removeItem(DEFAULT_CURRENCY_STORAGE_KEY);
      }
      toast.success("Currency has been deleted");
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading currencies...</p>;
  }

  if (isError) {
    return <p className="text-destructive">Failed to load currencies.</p>;
  }

  if (!currencies?.length) {
    return (
      <p className="text-sm text-muted-foreground">No currencies yet.</p>
    );
  }

  return (
    <div className="divide-y rounded-lg border">
      {currencies.map((currency) => (
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
  );
}
