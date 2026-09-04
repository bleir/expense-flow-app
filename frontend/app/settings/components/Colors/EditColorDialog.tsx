"use client";

import { PencilIcon } from "lucide-react";

import ColorForm from "./ColorForm";
import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";
import type { Color } from "@/lib/colorsApi";

type EditColorDialogProps = {
  color: Color;
};

export default function EditColorDialog({ color }: EditColorDialogProps) {
  return (
    <FormDialog
      title="Edit color"
      description="Update this color."
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit color">
          <PencilIcon />
        </Button>
      }
    >
      {({ onSuccess }) => (
        <ColorForm
          key={color.id}
          color={color}
          showHeader={false}
          onSuccess={onSuccess}
        />
      )}
    </FormDialog>
  );
}
