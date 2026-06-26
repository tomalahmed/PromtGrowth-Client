"use client";

import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatPromptDate } from "@/lib/promptUtils";

export default function AdminPaymentsTable({ payments = [] }) {
  if (payments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/30 bg-white px-8 py-16 text-center"
      >
        <CreditCard className="mb-3 h-10 w-10 text-primary-container/50" strokeWidth={1.5} />
        <p className="text-[15px] font-semibold text-primary">No payments recorded yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-white shadow-[0_8px_32px_-8px_rgba(21,82,30,0.1)]"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[14px]">
          <thead className="border-b border-outline-variant/15 bg-[#f4f9ee] text-[11px] uppercase tracking-wider text-primary">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Session ID</th>
              <th className="px-5 py-3.5 font-semibold">Email</th>
              <th className="px-5 py-3.5 font-semibold">Amount</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <motion.tr
                key={payment._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="border-b border-outline-variant/10 transition-colors last:border-0 hover:bg-surface-container-low/40"
              >
                <td className="px-5 py-4 font-mono text-[12px] text-on-surface-variant">
                  {payment.stripeSessionId?.slice(0, 24)}…
                </td>
                <td className="px-5 py-4 text-on-surface">{payment.email}</td>
                <td className="px-5 py-4 font-semibold text-primary">
                  ${(payment.amount / 100).toFixed(2)}
                </td>
                <td className="px-5 py-4">
                  <Badge variant={payment.status === "paid" ? "primary" : "muted"}>
                    {payment.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-on-surface-variant">
                  {formatPromptDate(payment.paidAt || payment.createdAt)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
