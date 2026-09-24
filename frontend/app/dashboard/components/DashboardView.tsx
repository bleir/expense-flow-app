"use client";

import QueryState from "@/components/QueryState";
import TransactionsList from "@/app/expenses/components/TransactionsList";
import { useTransactions } from "@/lib/useTransactions";

import SpendingLineChart from "./SpendingLineChart";
import WelcomeCard from "./WelcomeCard";

export default function DashboardView() {
  const { data: transactions, isPending, isError } = useTransactions();

  return (
    <QueryState
      isLoading={isPending}
      isError={isError}
      isEmpty={!transactions?.length}
      loadingMessage="Loading dashboard..."
      errorMessage="Failed to load dashboard."
      empty={<WelcomeCard />}
    >
      <>
        <SpendingLineChart />
        <TransactionsList dashboardView />
      </>
    </QueryState>
  );
}
