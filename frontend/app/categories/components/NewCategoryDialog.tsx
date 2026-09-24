"use client";

import { PlusIcon } from "lucide-react";

import CategoryForm from "@/app/categories/components/CategoryForm";
import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";

export default function NewCategoryDialog() {
  return (
    <FormDialog
      title="New category"
      description="Add a new category for your expenses."
      trigger={
        <Button variant="primary">
          <PlusIcon />
          New category
        </Button>
      }
    >
      {({ onSuccess }) => (
        <CategoryForm showHeader={false} onSuccess={onSuccess} />
      )}
    </FormDialog>
  );
}
