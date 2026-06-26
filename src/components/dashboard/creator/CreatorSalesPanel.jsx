"use client";

import { motion } from "framer-motion";
import { DollarSign, ShoppingBag } from "lucide-react";
import CreatorChartCard from "@/components/dashboard/creator/CreatorChartCard";
import CreatorStatCard from "@/components/dashboard/creator/CreatorStatCard";
import Spinner from "@/components/ui/Spinner";
import { useCreatorAnalytics } from "@/hooks/useUser";
import { avgCopiesPerPrompt } from "@/lib/creatorAnalyticsUtils";
import { formatCopyCount } from "@/lib/promptConstants";
import { CreatorPageHeader } from "@/components/dashboard/creator/CreatorFormCard";

export default function CreatorSalesPanel() {
  const { data, isLoading } = useCreatorAnalytics();
  const analytics = data?.data;

  return (
    <>
      <CreatorPageHeader
        title="Sales"
        subtitle="Track revenue and engagement from your prompt listings."
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner label="Loading sales data..." />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CreatorStatCard
              index={0}
              label="Gross Revenue"
              value="$0.00"
              icon={DollarSign}
              hint="Paid listings coming soon"
            />
            <CreatorStatCard
              index={1}
              label="Total Copies"
              value={formatCopyCount(analytics?.totalCopies ?? 0)}
              icon={ShoppingBag}
              hint="Free prompt downloads"
            />
            <CreatorStatCard
              index={2}
              label="Avg. per Prompt"
              value={avgCopiesPerPrompt(analytics)}
              icon={ShoppingBag}
              hint="Engagement per listing"
            />
          </div>

          <CreatorChartCard
            title="Sales Overview"
            subtitle="Revenue tracking launches with paid prompts — here's your engagement snapshot."
            icon={DollarSign}
            index={0}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SalesMetric label="Gross Revenue" value="$0.00" />
              <SalesMetric
                label="Total Copies"
                value={formatCopyCount(analytics?.totalCopies ?? 0)}
              />
              <SalesMetric label="Avg. per Prompt" value={avgCopiesPerPrompt(analytics)} />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 rounded-xl bg-surface-container-low/60 px-4 py-3 text-[13px] text-on-surface-variant"
            >
              Paid listings are coming soon. Set prompts to free today and build your audience
              before monetization goes live.
            </motion.p>
          </CreatorChartCard>
        </div>
      )}
    </>
  );
}

function SalesMetric({ label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl border border-outline-variant/15 bg-surface-container-low/50 px-4 py-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 text-[22px] font-bold text-primary">{value}</p>
    </motion.div>
  );
}
