"use client";

import EditColorDialog from "./EditColorDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import QueryState from "@/components/QueryState";
import { colorsApi } from "@/lib/colorsApi";
import { queryKeys } from "@/lib/queryKeys";
import { useDeleteEntity } from "@/lib/useDeleteEntity";
import { useQuery } from "@tanstack/react-query";

export default function ColorsList() {
  const {
    data: colors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.colors,
    queryFn: colorsApi.getAll,
  });

  const deleteMutation = useDeleteEntity({
    queryKey: queryKeys.colors,
    deleteFn: colorsApi.delete,
    entityName: "Color",
  });

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      isEmpty={!colors?.length}
      loadingMessage="Loading colors..."
      errorMessage="Failed to load colors."
      empty={<p className="text-sm text-muted-foreground">No colors yet.</p>}
    >
      <div className="divide-y rounded-lg border mt-4">
        {(colors ?? []).map((color) => (
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
    </QueryState>
  );
}
