"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDefaultCurrency } from "@/lib/defaultCurrency";
import { Transaction, transactionsApi } from "@/lib/transactionsApi";

const DAYS = 30;

const chartConfig = {
  expense: {
    label: "Expenses",
    color: "var(--color-chart-1)",
  },
  income: {
    label: "Income",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

function startOfLocalDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseTransactionDate(date: Date | string) {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Date(`${date}T00:00:00`);
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : startOfLocalDay(parsed);
}

function buildDailyTotals(transactions: Transaction[]) {
  const dated = transactions
    .map((transaction) => ({
      ...transaction,
      parsedDate: parseTransactionDate(transaction.date),
    }))
    .filter(
      (transaction): transaction is typeof transaction & { parsedDate: Date } =>
        transaction.parsedDate !== null,
    );

  let end = startOfLocalDay(new Date());
  const windowStart = addDays(end, -(DAYS - 1));
  const hasRecent = dated.some(
    (transaction) =>
      transaction.parsedDate >= windowStart && transaction.parsedDate <= end,
  );
  const latest = dated.reduce<Date | null>((max, transaction) => {
    if (!max || transaction.parsedDate > max) {
      return transaction.parsedDate;
    }
    return max;
  }, null);

  if (latest && !hasRecent) {
    end = latest;
  }

  const start = addDays(end, -(DAYS - 1));
  const points = new Map<string, { date: string; expense: number; income: number }>();

  for (let i = 0; i < DAYS; i++) {
    const key = formatDateKey(addDays(start, i));
    points.set(key, { date: key, expense: 0, income: 0 });
  }

  for (const transaction of dated) {
    const point = points.get(formatDateKey(transaction.parsedDate));
    if (!point) {
      continue;
    }

    const amount = Number(transaction.amount);
    if (!Number.isFinite(amount)) {
      continue;
    }

    if (transaction.type === "income") {
      point.income += amount;
    } else {
      point.expense += amount;
    }
  }

  return [...points.values()];
}

export default function SpendingLineChart() {
  const { currency } = useDefaultCurrency();
  const currencySymbol = currency?.symbol ?? "$";

  const {
    data: transactions,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsApi.getAll(),
  });

  const chartData = useMemo(
    () => buildDailyTotals(transactions ?? []),
    [transactions],
  );

  if (isPending) {
    return <p className="text-muted-foreground">Loading chart...</p>;
  }

  if (isError) {
    return <p className="text-destructive">Failed to load chart.</p>;
  }

  if (!transactions?.length) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Spending</CardTitle>
          <CardDescription>
            Create a transaction to see your last 30 days on a chart.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 30 days</CardTitle>
        <CardDescription>
          Daily income and expenses in {currencySymbol}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value: string) =>
                new Date(`${value}T00:00:00`).toLocaleDateString(
                  navigator.language,
                  { month: "short", day: "numeric" },
                )
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value: number) =>
                value.toLocaleString(navigator.language, {
                  maximumFractionDigits: 0,
                })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    typeof value === "string"
                      ? new Date(`${value}T00:00:00`).toLocaleDateString(
                          navigator.language,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : String(value ?? "")
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="var(--color-expense)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              dataKey="income"
              type="monotone"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
