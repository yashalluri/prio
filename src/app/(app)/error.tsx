"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4 p-6">
      <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-2xl">
        <AlertTriangle className="text-destructive size-6" />
      </div>
      <div className="text-center">
        <h2 className="font-heading text-lg font-semibold">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mt-1 max-w-md text-sm">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
