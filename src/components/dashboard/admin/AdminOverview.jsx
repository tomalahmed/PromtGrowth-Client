"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  FileText,
  Flag,
  Users,
} from "lucide-react";
import RoleGuard from "@/components/shared/RoleGuard";
import { AdminPageHeader } from "@/components/dashboard/admin/AdminPageHeader";
import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import Spinner from "@/components/ui/Spinner";
import { useAdminAnalytics } from "@/hooks/useUser";

const QUICK_LINKS = [
  { href: "/admin/prompts", label: "Moderation Queue", icon: FileText },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/reports", label: "Reported Prompts", icon: Flag },
  { href: "/admin/analytics", label: "Platform Analytics", icon: BarChart3 },
];

function countByStatus(items, status) {
  return items?.find((item) => item.status === status)?.count ?? 0;
}

export default function AdminOverview() {
  const router = useRouter();
  const { data, isLoading } = useAdminAnalytics();
  const analytics = data?.data;
  const statusCounts = analytics?.promptsByStatus || [];
  const totalPrompts = analytics?.totals?.prompts ?? 0;

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminPageHeader
        title="Admin Dashboard"
        subtitle="Platform totals, moderation queue, and revenue snapshot."
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner label="Loading admin analytics..." />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              index={0}
              label="Total Prompts"
              value={totalPrompts}
              icon={FileText}
            />
            <AdminStatCard
              index={1}
              label="Pending"
              value={countByStatus(statusCounts, "pending")}
              icon={FileText}
              accent="pending"
            />
            <AdminStatCard
              index={2}
              label="Approved"
              value={countByStatus(statusCounts, "approved")}
              icon={FileText}
              accent="approved"
            />
            <AdminStatCard
              index={3}
              label="Rejected"
              value={countByStatus(statusCounts, "rejected")}
              icon={FileText}
              accent="rejected"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <AdminStatCard
              index={0}
              label="Users"
              value={analytics?.totals?.users ?? 0}
              icon={Users}
            />
            <AdminStatCard
              index={1}
              label="Pending Reports"
              value={analytics?.totals?.pendingReports ?? 0}
              icon={Flag}
              accent="rejected"
            />
            <AdminStatCard
              index={2}
              label="Revenue"
              value={`$${((analytics?.totals?.revenue ?? 0) / 100).toFixed(2)}`}
              icon={CreditCard}
              accent="revenue"
            />
          </div>

          <section>
            <h2 className="mb-4 text-[18px] font-semibold text-primary">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {QUICK_LINKS.map((link, index) => (
                <QuickLink key={link.href} link={link} index={index} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/15 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-semibold text-primary">Moderation Queue</h2>
                <p className="text-[13px] text-on-surface-variant">
                  {countByStatus(statusCounts, "pending")} prompts awaiting review
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/admin/prompts")}
                className="rounded-xl bg-primary-container px-4 py-2.5 text-[13px] font-semibold text-on-primary hover:bg-primary"
              >
                Open Queue
              </button>
            </div>
          </section>
        </div>
      )}
    </RoleGuard>
  );
}

function QuickLink({ link, index }) {
  const Icon = link.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -3 }}
    >
      <Link
        href={link.href}
        className="group flex h-full items-center gap-3 rounded-2xl border border-outline-variant/15 bg-white p-4 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.08)] transition-all hover:border-primary-container/20 hover:shadow-[0_12px_40px_-8px_rgba(21,82,30,0.12)]"
      >
        <motion.span
          whileHover={{ rotate: 6, scale: 1.08 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/12 text-primary-container"
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </motion.span>
        <span className="text-[14px] font-semibold text-primary">{link.label}</span>
      </Link>
    </motion.div>
  );
}
