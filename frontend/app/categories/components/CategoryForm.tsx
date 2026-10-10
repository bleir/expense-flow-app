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
  categoriesApi,
  type Category,
  type CreateCategoryDto,
} from "@/lib/categoriesApi";
import { useQueryKeys } from "@/lib/queryKeys";

const DEFAULT_COLOR = "#6b7280";

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Pick a valid color"),
  monthlyBudget: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

type CategoryFormProps = {
  category?: Category;
  showHeader?: boolean;
  onSuccess?: (category: Category) => void;
};

export default function CategoryForm({
  category,
  showHeader = true,
  onSuccess,
}: CategoryFormProps) {
  const isEditing = Boolean(category);
  const queryKeys = useQueryKeys();

  return (
    <EntityForm<CategoryFormValues>
      schema={categoryFormSchema}
      defaultValues={{
        name: category?.name ?? "",
        color: category?.color || DEFAULT_COLOR,
        monthlyBudget: category?.monthlyBudget ?? "",
      }}
      mutationFn={(data: CreateCategoryDto) => {
        const payload: CreateCategoryDto = {
          ...data,
          monthlyBudget: data.monthlyBudget?.trim()
            ? data.monthlyBudget
            : null,
        };

        return isEditing
          ? categoriesApi.update(category!.id, payload)
          : categoriesApi.create(payload);
      }}
      queryKey={queryKeys.categories}
      isEditing={isEditing}
      entityName="Category"
      showHeader={showHeader}
      titles={{
        create: "Create Category",
        edit: "Edit Category",
      }}
      descriptions={{
        create: "Add a new category for your expenses",
        edit: "Update this category name or color",
      }}
      onSuccess={(data) => onSuccess?.(data as Category)}
    >
      {({ control, isPending }) => (
        <>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value || DEFAULT_COLOR}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={isPending}
                    />
                    <span className="font-mono text-sm uppercase text-muted-foreground">
                      {field.value || DEFAULT_COLOR}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="monthlyBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly budget limit</FormLabel>
                <FormControl>
                  <Input placeholder="250" {...field} disabled={isPending} />
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
