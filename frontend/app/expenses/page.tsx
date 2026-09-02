"use client";

import Heading from "@/components/Heading";
import { transactionsApi } from "@/lib/transactionsApi";
import { useQuery } from "@tanstack/react-query";
import NewTransactionDialog from "./components/NewTransactionDialog";
import TransactionsList from "./components/TransactionsList";

export default function ExpensesPage() {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsApi.getAll,
  });

  if (isLoading) {
    return <p className="text-muted-foreground p-6">Loading transactions...</p>;
  }

  if (isError) {
    return (
      <p className="text-destructive p-6">Failed to load transactions.</p>
    );
  }

  const totalAmount = (transactions ?? []).reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0,
  );
  const count = transactions?.length ?? 0;

  return (
    <main className="p-6">
      <section className="flex justify-between">
        <Heading title="Expenses">
          {`${count} transaction${count === 1 ? "" : "s"} · $${totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </Heading>
        <NewTransactionDialog />
      </section>
      <section>
        <TransactionsList />
      </section>
    </main>
  );
}
