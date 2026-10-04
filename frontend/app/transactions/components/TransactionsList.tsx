"use client";

import QueryState from "@/components/QueryState";
import WelcomeIllustration from "@/components/WelcomeIllustration";
import {
  Card,
  CardContent,
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
        <Card className="overflow-hidden border-dashed">
          <CardContent className="flex flex-col items-center gap-6 px-6 py-12 text-center">
            <WelcomeIllustration />
            <CardHeader className="w-full max-w-md items-center px-0 text-center">
              <CardTitle className="text-2xl leading-tight tracking-tight text-balance">
                No transactions yet
              </CardTitle>
              <CardDescription className="text-base leading-relaxed text-balance">
                Create your first transaction to see income, spending, and
                balance here.
              </CardDescription>
            </CardHeader>
          </CardContent>
        </Card>
      }
    >
      <div className="flex flex-col gap-4">
        {dashboardView && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Latest transactions
            </h2>
            <Button
              asChild
              variant="outline"
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
