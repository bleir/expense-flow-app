"use client";

import TransactionsList from "@/app/expenses/components/TransactionsList";
import Heading from "@/components/Heading";
import QueryState from "@/components/QueryState";
import TransactionSummary from "@/components/TransactionSummary";
import { useTransactions } from "@/lib/useTransactions";

import SpendingLineChart from "./SpendingLineChart";
import WelcomeCard from "./WelcomeCard";

export default function DashboardView() {
  const { data: transactions, isPending, isError } = useTransactions();

  return (
    <>
      <Heading title="Dashboard">Your income, spending, and balance.</Heading>
      <QueryState
        isLoading={isPending}
        isError={isError}
        isEmpty={!transactions?.length}
        loadingMessage="Loading dashboard..."
        errorMessage="Failed to load dashboard."
        empty={<WelcomeCard />}
      >
        <div className="flex flex-col gap-6">
          <TransactionSummary transactions={transactions ?? []} />
          <SpendingLineChart />
          <TransactionsList dashboardView />
        </div>
      </QueryState>
    </>
  );
}
