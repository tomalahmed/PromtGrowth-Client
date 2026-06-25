"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import FadeUp, { StaggerContainer, StaggerItem } from "@/components/shared/FadeUp";
import Spinner from "@/components/ui/Spinner";
import { useTopCreators } from "@/hooks/useDashboard";
import { formatCopyCount } from "@/lib/promptConstants";
import { getInitials } from "@/lib/promptUtils";

const COLORS = [
  "bg-emerald-600",
  "bg-teal-600",
  "bg-cyan-700",
  "bg-primary-container",
  "bg-secondary",
  "bg-emerald-700",
];

export default function TopCreatorsSection() {
  const { data, isLoading, isError } = useTopCreators(6);
  const creators = data?.data || [];

  return (
    <section id="top-creators" className="py-16">
      <FadeUp className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
            <Award className="h-3.5 w-3.5" strokeWidth={2} />
            Leaderboard
          </span>
          <h2 className="mb-2 text-[28px] font-bold text-primary md:text-[32px]">
            Top Creators
          </h2>
          <p className="text-[16px] text-on-surface-variant">
            The minds behind the marketplace&apos;s best performing assets.
          </p>
        </div>
      </FadeUp>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Loading top creators..." />
        </div>
      ) : isError || creators.length === 0 ? (
        <p className="text-center text-on-surface-variant">
          Creator rankings will appear once approved prompts gain traction.
        </p>
      ) : (
        <StaggerContainer
          className="hide-scrollbar flex snap-x gap-6 overflow-x-auto pb-4"
          stagger={0.08}
        >
          {creators.map((creator, index) => (
            <StaggerItem
              key={creator._id}
              className="flex min-w-[140px] snap-center flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.06, y: -4 }}
                className="relative flex flex-col items-center"
              >
                {index === 0 && (
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm"
                  >
                    <Award className="h-3.5 w-3.5" strokeWidth={2} />
                  </motion.span>
                )}
                {creator.photoURL ? (
                  <img
                    src={creator.photoURL}
                    alt={creator.name}
                    className="mb-4 h-24 w-24 rounded-full border-4 border-surface-container-highest object-cover shadow-md"
                  />
                ) : (
                  <div
                    className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface-container-highest text-[22px] font-bold text-white shadow-md ${COLORS[index % COLORS.length]}`}
                  >
                    {getInitials(creator.name)}
                  </div>
                )}
                <h4 className="text-center text-[14px] font-bold text-on-surface">
                  {creator.name}
                </h4>
                <p className="text-[12px] font-semibold text-primary-container">
                  {creator.promptCount} Prompts
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {formatCopyCount(creator.totalCopies)} copies
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  );
}
