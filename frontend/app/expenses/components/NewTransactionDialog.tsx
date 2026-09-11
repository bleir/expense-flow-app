"use client";

import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";

import TransactionForm from "@/app/expenses/components/TransactionForm";
import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";

type NewTransactionDialogProps = {
  trigger?: ReactNode;
};

export default function NewTransactionDialog({
  trigger,
}: NewTransactionDialogProps) {
  return (
    <FormDialog
      title="New transaction"
      description="Add a new income or expense."
      trigger={
        trigger ?? (
          <Button className="bg-sky-600 text-white hover:bg-sky-700">
            <PlusIcon />
            New transaction
          </Button>
        )
      }
    >
      {({ onSuccess }) => (
        <TransactionForm showHeader={false} onSuccess={onSuccess} />
      )}
    </FormDialog>
  );
}
