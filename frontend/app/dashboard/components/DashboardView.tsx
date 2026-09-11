"use client";

import { useQuery } from "@tanstack/react-query";

import TransactionsList from "@/app/expenses/components/TransactionsList";
import { transactionsApi } from "@/lib/transactionsApi";

import SpendingLineChart from "./SpendingLineChart";
import WelcomeCard from "./WelcomeCard";

export default function DashboardView() {
  const { data: transactions, isPending, isError } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsApi.getAll(),
  });

  if (isPending) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  if (isError) {
    return <p className="text-destructive">Failed to load dashboard.</p>;
  }

  if (!transactions?.length) {
    return <WelcomeCard />;
  }

  return (
    <>
      <SpendingLineChart />
      <TransactionsList dashboardView={true} />
    </>
  );
}
