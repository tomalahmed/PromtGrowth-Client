"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function DifficultyPicker({ value, onChange, options }) {
  return (
    <div className="relative flex flex-wrap gap-1 rounded-xl bg-surface-container-low/80 p-1.5">
      {options.map((option) => {
        const active = value === option;

        return (
          <motion.button
            key={option}
            type="button"
            whileHover={{ scale: active ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option)}
            className={cn(
              "relative z-10 flex-1 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors",
              active
                ? "text-on-primary"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            {active && (
              <motion.span
                layoutId="difficulty-pill"
                className="absolute inset-0 rounded-lg bg-primary-container shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{option}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
