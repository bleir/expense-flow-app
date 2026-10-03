"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

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
        disabled={!mounted}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
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
