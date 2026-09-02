"use client";

import { PencilIcon } from "lucide-react";

import CategoryForm from "@/app/categories/components/CategoryForm";
import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/categoriesApi";

type EditCategoryDialogProps = {
  category: Category;
};

export default function EditCategoryDialog({
  category,
}: EditCategoryDialogProps) {
  return (
    <FormDialog
      title="Edit category"
      description="Update the name or color of this category."
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit category">
          <PencilIcon />
        </Button>
      }
    >
      {({ onSuccess }) => (
        <CategoryForm
          key={category.id}
          category={category}
          showHeader={false}
          onSuccess={onSuccess}
        />
      )}
    </FormDialog>
  );
}
