"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import QueryState from "@/components/QueryState";
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
import {
  formatDateKey,
  formatDisplayDate,
  parseLocalDate,
  startOfLocalDay,
} from "@/lib/dates";
import { useDefaultCurrency } from "@/lib/defaultCurrency";
import { formatMoney } from "@/lib/money";
import { Transaction } from "@/lib/transactionsApi";
import { useTransactions } from "@/lib/useTransactions";

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

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildDailyTotals(transactions: Transaction[]) {
  const dated = transactions
    .map((transaction) => ({
      ...transaction,
      parsedDate: parseLocalDate(transaction.date),
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
  } = useTransactions();

  const chartData = useMemo(
    () => buildDailyTotals(transactions ?? []),
    [transactions],
  );

  return (
    <QueryState
      isLoading={isPending}
      isError={isError}
      isEmpty={!transactions?.length}
      loadingMessage="Loading chart..."
      errorMessage="Failed to load chart."
      empty={
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Spending</CardTitle>
            <CardDescription>
              Create a transaction to see your last 30 days on a chart.
            </CardDescription>
          </CardHeader>
        </Card>
      }
    >
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
                formatDisplayDate(value, { month: "short", day: "numeric" })
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value: number) =>
                formatMoney(value, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    typeof value === "string"
                      ? formatDisplayDate(value)
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
    </QueryState>
  );
}
