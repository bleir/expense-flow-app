"use client";

import { PlusIcon } from "lucide-react";

import ColorForm from "./ColorForm";
import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";

export default function NewColorDialog() {
  return (
    <FormDialog
      title="New color"
      description="Add a color you can use in the app."
      trigger={
        <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
          <PlusIcon />
          Add color
        </Button>
      }
    >
      {({ onSuccess }) => (
        <ColorForm showHeader={false} onSuccess={onSuccess} />
      )}
    </FormDialog>
  );
}
