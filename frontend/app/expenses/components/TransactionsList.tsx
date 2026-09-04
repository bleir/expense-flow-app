"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import EditTransactionDialog from "./EditTransactionDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { transactionsApi, TransactionType } from "@/lib/transactionsApi";
import { useDefaultCurrency } from "@/lib/defaultCurrency";
import { toast } from "sonner";
import { BanknoteArrowUp, BanknoteArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const renderTransactionIcon = (transactionType: TransactionType) => {
  return transactionType === "income" ? (
    <BanknoteArrowUp color="green" />
  ) : (
    <BanknoteArrowDown color="red" />
  );
};

export default function TransactionsList() {
  const queryClient = useQueryClient();
  const { currency } = useDefaultCurrency();
  const currencySymbol = currency?.symbol ?? "$";

  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction has been deleted");
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading transactions...</p>;
  }

  if (isError) {
    return <p className="text-destructive">Failed to load transactions.</p>;
  }

  if (!transactions?.length) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No transactions yet</CardTitle>
          <CardDescription>
            Create your first transaction to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Card className="gap-0 divide-y py-0">
        {transactions.map((transaction) => {
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="flex flex-row gap-2">
                {renderTransactionIcon(transaction.type)}

                <CardTitle className="text-sm">
                  {transaction.description}
                </CardTitle>
              </span>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-black",
                  )}
                >
                  {Number(transaction.amount).toLocaleString(
                    navigator.language,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{" "}
                  {currencySymbol}
                </span>
                <EditTransactionDialog transaction={transaction} />
                <ConfirmDeleteDialog
                  title="Delete transaction"
                  description="Are you sure you want to delete this transaction?"
                  ariaLabel="Delete transaction"
                  isPending={deleteMutation.isPending}
                  onConfirm={() => deleteMutation.mutate(transaction.id)}
                />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
