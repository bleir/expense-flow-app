"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center justify-between gap-4">
      <CardDescription>
        Choose light, dark, or match your system.
      </CardDescription>
      {mounted ? (
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="h-9 w-36 rounded-md border border-input" />
      )}
    </div>
  );
}
