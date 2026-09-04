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
import {
  categoriesApi,
  type Category,
  type CreateCategoryDto,
} from "@/lib/categoriesApi";
import { useQuery } from "@tanstack/react-query";
import { colorsApi } from "@/lib/colorsApi";

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  color: z.string().min(1, "Please select a color"),
  monthlyBudget: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

type CategoryFormProps = {
  category?: Category;
  showHeader?: boolean;
  onSuccess?: () => void;
};

export default function CategoryForm({
  category,
  showHeader = true,
  onSuccess,
}: CategoryFormProps) {
  const isEditing = Boolean(category);

  const {
    data: colors,
    isLoading,
    isError,
  } = useQuery({
    queryFn: colorsApi.getAll,
    queryKey: ["colors"],
  });

  return (
    <EntityForm<CategoryFormValues>
      schema={categoryFormSchema}
      defaultValues={{
        name: category?.name ?? "",
        color: category?.color ?? "",
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
      queryKey={["categories"]}
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
      onSuccess={onSuccess}
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colors?.map((color) => (
                      <SelectItem key={color.id} value={color.color}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full border border-neutral-500"
                            style={{ backgroundColor: color.color }}
                          />
                          {color.name}
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
