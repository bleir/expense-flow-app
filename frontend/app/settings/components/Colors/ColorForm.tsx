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
import { colorsApi, type CreateColorDto, type Color } from "@/lib/colorsApi";

const DEFAULT_COLOR = "#808080";

const colorFormSchema = z.object({
  name: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Pick a valid color"),
});

type ColorFormValues = z.infer<typeof colorFormSchema>;

type ColorFormProps = {
  color?: Color;
  showHeader?: boolean;
  onSuccess?: () => void;
  submitLabel?: string;
};

export default function ColorForm({
  color,
  showHeader = true,
  onSuccess,
  submitLabel,
}: ColorFormProps) {
  const isEditing = Boolean(color);

  return (
    <EntityForm<ColorFormValues>
      schema={colorFormSchema}
      defaultValues={{
        name: color?.name ?? "",
        color: color?.color ?? DEFAULT_COLOR,
      }}
      mutationFn={(data) => {
        const payload: CreateColorDto = {
          ...data,
        };

        return isEditing
          ? colorsApi.update(color!.id, payload)
          : colorsApi.create(payload);
      }}
      queryKey={["colors"]}
      isEditing={isEditing}
      entityName="Color"
      showHeader={showHeader}
      titles={{
        create: "Create Color",
        edit: "Edit Color",
      }}
      descriptions={{
        create: "Add a new color",
        edit: "Update this color",
      }}
      submitLabel={submitLabel ?? (isEditing ? "Save changes" : "Save")}
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
                    placeholder="Light gray"
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
                <FormControl>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value || DEFAULT_COLOR}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={isPending}
                    />
                    <span className="font-mono text-sm uppercase text-muted-foreground">
                      {field.value || DEFAULT_COLOR}
                    </span>
                  </div>
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
