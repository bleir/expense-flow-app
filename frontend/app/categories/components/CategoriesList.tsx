"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilIcon, TrashIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categoriesApi, type Color } from "@/lib/api";

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
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <div className="flex items-start gap-2">
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: colorMap[category.color] }}
              />
              <CardTitle>{category.name}</CardTitle>
            </div>
            <CardAction className="flex gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Edit category">
                <PencilIcon />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete category"
                    className="text-destructive hover:text-destructive"
                    disabled={deleteMutation.isPending}
                  >
                    <TrashIcon />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete category</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this category?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(category.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
