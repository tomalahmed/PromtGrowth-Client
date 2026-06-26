"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function CreatorStatCard({
  label,
  value,
  hint,
  icon: Icon,
  index = 0,
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
        "group rounded-2xl border border-outline-variant/15 bg-white p-5 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.1)] transition-shadow hover:shadow-[0_12px_40px_-8px_rgba(21,82,30,0.14)]",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        {Icon && (
          <motion.div
            whileHover={{ rotate: 8, scale: 1.1 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/12 text-primary-container transition-colors group-hover:bg-primary-container/18"
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </motion.div>
        )}
      </div>
      <motion.p
        key={String(value)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-[30px] font-bold tracking-tight text-primary"
      >
        {value}
      </motion.p>
      {hint && (
        <p className="mt-1.5 text-[13px] text-on-surface-variant">{hint}</p>
      )}
    </motion.div>
  );
}
