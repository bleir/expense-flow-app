"use client";

import ThemeToggle from "@/components/ThemeToggle";

export default function ThemeSettings() {
  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Dark theme</p>
        <p className="text-sm text-muted-foreground">
          Use a dark background across the app.
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
}
