"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RoleGuard from "@/components/shared/RoleGuard";
import StatCard from "@/components/dashboard/StatCard";
import Spinner from "@/components/ui/Spinner";
import { useAdminAnalytics } from "@/hooks/useUser";
import { Copy, DollarSign, FileText, Flag, MessageSquare, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminAnalytics();
  const analytics = data?.data;

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-[28px] font-bold text-primary">Admin Overview</h1>
          <p className="mt-1 text-on-surface-variant">
            Platform totals, moderation queue, and revenue snapshot.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner label="Loading admin analytics..." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard label="Users" value={analytics?.totals?.users ?? 0} icon={Users} />
              <StatCard label="Prompts" value={analytics?.totals?.prompts ?? 0} icon={FileText} />
              <StatCard label="Reviews" value={analytics?.totals?.reviews ?? 0} icon={MessageSquare} />
              <StatCard label="Total Copies" value={analytics?.totals?.copies ?? 0} icon={Copy} />
              <StatCard
                label="Revenue"
                value={`$${((analytics?.totals?.revenue ?? 0) / 100).toFixed(2)}`}
                icon={DollarSign}
              />
              <StatCard
                label="Pending Reports"
                value={analytics?.totals?.pendingReports ?? 0}
                icon={Flag}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ChartCard title="Prompts by Status">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics?.promptsByStatus || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1c5253" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Users by Role">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics?.usersByRole || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="role" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
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
