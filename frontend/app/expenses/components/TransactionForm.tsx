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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/categoriesApi";
import {
  transactionsApi,
  type CreateTransactionDto,
  type Transaction,
} from "@/lib/transactionsApi";

const transactionFormSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  type: z.enum(["income", "expense"], {
    required_error: "Please select a type",
  }),
  amount: z.string().min(1, "Amount is required"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(100, "Description must be less than 100 characters"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional().nullable(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

type TransactionFormProps = {
  transaction?: Transaction;
  showHeader?: boolean;
  onSuccess?: () => void;
};

function toDateInputValue(date?: Date | string) {
  if (!date) {
    return new Date().toISOString().slice(0, 10);
  }

  return new Date(date).toISOString().slice(0, 10);
}

export default function TransactionForm({
  transaction,
  showHeader = true,
  onSuccess,
}: TransactionFormProps) {
  const isEditing = Boolean(transaction);
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  return (
    <EntityForm<TransactionFormValues>
      schema={transactionFormSchema}
      defaultValues={{
        categoryId: transaction?.categoryId ?? transaction?.category?.id ?? "",
        type: (transaction?.type as TransactionFormValues["type"]) ?? "expense",
        amount: transaction?.amount ?? "",
        description: transaction?.description ?? "",
        date: toDateInputValue(transaction?.date),
        notes: transaction?.notes ?? "",
      }}
      mutationFn={(data: CreateTransactionDto) =>
        isEditing
          ? transactionsApi.update(transaction!.id, data)
          : transactionsApi.create(data)
      }
      queryKey={["transactions"]}
      isEditing={isEditing}
      entityName="Transaction"
      showHeader={showHeader}
      titles={{
        create: "Create Transaction",
        edit: "Edit Transaction",
      }}
      descriptions={{
        create: "Add a new income or expense",
        edit: "Update this transaction",
      }}
      onSuccess={onSuccess}
    >
      {({ control, isPending }) => (
        <>
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  disabled={isPending || isLoadingCategories}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full border border-neutral-500"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Groceries"
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="20.00"
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Optional notes"
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending}
                  />
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
