"use client";

import type { ReactNode } from "react";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CreditCard,
  PiggyBank,
  Plus,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";

import NewTransactionDialog from "@/app/expenses/components/NewTransactionDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function WelcomeIllustration() {
  return (
    <div
      className="relative flex size-36 items-center justify-center"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-sky-100 dark:bg-sky-950" />
      <div className="absolute inset-4 rounded-full bg-sky-200/70 dark:bg-sky-900/70" />
      <div className="relative flex size-16 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/30 dark:bg-sky-500">
        <Wallet className="size-8" strokeWidth={1.75} />
      </div>
      <div className="absolute top-2 right-1 flex size-9 items-center justify-center rounded-full bg-card text-sky-600 shadow-md ring-1 ring-border dark:text-sky-300">
        <Plus className="size-4" />
      </div>
    </div>
  );
}

function SideCard({
  className,
  icon,
  label,
  amount,
  tone,
}: {
  className?: string;
  icon: ReactNode;
  label: string;
  amount: string;
  tone: "income" | "expense";
}) {
  return (
    <div
      className={cn(
        "w-36 rounded-xl border bg-card p-3 shadow-md ring-1 ring-border/60",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
      </div>
      <p
        className={cn(
          "mt-1 text-sm font-semibold tabular-nums",
          tone === "income"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-sky-700 dark:text-sky-300",
        )}
      >
        {amount}
      </p>
    </div>
  );
}

function LeftGraphics() {
  return (
    <div
      className="relative hidden h-52 w-44 justify-self-end md:block"
      aria-hidden="true"
    >
      <SideCard
        className="absolute top-2 left-0 -rotate-12"
        icon={<BanknoteArrowUp className="size-4 text-emerald-600 dark:text-emerald-400" />}
        label="Income"
        amount="+$1,240"
        tone="income"
      />
      <div className="absolute top-24 right-2 flex size-12 rotate-6 items-center justify-center rounded-full bg-card text-emerald-600 shadow-md ring-1 ring-border dark:text-emerald-400">
        <PiggyBank className="size-6" />
      </div>
      <div className="absolute bottom-2 left-6 flex size-11 -rotate-6 items-center justify-center rounded-full bg-card text-sky-600 shadow-md ring-1 ring-border dark:text-sky-300">
        <TrendingUp className="size-5" />
      </div>
    </div>
  );
}

function RightGraphics() {
  return (
    <div
      className="relative hidden h-52 w-44 justify-self-start md:block"
      aria-hidden="true"
    >
      <SideCard
        className="absolute top-4 right-0 rotate-12"
        icon={<BanknoteArrowDown className="size-4 text-sky-600 dark:text-sky-300" />}
        label="Groceries"
        amount="-$86.40"
        tone="expense"
      />
      <div className="absolute top-28 left-1 flex size-12 -rotate-8 items-center justify-center rounded-full bg-card text-sky-700 shadow-md ring-1 ring-border dark:text-sky-300">
        <ShoppingBag className="size-5" />
      </div>
      <div className="absolute right-8 bottom-1 flex size-10 rotate-8 items-center justify-center rounded-full bg-card text-sky-600 shadow-md ring-1 ring-border dark:text-sky-300">
        <CreditCard className="size-4" />
      </div>
      <div className="absolute top-2 left-4 flex size-9 items-center justify-center rounded-full bg-card text-sky-700 shadow-md ring-1 ring-border dark:text-sky-300">
        <Receipt className="size-4" />
      </div>
    </div>
  );
}

export default function WelcomeCard() {
  return (
    <Card className="overflow-hidden border-dashed">
      <CardContent className="grid items-center gap-6 px-6 py-12 md:grid-cols-[1fr_auto_1fr] md:px-10">
        <LeftGraphics />
        <div className="flex flex-col items-center text-center">
          <WelcomeIllustration />
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            Welcome to Expense Flow
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
            You don&apos;t have any transactions yet. Go on and write it{" "}
            <NewTransactionDialog
              trigger={
                <Button
                  variant="link"
                  className="h-auto p-0 align-baseline text-base font-semibold text-sky-600 underline underline-offset-4 dark:text-sky-400"
                >
                  first
                </Button>
              }
            />
            .
          </p>
        </div>
        <RightGraphics />
      </CardContent>
    </Card>
  );
}
