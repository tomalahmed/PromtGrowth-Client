"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  FileText,
  ImageIcon,
  XCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPromptDate, getInitials } from "@/lib/promptUtils";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-cyan-50 text-cyan-800 border-cyan-200",
    icon: Clock3,
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-800 border-red-200",
    icon: XCircle,
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold capitalize ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {config.label}
    </span>
  );
}

export default function AdminPromptTable({
  prompts = [],
  onView,
  onApprove,
  onReject,
  onFeature,
  actionPending = false,
}) {
  if (prompts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/30 bg-white px-8 py-16 text-center"
      >
        <FileText className="mb-3 h-10 w-10 text-primary-container/50" strokeWidth={1.5} />
        <p className="text-[15px] font-semibold text-primary">No prompts found</p>
        <p className="mt-1 text-[13px] text-on-surface-variant">Try adjusting your search or filters.</p>
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
              <th className="px-5 py-3.5 font-semibold">Prompt Title</th>
              <th className="px-5 py-3.5 font-semibold">Creator</th>
              <th className="px-5 py-3.5 font-semibold">Category</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Submitted</th>
              <th className="px-5 py-3.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt, index) => (
              <motion.tr
                key={prompt._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="border-b border-outline-variant/10 transition-colors last:border-0 hover:bg-surface-container-low/40"
              >
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container-low">
                      {prompt.thumbnail ? (
                        <img
                          src={prompt.thumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-primary-container/50" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-on-surface">{prompt.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-[12px] text-on-surface-variant">
                        {prompt.description}
                      </p>
                      {prompt.status === "rejected" && prompt.rejectionFeedback && (
                        <p className="mt-1 text-[12px] font-medium text-red-600">
                          Violation: {prompt.rejectionFeedback}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/15 text-[11px] font-bold text-primary-container">
                      {getInitials(prompt.creator?.name)}
                    </div>
                    <span className="text-on-surface">{prompt.creator?.name || "—"}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-primary-container/12 px-2.5 py-1 text-[12px] font-semibold text-primary-container">
                    {prompt.category}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={prompt.status} />
                </td>
                <td className="px-5 py-4 text-on-surface-variant">
                  {formatPromptDate(prompt.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {onView && (
                      <Button size="sm" variant="outline" onClick={() => onView(prompt)}>
                        View
                      </Button>
                    )}
                    {onApprove && prompt.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => onApprove(prompt)}
                        disabled={actionPending}
                      >
                        Approve
                      </Button>
                    )}
                    {onReject && prompt.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReject(prompt)}
                        disabled={actionPending}
                      >
                        Reject
                      </Button>
                    )}
                    {onFeature && prompt.status === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onFeature(prompt)}
                        disabled={actionPending}
                      >
                        {prompt.featured ? "Unfeature" : "Feature"}
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/15 bg-surface-container-low/30 px-5 py-3 text-[13px] text-on-surface-variant">
        <span>Showing {prompts.length} entries</span>
      </div>
    </motion.div>
  );
}
