import { cn } from "@/lib/cn";

export default function StatCard({ label, value, hint, icon: Icon, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-outline-variant/15 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(28,82,83,0.08)]",
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-on-surface-variant">
          {label}
        </p>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container/15 text-primary-container">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </div>
        )}
      </div>
      <p className="text-[28px] font-bold text-on-surface">{value}</p>
      {hint && <p className="mt-1 text-[13px] text-on-surface-variant">{hint}</p>}
    </div>
  );
}
