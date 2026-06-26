"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { toast } from "react-toastify";
import { AdminPageHeader } from "@/components/dashboard/admin/AdminPageHeader";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAdminReports, useUpdateReport } from "@/hooks/useAdmin";
import { formatPromptDate } from "@/lib/promptUtils";
import { getApiErrorMessage } from "@/lib/apiErrors";

export default function AdminReportsPanel() {
  const { data, isLoading } = useAdminReports(1, 50, "pending");
  const updateReport = useUpdateReport();
  const reports = data?.data || [];

  const handleAction = async (reportId, action) => {
    try {
      await updateReport.mutateAsync({ reportId, action });
      toast.success(`Report ${action === "dismiss" ? "dismissed" : "resolved"}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update report"));
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Reported Prompts"
        subtitle="Review flagged prompts and take moderation action."
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading reports..." />
        </div>
      ) : reports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/30 bg-white px-8 py-16 text-center"
        >
          <Flag className="mb-3 h-10 w-10 text-primary-container/50" />
          <p className="text-[15px] font-semibold text-primary">No pending reports</p>
          <p className="mt-1 text-[13px] text-on-surface-variant">The queue is clear.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {reports.map((report, index) => (
            <motion.article
              key={report._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-outline-variant/15 bg-white p-5 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.08)]"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[16px] font-semibold text-on-surface">
                    {report.prompt?.title || "Prompt"}
                  </h3>
                  <p className="text-[13px] text-on-surface-variant">
                    Reported by {report.user?.name || report.user?.email} ·{" "}
                    {formatPromptDate(report.createdAt)}
                  </p>
                </div>
                <Badge variant="muted">{report.reason}</Badge>
              </div>
              {report.description && (
                <p className="mb-4 text-[14px] text-on-surface-variant">{report.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(report._id, "dismiss")}
                  disabled={updateReport.isPending}
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(report._id, "warn")}
                  disabled={updateReport.isPending}
                >
                  Warn Creator
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(report._id, "remove-prompt")}
                  disabled={updateReport.isPending}
                >
                  Remove Prompt
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </>
  );
}
