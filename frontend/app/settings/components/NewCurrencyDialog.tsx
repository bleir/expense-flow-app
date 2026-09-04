"use client";

import { PlusIcon } from "lucide-react";

import CurrencyForm from "./CurrencyForm";
import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";

export default function NewCurrencyDialog() {
  return (
    <FormDialog
      title="New currency"
      description="Add a currency you can use in the app."
      trigger={
        <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
          <PlusIcon />
          Add currency
        </Button>
      }
    >
      {({ onSuccess }) => (
        <CurrencyForm showHeader={false} onSuccess={onSuccess} />
      )}
    </FormDialog>
  );
}
