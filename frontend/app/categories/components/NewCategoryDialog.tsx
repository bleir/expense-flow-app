"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

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

export default function NewCategoryDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-600 text-white hover:bg-sky-700">
          <PlusIcon />
          New category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>
            Add a new category for your expenses.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm showHeader={false} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
