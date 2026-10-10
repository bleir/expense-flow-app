"use client";

import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";

import CategoryForm from "@/app/categories/components/CategoryForm";
import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/categoriesApi";

type NewCategoryDialogProps = {
  trigger?: ReactNode;
  onCreated?: (category: Category) => void;
};

export default function NewCategoryDialog({
  trigger,
  onCreated,
}: NewCategoryDialogProps) {
  return (
    <FormDialog
      title="New category"
      description="Add a new category for your expenses."
      trigger={
        trigger ?? (
          <Button variant="primary">
            <PlusIcon />
            New category
          </Button>
        )
      }
    >
      {({ onSuccess }) => (
        <CategoryForm
          showHeader={false}
          onSuccess={(category) => {
            onCreated?.(category);
            onSuccess();
          }}
        />
      )}
    </FormDialog>
  );
}
