"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RoleGuard from "@/components/shared/RoleGuard";
import StatCard from "@/components/dashboard/StatCard";
import Spinner from "@/components/ui/Spinner";
import { useCreatorAnalytics } from "@/hooks/useUser";
import { Bookmark, Copy, FileText } from "lucide-react";
import { formatCopyCount } from "@/lib/promptConstants";

export default function CreatorDashboardPage() {
  const { data, isLoading } = useCreatorAnalytics();
  const analytics = data?.data;

  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-[28px] font-bold text-primary">Creator Analytics</h1>
          <p className="mt-1 text-on-surface-variant">
            Track prompt performance, copies, and growth over time.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner label="Loading analytics..." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="Total Prompts"
                value={analytics?.totalPrompts ?? 0}
                icon={FileText}
              />
              <StatCard
                label="Total Copies"
                value={formatCopyCount(analytics?.totalCopies ?? 0)}
                icon={Copy}
              />
              <StatCard
                label="Total Bookmarks"
                value={analytics?.totalBookmarks ?? 0}
                icon={Bookmark}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ChartCard title="Copies Over Time">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={analytics?.copiesOverTime || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="copies"
                      stroke="#1c5253"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Prompt Growth">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={analytics?.promptGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2d6a6b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-outline-variant/15 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-[18px] font-semibold text-on-surface">{title}</h2>
      {children}
    </section>
  );
}
