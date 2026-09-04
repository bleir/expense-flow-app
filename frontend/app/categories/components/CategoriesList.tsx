"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import EditCategoryDialog from "./EditCategoryDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { categoriesApi } from "@/lib/categoriesApi";
import { toast } from "sonner";
import { useDefaultCurrency } from "@/lib/defaultCurrency";

export default function CategoriesList() {
  const queryClient = useQueryClient();
  const { currency } = useDefaultCurrency();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category has been deleted");
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading categories...</p>;
  }

  if (isError) {
    return <p className="text-destructive">Failed to load categories.</p>;
  }

  if (!categories?.length) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No categories yet</CardTitle>
          <CardDescription>
            Create your first category to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        return (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div
                  className="h-5 w-5 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <CardTitle className="text-sm">{category.name}</CardTitle>
              </div>
              <CardAction className="flex gap-1">
                <EditCategoryDialog category={category} />
                <ConfirmDeleteDialog
                  title="Delete category"
                  description="Are you sure you want to delete this category?"
                  ariaLabel="Delete category"
                  isPending={deleteMutation.isPending}
                  onConfirm={() => deleteMutation.mutate(category.id)}
                />
              </CardAction>
            </CardHeader>
            {category.monthlyBudget && (
              <CardContent className="w-full space-y-2 mt-2">
                <Progress
                  value={Number(category.monthlyBudget)}
                  className="w-full bg-gray-200 [&_[data-slot=progress-indicator]]:bg-gray-500"
                />
                <div className="flex w-full justify-between text-xs text-muted-foreground">
                  <span>{`0,00 ${currency?.symbol} spent`}</span>
                  <span>
                    {`of ${category.monthlyBudget} ${currency?.symbol}`}
                  </span>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
