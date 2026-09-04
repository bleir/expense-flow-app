"use client";

import { PencilIcon } from "lucide-react";

import CurrencyForm from "./CurrencyForm";
import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";
import type { Currency } from "@/lib/currenciesApi";

type EditCurrencyDialogProps = {
  currency: Currency;
};

export default function EditCurrencyDialog({
  currency,
}: EditCurrencyDialogProps) {
  return (
    <FormDialog
      title="Edit currency"
      description="Update this currency."
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit currency">
          <PencilIcon />
        </Button>
      }
    >
      {({ onSuccess }) => (
        <CurrencyForm
          key={currency.id}
          currency={currency}
          showHeader={false}
          onSuccess={onSuccess}
        />
      )}
    </FormDialog>
  );
}
