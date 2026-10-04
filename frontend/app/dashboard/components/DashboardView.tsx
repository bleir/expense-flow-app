"use client";

import TransactionsList from "@/app/transactions/components/TransactionsList";
import Heading from "@/components/Heading";
import QueryState from "@/components/QueryState";
import { Spinner } from "@/components/ui/spinner";
import TransactionSummary from "@/components/TransactionSummary";
import { useAuth } from "@/lib/auth";
import { useTransactions } from "@/lib/useTransactions";

import GuestDashboard from "./GuestDashboard";
import SpendingLineChart from "./SpendingLineChart";
import WelcomeCard from "./WelcomeCard";

export default function DashboardView() {
  const { isLoggedIn, isReady } = useAuth();
  const {
    data: transactions,
    isPending,
    isError,
  } = useTransactions({
    enabled: isReady && isLoggedIn,
  });

  if (!isReady) {
    return (
      <div className="flex justify-center py-8">
        <Spinner
          className="size-6 text-muted-foreground"
          aria-label="Loading dashboard"
        />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <GuestDashboard />;
  }

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
