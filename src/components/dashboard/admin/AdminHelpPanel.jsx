"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, Rocket, Shield } from "lucide-react";
import AdminFormCard, { AdminPageHeader } from "@/components/dashboard/admin/AdminPageHeader";
import Button from "@/components/ui/Button";

const FAQ_ITEMS = [
  {
    q: "How do I approve a prompt?",
    a: "Open All Prompts, review the submission, and click Approve. It will appear on the public marketplace.",
  },
  {
    q: "What happens when I reject a prompt?",
    a: "The creator receives your feedback. Rejected prompts stay visible in their dashboard with the violation note.",
  },
  {
    q: "How do I handle reported prompts?",
    a: "Go to Reported Prompts, review the flag reason, then dismiss, warn the creator, or remove the prompt.",
  },
];

export default function AdminHelpPanel() {
  return (
    <>
      <AdminPageHeader
        title="Help Center"
        subtitle="Quick guidance for platform administrators."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminFormCard title="Demo Sandbox" icon={Rocket}>
          <p className="mb-4 text-[14px] leading-relaxed text-on-surface-variant">
            Use the demo page to sign in as seeded accounts and test moderation flows in
            isolation.
          </p>
          <Link href="/demo">
            <Button>Open Demo Sandbox</Button>
          </Link>
        </AdminFormCard>

        <AdminFormCard title="Moderation" icon={Shield}>
          <p className="mb-4 text-[14px] leading-relaxed text-on-surface-variant">
            Start with the review queue for pending prompts, then check reported content.
          </p>
          <Link href="/admin/prompts">
            <Button variant="outline">Open Moderation Queue</Button>
          </Link>
        </AdminFormCard>
      </div>

      <AdminFormCard title="Frequently Asked" icon={HelpCircle} className="mt-6">
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
                {item.q}
              </summary>
              <p className="mt-3 text-[13px] leading-relaxed text-on-surface-variant">{item.a}</p>
            </motion.details>
          ))}
        </div>
      </AdminFormCard>
    </>
  );
}
