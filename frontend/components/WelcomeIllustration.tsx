import { Plus, Wallet, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export default function WelcomeIllustration({
  className,
  icon: Icon = Wallet,
}: {
  className?: string;
  icon?: LucideIcon;
}) {
  return (
    <div
      className={cn(
        "relative flex size-36 items-center justify-center",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-sky-100 dark:bg-sky-950" />
      <div className="absolute inset-4 rounded-full bg-sky-200/70 dark:bg-sky-900/70" />
      <div className="relative flex size-16 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/30 dark:bg-sky-500">
        <Icon className="size-8" strokeWidth={1.75} />
      </div>
      <div className="absolute top-2 right-1 flex size-9 items-center justify-center rounded-full bg-card text-sky-600 shadow-md ring-1 ring-border dark:text-sky-300">
        <Plus className="size-4" />
      </div>
    </div>
  );
}
