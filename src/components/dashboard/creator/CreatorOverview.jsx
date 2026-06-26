"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bookmark,
  Copy,
  FileText,
  Plus,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import RoleGuard from "@/components/shared/RoleGuard";
import { CreatorPageHeader } from "@/components/dashboard/creator/CreatorFormCard";
import CreatorStatCard from "@/components/dashboard/creator/CreatorStatCard";
import CreatorPromptTable from "@/components/dashboard/creator/CreatorPromptTable";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useMyPrompts } from "@/hooks/useDashboard";
import { useCreatorAnalytics } from "@/hooks/useUser";
import { formatCopyCount } from "@/lib/promptConstants";

const QUICK_LINKS = [
  {
    href: "/creator/add-prompt",
    label: "Post New Prompt",
    description: "Create and publish a listing",
    icon: Plus,
    accent: true,
  },
  {
    href: "/creator/my-prompts",
    label: "My Prompts",
    description: "Manage your submissions",
    icon: FileText,
  },
  {
    href: "/creator/sales",
    label: "Sales",
    description: "Revenue & downloads",
    icon: ShoppingBag,
  },
  {
    href: "/creator/analytics",
    label: "Analytics",
    description: "Charts and growth",
    icon: BarChart3,
  },
];

export default function CreatorOverview() {
  const router = useRouter();
  const { data: analyticsData, isLoading: analyticsLoading } = useCreatorAnalytics();
  const { data: promptsData, isLoading: promptsLoading } = useMyPrompts(1, 5);
  const analytics = analyticsData?.data;
  const recentPrompts = promptsData?.data || [];

  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <CreatorPageHeader
          className="mb-0"
          title="Creator Dashboard"
          subtitle="Welcome back — here's how your prompts are performing."
        />
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link href="/creator/add-prompt">
            <Button className="gap-2">
              <Plus className="h-4 w-4" strokeWidth={2} />
              Post New Prompt
            </Button>
          </Link>
        </motion.div>
      </div>

      {analyticsLoading ? (
        <div className="flex justify-center py-20">
          <Spinner label="Loading dashboard..." />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CreatorStatCard
              index={0}
              label="Total Prompts"
              value={analytics?.totalPrompts ?? 0}
              icon={FileText}
              hint="Published & pending"
            />
            <CreatorStatCard
              index={1}
              label="Total Copies"
              value={formatCopyCount(analytics?.totalCopies ?? 0)}
              icon={Copy}
              hint="Marketplace downloads"
            />
            <CreatorStatCard
              index={2}
              label="Total Bookmarks"
              value={analytics?.totalBookmarks ?? 0}
              icon={Bookmark}
              hint="Saved by users"
            />
            <CreatorStatCard
              index={3}
              label="Total Reviews"
              value={analytics?.totalReviews ?? 0}
              icon={TrendingUp}
              hint="Community feedback"
            />
          </div>

          <section>
            <h2 className="mb-4 text-[18px] font-semibold text-primary">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {QUICK_LINKS.map((link, index) => (
                <QuickLinkCard key={link.href} link={link} index={index} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-semibold text-primary">Recent Prompts</h2>
              <Link
                href="/creator/my-prompts"
                className="text-[13px] font-semibold text-primary-container hover:text-primary"
              >
                View all
              </Link>
            </div>
            {promptsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner label="Loading prompts..." />
              </div>
            ) : (
              <CreatorPromptTable
                prompts={recentPrompts}
                onView={(prompt) => router.push(`/prompts/${prompt._id}`)}
                compact
              />
            )}
          </section>
        </div>
      )}
    </RoleGuard>
  );
}

function QuickLinkCard({ link, index }) {
  const Icon = link.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -3 }}
    >
      <Link
        href={link.href}
        className={`group flex h-full flex-col rounded-2xl border p-5 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.08)] transition-all hover:shadow-[0_12px_40px_-8px_rgba(21,82,30,0.14)] ${
          link.accent
            ? "border-primary-container/25 bg-primary-container text-on-primary"
            : "border-outline-variant/15 bg-white hover:border-primary-container/20"
        }`}
      >
        <motion.span
          whileHover={{ rotate: 6, scale: 1.08 }}
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
            link.accent ? "bg-white/15" : "bg-primary-container/12 text-primary-container"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </motion.span>
        <p className={`text-[15px] font-semibold ${link.accent ? "" : "text-primary"}`}>
          {link.label}
        </p>
        <p
          className={`mt-1 text-[13px] ${
            link.accent ? "text-on-primary/80" : "text-on-surface-variant"
          }`}
        >
          {link.description}
        </p>
      </Link>
    </motion.div>
  );
}
