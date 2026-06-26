"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Compass, Crown, HelpCircle, MessageSquare } from "lucide-react";
import UserFormCard, { UserPageHeader } from "@/components/dashboard/user/UserPageHeader";
import Button from "@/components/ui/Button";

const FAQ_ITEMS = [
  {
    q: "How do I save a prompt?",
    a: "Open any prompt on the marketplace and click the bookmark icon. Saved prompts appear under Saved Prompts in your dashboard.",
  },
  {
    q: "What does Premium unlock?",
    a: "Premium gives you access to private prompts that are locked for free users, plus full copy access on premium listings.",
  },
  {
    q: "How do I leave a review?",
    a: "Visit a prompt detail page after using it and submit your rating and comment in the reviews section.",
  },
];

export default function UserHelpPanel() {
  return (
    <>
      <UserPageHeader
        title="Help Center"
        subtitle="Quick answers for using PromptGrowth as a marketplace user."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UserFormCard title="Getting Started" icon={Compass}>
          <p className="mb-4 text-[14px] leading-relaxed text-on-surface-variant">
            Browse the marketplace, bookmark favorites, and upgrade to Premium when you need
            access to private prompts.
          </p>
          <Link href="/prompts">
            <Button>Browse Marketplace</Button>
          </Link>
        </UserFormCard>

        <UserFormCard title="Demo Sandbox" icon={Bookmark}>
          <p className="mb-4 text-[14px] leading-relaxed text-on-surface-variant">
            Try the demo page to explore premium lock behavior and marketplace flows with
            seeded accounts.
          </p>
          <Link href="/demo">
            <Button variant="outline">Open Demo</Button>
          </Link>
        </UserFormCard>
      </div>

      <UserFormCard title="Frequently Asked" icon={HelpCircle} className="mt-6">
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <motion.details
              key={item.q}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group rounded-xl border border-outline-variant/15 bg-surface-container-low/40 px-4 py-3"
            >
              <summary className="cursor-pointer list-none text-[14px] font-semibold text-primary marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <MessageSquare className="h-4 w-4 shrink-0 text-primary-container/60 transition-transform group-open:rotate-12" />
                </span>
              </summary>
              <p className="mt-3 text-[13px] leading-relaxed text-on-surface-variant">{item.a}</p>
            </motion.details>
          ))}
        </div>
      </UserFormCard>

      <div className="mt-6 rounded-2xl border border-primary-container/20 bg-primary-container/8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary-container" />
            <div>
              <p className="font-semibold text-primary">Ready for more?</p>
              <p className="text-[13px] text-on-surface-variant">
                Upgrade to unlock private prompts across the marketplace.
              </p>
            </div>
          </div>
          <Link href="/pricing">
            <Button size="sm">View Pricing</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
