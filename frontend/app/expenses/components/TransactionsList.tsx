"use client";

import EditTransactionDialog from "./EditTransactionDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import QueryState from "@/components/QueryState";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { transactionsApi, type TransactionType } from "@/lib/transactionsApi";
import { useDefaultCurrency } from "@/lib/defaultCurrency";
import { formatDisplayDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { queryKeys } from "@/lib/queryKeys";
import { useDeleteEntity } from "@/lib/useDeleteEntity";
import { useTransactions } from "@/lib/useTransactions";
import { BanknoteArrowUp, BanknoteArrowDown, ArrowRight } from "lucide-react";
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

export default function TransactionsList({
  dashboardView,
}: {
  dashboardView?: boolean;
}) {
  const { currency } = useDefaultCurrency();
  const currencySymbol = currency?.symbol ?? "$";

  const {
    data: transactions,
    isLoading,
    isError,
  } = useTransactions();

  const deleteMutation = useDeleteEntity({
    queryKey: queryKeys.transactions,
    deleteFn: transactionsApi.delete,
    entityName: "Transaction",
  });

  const visibleTransactions = dashboardView
    ? transactions?.slice(0, 10)
    : transactions;

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      isEmpty={!transactions?.length}
      loadingMessage="Loading transactions..."
      errorMessage="Failed to load transactions."
      empty={
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No transactions yet</CardTitle>
            <CardDescription>
              Create your first transaction to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      }
    >
    <div className="mt-4 flex flex-col gap-4">
      {dashboardView && (
        <div className="flex items-center justify-between">
          <h2>Lastest transaction</h2>
          <Button
            asChild
            variant="secondary"
            className="hover:bg-sky-200 dark:hover:bg-sky-800"
          >
            <Link href="/expenses">
              See all
              <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
      <Card className="gap-0 divide-y py-0">
        {(visibleTransactions ?? []).map((transaction) => {
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
                          ? "text-green-600 dark:text-green-400"
                          : "text-foreground",
                      )}
                    >
                      {formatMoney(transaction.amount)} {currencySymbol}
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
                      {formatDisplayDate(transaction.date)}
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
    </QueryState>
  );
}
