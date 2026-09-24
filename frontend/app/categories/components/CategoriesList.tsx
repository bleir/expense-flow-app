"use client";

import { useEffect, useMemo, useState } from "react";
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

        return (
          <Card key={category.id} className="gap-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div
                  className="h-5 w-5 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <CardTitle className="text-sm">{category.name}</CardTitle>
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
            <CardContent className="w-full space-y-2 mt-2">
              {category.monthlyBudget ? (
                <>
                  <Progress
                    value={animatedProgress}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    className={cn(
                      "w-full bg-gray-200 [&_[data-slot=progress-indicator]]:bg-gray-500 dark:bg-gray-700 dark:[&_[data-slot=progress-indicator]]:bg-gray-400",
                      isOverBudget &&
                        "bg-stone-200 [&_[data-slot=progress-indicator]]:bg-rose-800 dark:bg-rose-950 dark:[&_[data-slot=progress-indicator]]:bg-rose-400",
                    )}
                  />
                  <div className="flex w-full justify-between text-xs text-muted-foreground">
                    <span
                      className={cn(
                        isOverBudget &&
                          "font-medium text-rose-800 dark:text-rose-400",
                      )}
                    >{`${formatMoney(spent)} ${currency?.symbol} spent`}</span>
                    <span>
                      {`of ${formatMoney(budget)} ${currency?.symbol}`}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Progress
                    value={0}
                    className="w-full bg-gray-200 [&_[data-slot=progress-indicator]]:bg-gray-500 dark:bg-gray-700 dark:[&_[data-slot=progress-indicator]]:bg-gray-400"
                  />
                  <div className="flex w-full justify-between text-xs text-muted-foreground">
                    <span>Budget not set</span>
                  </div>
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
