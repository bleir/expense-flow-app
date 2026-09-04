"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import EditColorDialog from "./EditColorDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { colorsApi } from "@/lib/colorsApi";
import { DEFAULT_CURRENCY_STORAGE_KEY } from "@/lib/defaultCurrency";
import { toast } from "sonner";

export default function ColorsList() {
  const queryClient = useQueryClient();

  const {
    data: colors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["colors"],
    queryFn: colorsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => colorsApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      if (localStorage.getItem(DEFAULT_CURRENCY_STORAGE_KEY) === id) {
        localStorage.removeItem(DEFAULT_CURRENCY_STORAGE_KEY);
      }
      toast.success("Colors has been deleted");
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading currencies...</p>;
  }

  if (isError) {
    return <p className="text-destructive">Failed to load currencies.</p>;
  }

  if (!colors?.length) {
    return <p className="text-sm text-muted-foreground">No currencies yet.</p>;
  }

  return (
    <div className="divide-y rounded-lg border mt-4">
      {colors.map((color) => (
        <div
          key={color.id}
          className="flex items-center justify-between px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-5 w-5 rounded-full border border-neutral-500"
              style={{ backgroundColor: color.color }}
            />
            <span className="text-sm font-semibold">{color.name}</span>
          </div>
          <div className="flex items-center">
            <EditColorDialog color={color} />
            <ConfirmDeleteDialog
              title="Delete color"
              description="Are you sure you want to delete this color?"
              ariaLabel="Delete color"
              isPending={deleteMutation.isPending}
              onConfirm={() => deleteMutation.mutate(color.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
