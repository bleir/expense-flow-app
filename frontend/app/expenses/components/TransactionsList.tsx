"use client";

import QueryState from "@/components/QueryState";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTransactions } from "@/lib/useTransactions";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TransactionItem from "./TransactionItem";

export default function TransactionsList({
  dashboardView,
}: {
  dashboardView?: boolean;
}) {
  const { data: transactions, isLoading, isError } = useTransactions();

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
              <TransactionItem key={transaction.id} transaction={transaction} />
            );
          })}
        </Card>
      </div>
    </QueryState>
  );
}
