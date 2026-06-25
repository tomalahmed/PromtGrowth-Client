"use client";

import { toast } from "react-toastify";
import RoleGuard from "@/components/shared/RoleGuard";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAdminReports, useUpdateReport } from "@/hooks/useAdmin";
import { formatPromptDate } from "@/lib/promptUtils";
import { getApiErrorMessage } from "@/lib/apiErrors";

export default function AdminReportsPage() {
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
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-primary">Reports</h1>
          <p className="mt-1 text-on-surface-variant">
            Review flagged prompts and take moderation action.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Loading reports..." />
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/15 bg-white p-10 text-center text-on-surface-variant">
            No pending reports.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <article
                key={report._id}
                className="rounded-2xl border border-outline-variant/15 bg-white p-5 shadow-sm"
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
              </article>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
