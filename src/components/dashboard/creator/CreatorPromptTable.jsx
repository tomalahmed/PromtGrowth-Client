"use client";

import { motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCopyCount } from "@/lib/promptConstants";
import { formatPromptDate } from "@/lib/promptUtils";

const STATUS_VARIANT = {
  pending: "muted",
  approved: "primary",
  rejected: "default",
};

export default function CreatorPromptTable({
  prompts = [],
  onView,
  onEdit,
  onDelete,
  actionPending = false,
  compact = false,
}) {
  if (prompts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/30 bg-white px-8 py-16 text-center shadow-[0_8px_32px_-8px_rgba(21,82,30,0.08)]"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container/12 text-primary-container"
        >
          <FileText className="h-7 w-7" strokeWidth={1.5} />
        </motion.div>
        <h3 className="text-[18px] font-semibold text-primary">No prompts yet</h3>
        <p className="mt-2 max-w-sm text-[14px] text-on-surface-variant">
          Share your first AI prompt with the marketplace and start building your audience.
        </p>
        <Link href="/creator/add-prompt" className="mt-6">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Post New Prompt
          </Button>
        </Link>
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
          <thead className="border-b border-outline-variant/15 bg-surface-container-low/60 text-[11px] uppercase tracking-wider text-on-surface-variant">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Title</th>
              <th className="px-5 py-3.5 font-semibold">Category</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Copies</th>
              <th className="px-5 py-3.5 font-semibold">Updated</th>
              {!compact && <th className="px-5 py-3.5 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt, index) => (
              <motion.tr
                key={prompt._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className="border-b border-outline-variant/10 transition-colors last:border-0 hover:bg-surface-container-low/40"
              >
                <td className="px-5 py-4 font-medium text-on-surface">
                  {compact && onView ? (
                    <button
                      type="button"
                      onClick={() => onView(prompt)}
                      className="text-left font-medium text-primary hover:underline"
                    >
                      {prompt.title}
                    </button>
                  ) : (
                    prompt.title
                  )}
                </td>
                <td className="px-5 py-4 text-on-surface-variant">{prompt.category}</td>
                <td className="px-5 py-4">
                  <Badge variant={STATUS_VARIANT[prompt.status] || "muted"}>
                    {prompt.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-on-surface-variant">
                  {formatCopyCount(prompt.copyCount)}
                </td>
                <td className="px-5 py-4 text-on-surface-variant">
                  {formatPromptDate(prompt.updatedAt || prompt.createdAt)}
                </td>
                {!compact && (
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {onView && (
                        <Button size="sm" variant="outline" onClick={() => onView(prompt)}>
                          View
                        </Button>
                      )}
                      {onEdit && (
                        <Button size="sm" onClick={() => onEdit(prompt)}>
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(prompt)}
                          disabled={actionPending}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
