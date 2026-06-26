"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function CreatorFormCard({ title, icon: Icon, children, className }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl border border-outline-variant/15 bg-white p-6 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.1)] md:p-7",
        className
      )}
    >
      <div className="mb-6 flex items-center gap-3">
        {Icon && (
          <motion.div
            whileHover={{ scale: 1.08, rotate: 4 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/12 text-primary-container"
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </motion.div>
        )}
        <h2 className="text-[18px] font-semibold text-primary">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

export function CreatorPageHeader({ title, subtitle, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("mb-8", className)}
    >
      <h1 className="text-[32px] font-bold tracking-tight text-primary md:text-[36px]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-on-surface-variant">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function FieldLabel({ children, required }) {
  return (
    <label className="mb-2 block text-[13px] font-semibold text-on-surface">
      {children}
      {required && <span className="ml-0.5 text-primary-container">*</span>}
    </label>
  );
}

export function TextField({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-outline-variant/25 bg-surface-container-lowest/50 px-4 py-3 text-[15px] text-on-surface outline-none transition-all placeholder:text-outline-variant focus:border-primary-container focus:bg-white focus:ring-2 focus:ring-primary-container/15",
        className
      )}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-outline-variant/25 bg-surface-container-lowest/50 px-4 py-3 text-[15px] text-on-surface outline-none transition-all placeholder:text-outline-variant focus:border-primary-container focus:bg-white focus:ring-2 focus:ring-primary-container/15",
        className
      )}
      {...props}
    />
  );
}
