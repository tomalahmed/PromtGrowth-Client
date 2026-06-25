"use client";

import Button from "@/components/ui/Button";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-[24px] font-bold text-primary">Something went wrong</h2>
      <p className="mb-6 max-w-md text-on-surface-variant">
        {error?.message || "An unexpected error occurred while loading this page."}
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
