"use client";

import Heading from "@/components/Heading";
import Page from "@/components/Page";
import TransactionSummary from "@/components/TransactionSummary";
import { useTransactions } from "@/lib/useTransactions";
import NewTransactionDialog from "./components/NewTransactionDialog";
import TransactionsList from "./components/TransactionsList";

export default function ExpensesPage() {
  const { data: transactions, isLoading } = useTransactions();
  const count = transactions?.length ?? 0;

  return (
    <Page>
      <section className="flex items-start justify-between gap-4">
        <Heading title="Transactions">
          {isLoading
            ? "Your income and spending."
            : `${count} transaction${count === 1 ? "" : "s"}`}
        </Heading>
        <NewTransactionDialog />
      </section>
      {transactions?.length ? (
        <TransactionSummary transactions={transactions} />
      ) : null}
      <TransactionsList />
    </Page>
  );
}
