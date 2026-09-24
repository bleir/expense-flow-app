"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

type UseDeleteEntityOptions = {
  queryKey: QueryKey;
  deleteFn: (id: string) => Promise<unknown>;
  entityName: string;
  onDeleted?: (id: string) => void;
};

export function useDeleteEntity({
  queryKey,
  deleteFn,
  entityName,
  onDeleted,
}: UseDeleteEntityOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFn,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey });
      onDeleted?.(id);
      toast.success(`${entityName} has been deleted`);
    },
  });
}
