"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Rocket, Shield } from "lucide-react";
import { CreatorPageHeader } from "@/components/dashboard/creator/CreatorFormCard";
import CreatorFormCard from "@/components/dashboard/creator/CreatorFormCard";
import Button from "@/components/ui/Button";

const FAQ_ITEMS = [
  {
    q: "How do I publish a prompt?",
    a: "Go to Post New Prompt, fill in the details, and submit. An admin will review and approve it for the marketplace.",
  },
  {
    q: "When will paid listings be available?",
    a: "Paid prompts are coming soon. For now, all listings are free — focus on building copies and bookmarks.",
  },
  {
    q: "Can I edit a prompt after approval?",
    a: "Yes. Open My Prompts, click Edit on any listing you own, and save your changes.",
  },
  {
    q: "What is a private prompt?",
    a: "Private prompts are visible only to Premium users. You need a Premium subscription to create them.",
  },
];

export default function CreatorHelpPanel() {
  return (
    <>
      <CreatorPageHeader
        title="Help Center"
        subtitle="Quick answers for creators using PromptGrowth."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CreatorFormCard title="Getting Started" icon={Rocket}>
          <p className="mb-4 text-[14px] leading-relaxed text-on-surface-variant">
            New to the Creator Hub? Try the interactive demo sandbox to explore the full
            marketplace flow without affecting real data.
          </p>
          <Link href="/demo">
            <Button>Open Demo Sandbox</Button>
          </Link>
        </CreatorFormCard>

        <CreatorFormCard title="Support" icon={MessageCircle}>
          <p className="mb-4 text-[14px] leading-relaxed text-on-surface-variant">
            For assignment demos, use the seeded accounts on the demo page. Report issues
            through your course channel.
          </p>
          <Link href="/prompts">
            <Button variant="outline">Browse Marketplace</Button>
          </Link>
        </CreatorFormCard>
      </div>

      <CreatorFormCard title="Frequently Asked" icon={HelpCircle} className="mt-6">
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
                  <Shield className="h-4 w-4 shrink-0 text-primary-container/60 transition-transform group-open:rotate-12" />
                </span>
              </summary>
              <p className="mt-3 text-[13px] leading-relaxed text-on-surface-variant">{item.a}</p>
            </motion.details>
          ))}
        </div>
      </CreatorFormCard>
    </>
  );
}
