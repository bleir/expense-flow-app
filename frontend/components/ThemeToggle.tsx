"use client";

import { Moon, Sun } from "lucide-react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme, isReady } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-1.5">
      <Sun
        aria-hidden
        className={cn(
          "size-4",
          isDark ? "text-muted-foreground" : "text-foreground",
        )}
      />
      <Switch
        checked={isDark}
        disabled={!isReady}
        onCheckedChange={(checked) => {
          void setTheme(checked ? "dark" : "light").catch((error: unknown) => {
            toast.error(
              error instanceof Error ? error.message : "Could not save theme",
            );
          });
        }}
        aria-label="Dark theme"
      />
      <Moon
        aria-hidden
        className={cn(
          "size-4",
          isDark ? "text-foreground" : "text-muted-foreground",
        )}
      />
    </div>
  );
}
