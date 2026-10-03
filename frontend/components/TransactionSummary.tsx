"use client";

import { BanknoteArrowDown, BanknoteArrowUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDefaultCurrency } from "@/lib/defaultCurrency";
import { formatMoney } from "@/lib/money";
import type { Transaction } from "@/lib/transactionsApi";
import { cn } from "@/lib/utils";

function summarize(transactions: Pick<Transaction, "type" | "amount">[]) {
  let income = 0;
  let expenses = 0;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);
    if (!Number.isFinite(amount)) continue;
    if (transaction.type === "income") income += amount;
    else expenses += amount;
  }

  return { income, expenses, balance: income - expenses };
}

export default function TransactionSummary({
  transactions,
}: {
  transactions: Pick<Transaction, "type" | "amount">[];
}) {
  const { currency } = useDefaultCurrency();
  const symbol = currency?.symbol ?? "$";
  const { income, expenses, balance } = summarize(transactions);

  const cards: {
    label: string;
    amount: number;
    amountClassName: string;
    icon: LucideIcon;
    iconClassName: string;
  }[] = [
    {
      label: "Income",
      amount: income,
      amountClassName: "text-emerald-600 dark:text-emerald-400",
      icon: BanknoteArrowUp,
      iconClassName:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
    {
      label: "Expenses",
      amount: expenses,
      amountClassName: "text-sky-700 dark:text-sky-300",
      icon: BanknoteArrowDown,
      iconClassName:
        "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    },
    {
      label: "Balance",
      amount: balance,
      amountClassName:
        balance >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-destructive",
      icon: Wallet,
      iconClassName:
        "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.label}
            className="gap-2 py-5 shadow-md ring-1 ring-border/60"
          >
            <CardHeader className="gap-3 px-5">
              <CardDescription className="flex items-center gap-2 text-sm font-medium">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    card.iconClassName,
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {card.label}
              </CardDescription>
              <CardTitle
                className={cn("text-2xl tabular-nums", card.amountClassName)}
              >
                {formatMoney(card.amount)} {symbol}
              </CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
