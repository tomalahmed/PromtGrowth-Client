"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Calendar, Copy, DollarSign, Download, FileText, Users } from "lucide-react";
import AdminFormCard, { AdminPageHeader } from "@/components/dashboard/admin/AdminPageHeader";
import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import Spinner from "@/components/ui/Spinner";
import { useAdminAnalytics } from "@/hooks/useUser";
import { CHART_TOOLTIP_STYLE } from "@/lib/creatorAnalyticsUtils";

export default function AdminAnalyticsPanel() {
  const { data, isLoading } = useAdminAnalytics();
  const analytics = data?.data;

  const userGrowthData =
    analytics?.usersByRole?.map((item) => ({
      label: item.role,
      users: item.count,
    })) || [];

  const copyTrendData =
    analytics?.promptsByStatus?.map((item) => ({
      label: item.status,
      count: item.count,
    })) || [];

  return (
    <>
      <AdminPageHeader
        title="Admin Analytics"
        subtitle="Platform-wide performance metrics, user engagement, and marketplace activity overview."
      >
        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant/25 bg-white px-4 py-2 text-[13px] font-medium text-on-surface"
          >
            <Calendar className="h-4 w-4 text-primary-container" />
            Last 30 Days
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/25 bg-white px-4 py-2 text-[13px] font-semibold text-primary"
          >
            <Download className="h-4 w-4" />
            Export
          </motion.button>
        </div>
      </AdminPageHeader>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner label="Loading analytics..." />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              index={0}
              label="Total Users"
              value={analytics?.totals?.users ?? 0}
              icon={Users}
              hint="Registered accounts"
            />
            <AdminStatCard
              index={1}
              label="Total Prompts"
              value={analytics?.totals?.prompts ?? 0}
              icon={FileText}
              hint="All submissions"
            />
            <AdminStatCard
              index={2}
              label="Total Copies"
              value={analytics?.totals?.copies ?? 0}
              icon={Copy}
              hint="Marketplace downloads"
            />
            <AdminStatCard
              index={3}
              label="Revenue"
              value={`$${((analytics?.totals?.revenue ?? 0) / 100).toFixed(2)}`}
              icon={DollarSign}
              hint="Premium upgrades"
              accent="revenue"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <AdminFormCard title="User Growth" icon={Users}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#306b34" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#306b34" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 201, 188, 0.5)" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5c6659" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5c6659" }} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#306b34"
                    strokeWidth={2.5}
                    fill="url(#userGrowth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </AdminFormCard>

            <AdminFormCard title="Prompt Status Trends" icon={Copy}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={copyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 201, 188, 0.5)" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5c6659" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5c6659" }} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="count" fill="#306b34" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </AdminFormCard>
          </div>
        </div>
      )}
    </>
  );
}
