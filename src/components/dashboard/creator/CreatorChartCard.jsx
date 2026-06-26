"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function CreatorChartCard({
  title,
  subtitle,
  icon: Icon,
  children,
  index = 0,
  className,
  id,
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.2 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "scroll-mt-28 rounded-2xl border border-outline-variant/15 bg-white p-6 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.1)]",
        className
      )}
    >
      <div className="mb-5 flex items-start gap-3">
        {Icon && (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/12 text-primary-container"
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </motion.div>
        )}
        <div>
          <h2 className="text-[18px] font-semibold text-primary">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-[13px] text-on-surface-variant">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </motion.section>
  );
}
