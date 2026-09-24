import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type QueryStateProps = {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  loadingMessage: string;
  errorMessage: string;
  empty?: ReactNode;
  className?: string;
  children: ReactNode;
};

export default function QueryState({
  isLoading,
  isError,
  isEmpty = false,
  loadingMessage,
  errorMessage,
  empty = null,
  className,
  children,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <p className={cn("text-muted-foreground", className)}>{loadingMessage}</p>
    );
  }

  if (isError) {
    return <p className={cn("text-destructive", className)}>{errorMessage}</p>;
  }

  if (isEmpty) {
    return empty;
  }

  return children;
}
