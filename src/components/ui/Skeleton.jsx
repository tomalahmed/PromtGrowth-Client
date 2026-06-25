import { cn } from "@/lib/cn";

export default function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-surface-container-high/80",
        className
      )}
    />
  );
}

export function PromptCardSkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-outline-variant/20 bg-white p-6">
      <Skeleton className="mb-4 h-6 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-6 h-4 w-5/6" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 rounded-2xl border border-outline-variant/15 bg-white p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}
