"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Copy, TrendingUp } from "lucide-react";
import { CreatorPageHeader } from "@/components/dashboard/creator/CreatorFormCard";
import CreatorChartCard from "@/components/dashboard/creator/CreatorChartCard";
import CreatorStatCard from "@/components/dashboard/creator/CreatorStatCard";
import Spinner from "@/components/ui/Spinner";
import { useCreatorAnalytics } from "@/hooks/useUser";
import { CHART_TOOLTIP_STYLE } from "@/lib/creatorAnalyticsUtils";
import { formatCopyCount } from "@/lib/promptConstants";

export default function CreatorAnalyticsPanel() {
  const { data, isLoading } = useCreatorAnalytics();
  const analytics = data?.data;

  return (
    <>
      <CreatorPageHeader
        title="Analytics"
        subtitle="Performance trends across your prompt portfolio."
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner label="Loading analytics..." />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CreatorStatCard
              index={0}
              label="Total Copies"
              value={formatCopyCount(analytics?.totalCopies ?? 0)}
              icon={Copy}
              hint="All-time downloads"
            />
            <CreatorStatCard
              index={1}
              label="Total Reviews"
              value={analytics?.totalReviews ?? 0}
              icon={TrendingUp}
              hint="Community feedback"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <CreatorChartCard
              title="Copies Over Time"
              subtitle="Monthly copy activity"
              icon={Copy}
              index={0}
            >
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={analytics?.copiesOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 201, 188, 0.5)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5c6659" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#5c6659" }} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Line
                    type="monotone"
                    dataKey="copies"
                    stroke="#306b34"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#306b34" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CreatorChartCard>

            <CreatorChartCard
              title="Prompt Growth"
              subtitle="New prompts per month"
              icon={TrendingUp}
              index={1}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics?.promptGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 201, 188, 0.5)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5c6659" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#5c6659" }} allowDecimals={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="count" fill="#306b34" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CreatorChartCard>
          </div>
        </div>
      )}
    </>
  );
}
