"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";

import CategoryForm from "@/app/dashboard/components/CategoryForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@/lib/api";

type EditCategoryDialogProps = {
  category: Category;
};

export default function EditCategoryDialog({
  category,
}: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Edit category">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>
            Update the name or color of this category.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          key={category.id}
          category={category}
          showHeader={false}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
