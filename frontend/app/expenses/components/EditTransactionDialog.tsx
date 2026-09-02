"use client";

import { PencilIcon } from "lucide-react";

import TransactionForm from "@/app/expenses/components/TransactionForm";
import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/transactionsApi";

type EditTransactionDialogProps = {
  transaction: Transaction;
};

export default function EditTransactionDialog({
  transaction,
}: EditTransactionDialogProps) {
  return (
    <FormDialog
      title="Edit transaction"
      description="Update this transaction."
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit transaction">
          <PencilIcon />
        </Button>
      }
    >
      {({ onSuccess }) => (
        <TransactionForm
          key={transaction.id}
          transaction={transaction}
          showHeader={false}
          onSuccess={onSuccess}
        />
      )}
    </FormDialog>
  );
}
