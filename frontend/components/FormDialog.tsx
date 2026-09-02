"use client";

import { useState, type ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FormDialogProps = {
  title: string;
  description: string;
  trigger: ReactNode;
  children: (helpers: { onSuccess: () => void }) => ReactNode;
};

export default function FormDialog({
  title,
  description,
  trigger,
  children,
}: FormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children({ onSuccess: () => setOpen(false) })}
      </DialogContent>
    </Dialog>
  );
}
