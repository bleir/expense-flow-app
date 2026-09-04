"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  useForm,
  type Control,
  type DefaultValues,
  type FieldValues,
} from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

type EntityFormProps<TValues extends FieldValues> = {
  schema: z.ZodType<TValues>;
  defaultValues: DefaultValues<TValues>;
  mutationFn: (data: TValues) => Promise<unknown>;
  queryKey: QueryKey;
  isEditing: boolean;
  entityName: string;
  showHeader?: boolean;
  titles: {
    create: string;
    edit: string;
  };
  descriptions: {
    create: string;
    edit: string;
  };
  onSuccess?: () => void;
  submitLabel?: string;
  children: (helpers: {
    control: Control<TValues>;
    isPending: boolean;
  }) => ReactNode;
};

export default function EntityForm<TValues extends FieldValues>({
  schema,
  defaultValues,
  mutationFn,
  queryKey,
  isEditing,
  entityName,
  showHeader = true,
  titles,
  descriptions,
  onSuccess,
  submitLabel,
  children,
}: EntityFormProps<TValues>) {
  const queryClient = useQueryClient();

  const form = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      if (!isEditing) {
        form.reset();
      }
      onSuccess?.();
      toast.success(
        `${entityName} has been ${isEditing ? "updated" : "created"}`,
      );
    },
  });

  return (
    <div className="w-full space-y-4">
      {showHeader && (
        <div>
          <h2 className="text-2xl font-bold">
            {isEditing ? titles.edit : titles.create}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? descriptions.edit : descriptions.create}
          </p>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-6"
        >
          {children({
            control: form.control,
            isPending: mutation.isPending,
          })}

          {mutation.isError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              Error: {mutation.error.message}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-sky-600 text-white hover:bg-sky-700"
            >
              {mutation.isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : (submitLabel ??
                  (isEditing ? "Save changes" : `Create ${entityName}`))}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
