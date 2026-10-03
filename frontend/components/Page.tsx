import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function Page({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-col gap-6 p-6",
        className,
      )}
    >
      {children}
    </main>
  );
}
