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
        <AccordionContent className="px-8">
          <p className="relative top-3 ml-4 inline-block bg-card px-2 text-sm text-muted-foreground">
            Transaction details
          </p>
          <div className="w-full rounded-md border bg-muted/40 px-4 py-6">
            <TransactionData label="Type" data={transaction.type} />
            <TransactionData label="Notes" data={transaction.notes || "—"} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
