"use client";

import { useQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";

import EditColorDialog from "./EditColorDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import QueryState from "@/components/QueryState";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { colorsApi } from "@/lib/colorsApi";
import { useQueryKeys } from "@/lib/queryKeys";
import { useDeleteEntity } from "@/lib/useDeleteEntity";

export default function ColorsList() {
  const queryKeys = useQueryKeys();
  const {
    data: colors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.colors,
    queryFn: colorsApi.getAll,
    enabled: Boolean(queryKeys.userId),
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(colors ?? []).map((color) => (
          <Card
            key={color.id}
            className="gap-0 py-4 shadow-md ring-1 ring-border/60"
            style={{ "--swatch": color.color } as CSSProperties}
          >
            <CardHeader className="items-center px-4">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--swatch)_18%,transparent)]"
                >
                  <span className="size-5 rounded-full bg-(--swatch) shadow-sm" />
                </span>
                <div className="min-w-0">
                  <CardTitle className="truncate text-base tracking-tight">
                    {color.name}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs tracking-wide uppercase">
                    {color.color}
                  </CardDescription>
                </div>
              </div>
              <CardAction className="flex">
                <EditColorDialog color={color} />
                <ConfirmDeleteDialog
                  title="Delete color"
                  description="Are you sure you want to delete this color?"
                  ariaLabel="Delete color"
                  isPending={deleteMutation.isPending}
                  onConfirm={() => deleteMutation.mutate(color.id)}
                />
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </QueryState>
  );
}
