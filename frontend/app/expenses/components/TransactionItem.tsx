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
import { transactionsApi } from "@/lib/transactionsApi";
import { queryKeys } from "@/lib/queryKeys";
import { useDeleteEntity } from "@/lib/useDeleteEntity";
import { type TransactionType } from "@/lib/transactionsApi";
import { BanknoteArrowUp, BanknoteArrowDown } from "lucide-react";
import { useDefaultCurrency } from "@/lib/defaultCurrency";

const renderTransactionIcon = (transactionType: TransactionType) => {
  return transactionType === "income" ? (
    <BanknoteArrowUp color="green" />
  ) : (
    <BanknoteArrowDown color="red" />
  );
};

export default function TransactionItem({ transaction }: { transaction: any }) {
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
            <span className="flex flex-1 items-center gap-2">
              {renderTransactionIcon(transaction.type)}
              {transaction.description}
            </span>
            <span
              className={cn(
                "text-base font-bold tabular-nums",
                transaction.type === "income"
                  ? "text-green-600 dark:text-green-400"
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
          <p className="inline-block text-base ml-4 mb-2 px-2 bg-white relative top-5">
            Transaction details
          </p>
          <div className="rounded-md border py-6 px-4 w-full bg-gray-50">
            <TransactionData
              label="Date"
              data={formatDisplayDate(transaction.date)}
            />
            <TransactionData
              label="Category"
              data={
                <div className="flex gap-2 items-center">
                  <span
                    className="w-5 h-5 rounded-full block"
                    style={{
                      backgroundColor: transaction?.category?.color,
                    }}
                  />
                  {transaction.category?.name ?? "-"}
                </div>
              }
            />
            <TransactionData label="Type" data={transaction.type} />
            <TransactionData label="Notes" data={transaction.notes || "-"} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
