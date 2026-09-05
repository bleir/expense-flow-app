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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const renderTransactionIcon = (transactionType: TransactionType) => {
  return transactionType === "income" ? (
    <BanknoteArrowUp color="green" />
  ) : (
    <BanknoteArrowDown color="red" />
  );
};

const formatTransactionDate = (date: Date | string) => {
  const parsed =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00`)
      : new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(navigator.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function TransactionsList({
  dashboardView,
}: {
  dashboardView?: boolean;
}) {
  const queryClient = useQueryClient();
  const { currency } = useDefaultCurrency();
  const currencySymbol = currency?.symbol ?? "$";

  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions", { limit: dashboardView ? 10 : undefined }],
    queryFn: () =>
      transactionsApi.getAll(dashboardView ? { limit: 10 } : undefined),
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
      {dashboardView && (
        <div className="flex items-center justify-between">
          <h2>Lastest transaction</h2>
          <Button asChild variant="secondary" className="hover:bg-sky-200">
            <Link href="/expenses">See all</Link>
          </Button>
        </div>
      )}
      <Card className="gap-0 divide-y py-0">
        {transactions.map((transaction) => {
          return (
            <Accordion key={transaction.id} type="multiple">
              <AccordionItem value={transaction.id}>
                <div className="flex items-center gap-2 px-6">
                  <AccordionTrigger className="items-center hover:no-underline cursor-pointer">
                    <span className="flex flex-1 items-center gap-2">
                      {renderTransactionIcon(transaction.type)}
                      {transaction.description}
                    </span>
                    <span
                      className={cn(
                        "text-base font-bold tabular-nums",
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
                  </AccordionTrigger>
                  <div className="flex shrink-0 items-center">
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
                <AccordionContent className="grid grid-cols-2 gap-4 px-8">
                  <div className="min-w-0">
                    <p className="text-gray-500 text-sm pb-1">Date</p>
                    <p className="text-base">
                      {formatTransactionDate(transaction.date)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 text-sm pb-1">Category</p>
                    <p className="text-base flex flex-row gap-2 items-center">
                      <span
                        className="w-5 h-5 rounded-full block"
                        style={{
                          backgroundColor: transaction?.category?.color,
                        }}
                      />
                      {transaction.category?.name ?? "-"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 text-sm pb-1">Type</p>
                    <p className="text-base">{transaction.type}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 text-sm pb-1">Notes</p>
                    <p className="text-base">{transaction.notes || "-"}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </Card>
    </div>
  );
}
