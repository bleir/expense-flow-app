"use client";

import * as z from "zod";

import EntityForm from "@/components/EntityForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  currenciesApi,
  type CreateCurrencyDto,
  type Currency,
} from "@/lib/currenciesApi";

const currencyFormSchema = z.object({
  currency: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  code: z
    .string()
    .min(3, "Code must be 3 characters")
    .max(3, "Code must be 3 characters"),
  symbol: z.string().min(1, "Symbol is required").max(5, "Symbol is too long"),
});

type CurrencyFormValues = z.infer<typeof currencyFormSchema>;

type CurrencyFormProps = {
  currency?: Currency;
  showHeader?: boolean;
  onSuccess?: () => void;
  submitLabel?: string;
};

export default function CurrencyForm({
  currency,
  showHeader = true,
  onSuccess,
  submitLabel,
}: CurrencyFormProps) {
  const isEditing = Boolean(currency);

  return (
    <EntityForm<CurrencyFormValues>
      schema={currencyFormSchema}
      defaultValues={{
        currency: currency?.currency ?? "",
        code: currency?.code ?? "",
        symbol: currency?.symbol ?? "",
      }}
      mutationFn={(data) => {
        const payload: CreateCurrencyDto = {
          ...data,
          isActive: currency?.isActive ?? true,
        };

        return isEditing
          ? currenciesApi.update(currency!.id, payload)
          : currenciesApi.create(payload);
      }}
      queryKey={["currencies"]}
      isEditing={isEditing}
      entityName="Currency"
      showHeader={showHeader}
      titles={{
        create: "Create Currency",
        edit: "Edit Currency",
      }}
      descriptions={{
        create: "Add a new currency",
        edit: "Update this currency",
      }}
      submitLabel={submitLabel ?? (isEditing ? "Save changes" : "Save")}
      onSuccess={onSuccess}
    >
      {({ control, isPending }) => (
        <>
          <FormField
            control={control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Polish Zlotych"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="PLN" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="zł" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </EntityForm>
  );
}
