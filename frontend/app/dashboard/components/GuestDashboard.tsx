import { Tags, TrendingUp, Wallet, type LucideIcon } from "lucide-react";

import WelcomeIllustration from "@/components/WelcomeIllustration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const benefits: {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}[] = [
  {
    title: "Balance at a glance",
    description: "See income, expenses, and what's left without opening a spreadsheet.",
    icon: Wallet,
    iconClassName:
      "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  {
    title: "Spending over time",
    description: "Follow how money moves across the last 30 days.",
    icon: TrendingUp,
    iconClassName:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    title: "Categories that stand out",
    description: "Group transactions and color them so spending is easy to scan.",
    icon: Tags,
    iconClassName:
      "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
];

export default function GuestDashboard() {
  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center px-6 py-16 text-center">
          <WelcomeIllustration />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
            Welcome to Expense Flow
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
            Sign in to see your income, spending, and balance, or create an
            account to start tracking.
          </p>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <Card
              key={benefit.title}
              className="gap-3 py-5 shadow-md ring-1 ring-border/60"
            >
              <CardHeader className="gap-3 px-5">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    benefit.iconClassName,
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <CardTitle>{benefit.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {benefit.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </>
  );
}
