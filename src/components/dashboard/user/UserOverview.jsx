"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bookmark,
  Compass,
  Crown,
  MessageSquare,
  Settings,
  Star,
} from "lucide-react";
import RoleGuard from "@/components/shared/RoleGuard";
import UserFormCard, { UserPageHeader } from "@/components/dashboard/user/UserPageHeader";
import UserStatCard from "@/components/dashboard/user/UserStatCard";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useUserProfile } from "@/hooks/useUser";
import { useMyBookmarks } from "@/hooks/useAdmin";
import PromptCard from "@/components/prompts/PromptCard";

const QUICK_LINKS = [
  { href: "/user/bookmarks", label: "Saved Prompts", description: "Your bookmarked library", icon: Bookmark },
  { href: "/user/reviews", label: "My Reviews", description: "Feedback you've shared", icon: MessageSquare },
  { href: "/user/settings", label: "Account Settings", description: "Profile & subscription", icon: Settings },
  { href: "/prompts", label: "Marketplace", description: "Discover new prompts", icon: Compass },
];

export default function UserOverview() {
  const { data, isLoading } = useUserProfile();
  const { data: bookmarksData, isLoading: bookmarksLoading } = useMyBookmarks(1, 3);
  const profile = data?.data;
  const stats = profile?.stats;
  const recentBookmarks = bookmarksData?.data || [];

  return (
    <RoleGuard allowedRoles={["user", "creator", "admin"]}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <UserPageHeader
          className="mb-0"
          title="My Dashboard"
          subtitle={`Welcome back${profile?.name ? `, ${profile.name.split(" ")[0]}` : ""} — manage your saved prompts and reviews.`}
        />
        {!profile?.isPremium && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link href="/pricing">
              <Button className="gap-2">
                <Crown className="h-4 w-4" />
                Upgrade to Premium
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner label="Loading profile..." />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <UserStatCard
              index={0}
              label="Saved Prompts"
              value={stats?.bookmarkCount ?? 0}
              icon={Bookmark}
              hint="Bookmarked from marketplace"
            />
            <UserStatCard
              index={1}
              label="My Reviews"
              value={stats?.reviewCount ?? 0}
              icon={MessageSquare}
              hint="Community feedback"
            />
            <UserStatCard
              index={2}
              label="Prompts Created"
              value={stats?.totalPrompts ?? 0}
              icon={Star}
              hint={profile?.role === "creator" ? "As a creator" : "Submissions"}
            />
            <UserStatCard
              index={3}
              label="Subscription"
              value={stats?.subscription ?? "Free"}
              icon={Crown}
              hint={profile?.isPremium ? "Lifetime access" : "Unlock private prompts"}
            />
          </div>

          {!profile?.isPremium && (
            <UserFormCard title="Unlock Premium" icon={Crown}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] text-on-surface-variant">
                    Get access to private prompts, premium-only content, and more.
                  </p>
                  <Badge variant="muted" className="mt-2">
                    Free plan
                  </Badge>
                </div>
                <Link href="/pricing">
                  <Button>View Plans</Button>
                </Link>
              </div>
            </UserFormCard>
          )}

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
              <h2 className="text-[18px] font-semibold text-primary">Recently Saved</h2>
              <Link
                href="/user/bookmarks"
                className="text-[13px] font-semibold text-primary-container hover:text-primary"
              >
                View all
              </Link>
            </div>
            {bookmarksLoading ? (
              <div className="flex justify-center py-12">
                <Spinner label="Loading bookmarks..." />
              </div>
            ) : recentBookmarks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-outline-variant/30 bg-white px-8 py-12 text-center">
                <Bookmark className="mx-auto mb-3 h-8 w-8 text-primary-container/50" />
                <p className="text-[14px] text-on-surface-variant">No saved prompts yet.</p>
                <Link href="/prompts" className="mt-4 inline-block">
                  <Button size="sm">Browse Marketplace</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {recentBookmarks.map((prompt, index) => (
                  <motion.div
                    key={prompt._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link href={`/prompts/${prompt._id}`}>
                      <PromptCard prompt={prompt} />
                    </Link>
                  </motion.div>
                ))}
              </div>
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
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -3 }}
    >
      <Link
        href={link.href}
        className="group flex h-full flex-col rounded-2xl border border-outline-variant/15 bg-white p-4 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.08)] transition-all hover:border-primary-container/20 hover:shadow-[0_12px_40px_-8px_rgba(21,82,30,0.12)]"
      >
        <motion.span
          whileHover={{ rotate: 6, scale: 1.08 }}
          className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/12 text-primary-container"
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </motion.span>
        <span className="text-[14px] font-semibold text-primary">{link.label}</span>
        <span className="mt-1 text-[13px] text-on-surface-variant">{link.description}</span>
      </Link>
    </motion.div>
  );
}
