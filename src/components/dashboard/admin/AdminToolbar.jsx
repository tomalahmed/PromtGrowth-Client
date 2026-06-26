"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

export default function AdminToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterLabel,
  onFilterClick,
  className,
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative min-w-[220px] flex-1 sm:max-w-md">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
          strokeWidth={1.75}
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-outline-variant/25 bg-white py-2.5 pr-4 pl-10 text-[14px] text-on-surface outline-none transition-all placeholder:text-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/15"
        />
      </div>
      {filterLabel && (
        <button
          type="button"
          onClick={onFilterClick}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2.5 text-[13px] font-semibold text-on-primary transition-colors hover:bg-primary"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
          {filterLabel}
        </button>
      )}
    </div>
  );
}
