"use client";

import Heading from "@/components/Heading";
import QueryState from "@/components/QueryState";
import { useDefaultCurrency } from "@/lib/defaultCurrency";
import { formatMoney } from "@/lib/money";
import { useTransactions } from "@/lib/useTransactions";
import NewTransactionDialog from "./components/NewTransactionDialog";
import TransactionsList from "./components/TransactionsList";

export default function ExpensesPage() {
  const { currency } = useDefaultCurrency();
  const { data: transactions, isLoading, isError } = useTransactions();

  const totalAmount = (transactions ?? []).reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0,
  );
  const count = transactions?.length ?? 0;
  const currencySymbol = currency?.symbol ?? "$";

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      loadingMessage="Loading transactions..."
      errorMessage="Failed to load transactions."
      className="p-6"
    >
      <main className="p-6">
        <section className="flex justify-between">
          <Heading title="Expenses">
            {`${count} transaction${count === 1 ? "" : "s"} · ${formatMoney(totalAmount)} ${currencySymbol}`}
          </Heading>
          <NewTransactionDialog />
        </section>
        <section>
          <TransactionsList />
        </section>
      </main>
    </QueryState>
  );
}
