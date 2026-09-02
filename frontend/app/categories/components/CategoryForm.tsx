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

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  color: z.enum(["yellow", "blue", "green", "gray"], {
    required_error: "Please select a color",
  }),
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

  return (
    <EntityForm<CategoryFormValues>
      schema={categoryFormSchema}
      defaultValues={{
        name: category?.name ?? "",
        color: category?.color,
      }}
      mutationFn={(data: CreateCategoryDto) =>
        isEditing
          ? categoriesApi.update(category!.id, data)
          : categoriesApi.create(data)
      }
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
                  value={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yellow">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-yellow-500" />
                        Yellow
                      </div>
                    </SelectItem>
                    <SelectItem value="blue">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500" />
                        Blue
                      </div>
                    </SelectItem>
                    <SelectItem value="green">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                        Green
                      </div>
                    </SelectItem>
                    <SelectItem value="gray">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-gray-500" />
                        Gray
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </EntityForm>
  );
}
