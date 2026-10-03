import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EditTransactionDialog from "./EditTransactionDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import TransactionData from "./TransactionData";
import { formatDisplayDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import {
  transactionsApi,
  type Transaction,
  type TransactionCategory,
  type TransactionType,
} from "@/lib/transactionsApi";
import { queryKeys } from "@/lib/queryKeys";
import { useDeleteEntity } from "@/lib/useDeleteEntity";
import { BanknoteArrowUp, BanknoteArrowDown } from "lucide-react";
import { useDefaultCurrency } from "@/lib/defaultCurrency";

const renderTransactionIcon = (transactionType: TransactionType) => {
  return transactionType === "income" ? (
    <BanknoteArrowUp className="text-emerald-600 dark:text-emerald-400" />
  ) : (
    <BanknoteArrowDown className="text-sky-700 dark:text-sky-300" />
  );
};

function CategoryPill({ category }: { category?: TransactionCategory | null }) {
  return (
    <Badge variant="outline">
      <span
        className="size-2 shrink-0 rounded-full"
        style={{
          backgroundColor: category?.color ?? "hsl(var(--muted-foreground))",
        }}
      />
      {category?.name ?? "—"}
    </Badge>
  );
}

export default function TransactionItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  const { currency } = useDefaultCurrency();
  const currencySymbol = currency?.symbol ?? "$";

  const deleteMutation = useDeleteEntity({
    queryKey: queryKeys.transactions,
    deleteFn: transactionsApi.delete,
    entityName: "Transaction",
  });

  return (
    <Accordion key={transaction.id} type="multiple">
      <AccordionItem value={transaction.id}>
        <div className="flex items-center gap-2 px-6">
          <AccordionTrigger className="items-center hover:no-underline cursor-pointer">
            <span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
              <span className="flex items-center gap-2">
                {renderTransactionIcon(transaction.type)}
                <span className="truncate">{transaction.description}</span>
              </span>
              <span className="flex flex-wrap items-center gap-2 pl-8 text-sm text-muted-foreground">
                <span>{formatDisplayDate(transaction.date)}</span>
                <CategoryPill category={transaction.category} />
              </span>
            </span>
            <span
              className={cn(
                "text-base font-bold tabular-nums",
                transaction.type === "income"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-foreground",
              )}
            >
              {formatMoney(transaction.amount)} {currencySymbol}
            </span>
          </AccordionTrigger>
          <div className="flex shrink-0 items-center">
            <EditTransactionDialog transaction={transaction} />
            <ConfirmDeleteDialog
              title="Delete transaction"
              description="Are you sure you want to delete this transaction?"
              ariaLabel="Delete transaction"
              isPending={deleteMutation.isPending}
              onConfirm={() => deleteMutation.mutate(transaction.id)}
            />
          </div>
        </div>
        <AccordionContent className="px-6">
          <div className="grid gap-4 rounded-lg bg-muted/40 p-4 ring-1 ring-border/60">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <TransactionData
                label="Date"
                data={formatDisplayDate(transaction.date)}
              />
              <TransactionData
                label="Category"
                data={<CategoryPill category={transaction.category} />}
              />
              <TransactionData
                label="Type"
                data={
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      transaction.type === "income"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
                    )}
                  >
                    {transaction.type === "income" ? "Income" : "Expense"}
                  </span>
                }
              />
              <TransactionData
                label="Amount"
                data={
                  <span
                    className={cn(
                      "tabular-nums",
                      transaction.type === "income" &&
                        "text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    {formatMoney(transaction.amount)} {currencySymbol}
                  </span>
                }
              />
            </div>
            <div className="border-t border-border/70 pt-3">
              <TransactionData
                label="Notes"
                data={
                  transaction.notes?.trim() || (
                    <span className="font-normal text-muted-foreground">
                      No notes for this transaction.
                    </span>
                  )
                }
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
