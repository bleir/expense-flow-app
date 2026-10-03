"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";

import EditCategoryDialog from "./EditCategoryDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import QueryState from "@/components/QueryState";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { categoriesApi } from "@/lib/categoriesApi";
import { isInCurrentMonth } from "@/lib/dates";
import { useDefaultCurrency } from "@/lib/defaultCurrency";
import { formatMoney } from "@/lib/money";
import { queryKeys } from "@/lib/queryKeys";
import { useDeleteEntity } from "@/lib/useDeleteEntity";
import { useTransactions } from "@/lib/useTransactions";
import { Transaction } from "@/lib/transactionsApi";
import { cn } from "@/lib/utils";

function getSpentByCategory(transactions: Transaction[] | undefined) {
  const totals = new Map<string, number>();

  for (const transaction of transactions ?? []) {
    if (transaction.type !== "expense" || !isInCurrentMonth(transaction.date)) {
      continue;
    }

    const categoryId = transaction.categoryId ?? transaction.category?.id;
    if (!categoryId) {
      continue;
    }

    totals.set(
      categoryId,
      (totals.get(categoryId) ?? 0) + Number(transaction.amount),
    );
  }

  return totals;
}

export default function CategoriesList() {
  const { currency } = useDefaultCurrency();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.getAll,
  });

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
  } = useTransactions();

  const deleteMutation = useDeleteEntity({
    queryKey: queryKeys.categories,
    deleteFn: categoriesApi.delete,
    entityName: "Category",
  });

  const spentByCategory = useMemo(
    () => getSpentByCategory(transactions),
    [transactions],
  );
  const [showProgress, setShowProgress] = useState(false);
  const isReady = !isLoading && !isLoadingTransactions && !!categories?.length;

  useEffect(() => {
    if (!isReady) {
      setShowProgress(false);
      return;
    }

    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        setShowProgress(true);
      });
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [isReady]);

  return (
    <QueryState
      isLoading={isLoading || isLoadingTransactions}
      isError={isError || isErrorTransactions}
      isEmpty={!categories?.length}
      loadingMessage="Loading categories..."
      errorMessage="Failed to load categories."
      empty={
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No categories yet</CardTitle>
            <CardDescription>
              Create your first category to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      }
    >
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(categories ?? []).map((category, index) => {
        const spent = spentByCategory.get(category.id) ?? 0;
        const budget = Number(category.monthlyBudget);
        const isOverBudget = budget > 0 && spent > budget;
        const progress =
          budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
        const animatedProgress = showProgress ? progress : 0;
        const symbol = currency?.symbol;

        return (
          <Card
            key={category.id}
            className="gap-1"
            style={{ "--category-color": category.color } as CSSProperties}
          >
            <CardHeader className="items-center">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--category-color)_18%,transparent)]"
                >
                  <span className="size-3.5 rounded-full bg-(--category-color)" />
                </span>
                <CardTitle className="truncate text-base tracking-tight">
                  {category.name}
                </CardTitle>
              </div>
              <CardAction className="flex gap-1">
                <EditCategoryDialog category={category} />
                <ConfirmDeleteDialog
                  title="Delete category"
                  description="Are you sure you want to delete this category?"
                  ariaLabel="Delete category"
                  isPending={deleteMutation.isPending}
                  onConfirm={() => deleteMutation.mutate(category.id)}
                />
              </CardAction>
            </CardHeader>
            <CardContent className="mt-3 w-full space-y-2.5">
              {category.monthlyBudget ? (
                <>
                  <Progress
                    value={animatedProgress}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    className={cn(
                      "h-2.5",
                      isOverBudget
                        ? "bg-rose-100 [&_[data-slot=progress-indicator]]:bg-rose-600 dark:bg-rose-950 dark:[&_[data-slot=progress-indicator]]:bg-rose-400"
                        : "bg-[color-mix(in_srgb,var(--category-color)_18%,transparent)] [&_[data-slot=progress-indicator]]:bg-(--category-color)",
                    )}
                  />
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <p>
                      <span
                        className={cn(
                          "font-medium tabular-nums",
                          isOverBudget && "text-rose-700 dark:text-rose-400",
                        )}
                      >
                        {formatMoney(spent)}
                        {symbol ? ` ${symbol}` : ""}
                      </span>
                      <span className="text-muted-foreground"> spent</span>
                    </p>
                    <p className="text-muted-foreground tabular-nums">
                      of {formatMoney(budget)}
                      {symbol ? ` ${symbol}` : ""}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Progress
                    value={0}
                    className="h-2.5 bg-[color-mix(in_srgb,var(--category-color)_18%,transparent)]"
                  />
                  <p className="text-sm text-muted-foreground">Budget not set</p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
    </QueryState>
  );
}
