"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import EditCategoryDialog from "./EditCategoryDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { categoriesApi, type Color } from "@/lib/categoriesApi";
import { toast } from "sonner";

const colorMap: Record<Color, string> = {
  yellow: "#eab308",
  blue: "#3b82f6",
  green: "#22c55e",
  gray: "#6b7280",
};

export default function CategoriesList() {
  const queryClient = useQueryClient();

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
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: colorMap[category.color] }}
                  />
                  <CardTitle className="text-sm">{category.name}</CardTitle>
                </div>
                <Progress
                  value={23}
                  className="bg-gray-200 [&_[data-slot=progress-indicator]]:bg-gray-500"
                />
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
          </Card>
        );
      })}
    </div>
  );
}
