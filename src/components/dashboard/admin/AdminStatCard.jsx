"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const ACCENT_BORDER = {
  default: "border-l-primary-container",
  pending: "border-l-cyan-600",
  approved: "border-l-emerald-600",
  rejected: "border-l-red-500",
  revenue: "border-l-amber-500",
};

export default function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  index = 0,
  accent = "default",
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-outline-variant/15 border-l-4 bg-white p-5 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.1)] transition-shadow hover:shadow-[0_12px_40px_-8px_rgba(21,82,30,0.14)]",
        ACCENT_BORDER[accent] || ACCENT_BORDER.default,
        className
      )}
    >
      {Icon && (
        <Icon
          className="pointer-events-none absolute -right-2 -bottom-2 h-20 w-20 text-primary-container/[0.06]"
          strokeWidth={1}
        />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        {Icon && (
          <motion.div
            whileHover={{ rotate: 8, scale: 1.1 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/12 text-primary-container"
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </motion.div>
        )}
      </div>
      <motion.p
        key={String(value)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mt-3 text-[28px] font-bold tracking-tight text-primary"
      >
        {value}
      </motion.p>
      {hint && (
        <p className="relative mt-1.5 text-[13px] text-on-surface-variant">{hint}</p>
      )}
    </motion.div>
  );
}
