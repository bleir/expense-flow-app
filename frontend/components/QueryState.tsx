import type { ReactNode } from "react";

import { Spinner } from "@/components/ui/spinner";
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
      <div className={cn("flex justify-center py-8", className)}>
        <Spinner
          className="size-6 text-muted-foreground"
          aria-label={loadingMessage}
        />
      </div>
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
