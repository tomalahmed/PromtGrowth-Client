"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/dashboard/admin/AdminPageHeader";
import AdminPromptTable from "@/components/dashboard/admin/AdminPromptTable";
import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import AdminToolbar from "@/components/dashboard/admin/AdminToolbar";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useAdminPrompts, useModeratePrompt } from "@/hooks/useDashboard";
import { useAdminAnalytics } from "@/hooks/useUser";
import { getApiErrorMessage } from "@/lib/apiErrors";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function countByStatus(items, status) {
  return items?.find((item) => item.status === status)?.count ?? 0;
}

export default function AdminModerationPanel() {
  const router = useRouter();
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [feedback, setFeedback] = useState("");
  const { data: analyticsData } = useAdminAnalytics();
  const { data, isLoading } = useAdminPrompts(1, 50, status);
  const moderatePrompt = useModeratePrompt();
  const prompts = data?.data || [];
  const statusCounts = analyticsData?.data?.promptsByStatus || [];
  const totalPrompts = analyticsData?.data?.totals?.prompts ?? prompts.length;

  const filteredPrompts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return prompts;
    return prompts.filter(
      (prompt) =>
        prompt.title?.toLowerCase().includes(query) ||
        prompt.creator?.name?.toLowerCase().includes(query) ||
        prompt.category?.toLowerCase().includes(query)
    );
  }, [prompts, search]);

  const handleApprove = async (prompt) => {
    try {
      await moderatePrompt.mutateAsync({ promptId: prompt._id, action: "approve" });
      toast.success("Prompt approved");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to approve prompt"));
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !feedback.trim()) {
      toast.error("Rejection feedback is required");
      return;
    }

    try {
      await moderatePrompt.mutateAsync({
        promptId: rejectTarget._id,
        action: "reject",
        rejectionFeedback: feedback.trim(),
      });
      toast.success("Prompt rejected");
      setRejectTarget(null);
      setFeedback("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to reject prompt"));
    }
  };

  const handleFeature = async (prompt) => {
    try {
      await moderatePrompt.mutateAsync({ promptId: prompt._id, action: "feature" });
      toast.success(prompt.featured ? "Prompt unfeatured" : "Prompt featured");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update featured status"));
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Prompt Moderation"
        subtitle="Manage and review all prompt submissions across the marketplace."
      >
        <AdminToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search prompts by title or creator..."
        />
      </AdminPageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard index={0} label="Total Prompts" value={totalPrompts} icon={FileText} />
        <AdminStatCard
          index={1}
          label="Pending"
          value={countByStatus(statusCounts, "pending")}
          icon={Clock3}
          accent="pending"
        />
        <AdminStatCard
          index={2}
          label="Approved"
          value={countByStatus(statusCounts, "approved")}
          icon={CheckCircle2}
          accent="approved"
        />
        <AdminStatCard
          index={3}
          label="Rejected"
          value={countByStatus(statusCounts, "rejected")}
          icon={XCircle}
          accent="rejected"
        />
      </div>

      <div className="mb-6 max-w-xs">
        <Select
          label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={STATUS_OPTIONS}
          placeholder=""
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading prompts..." />
        </div>
      ) : (
        <AdminPromptTable
          prompts={filteredPrompts}
          onView={(prompt) => router.push(`/prompts/${prompt._id}`)}
          onApprove={handleApprove}
          onReject={(prompt) => setRejectTarget(prompt)}
          onFeature={handleFeature}
          actionPending={moderatePrompt.isPending}
        />
      )}

      <Modal
        open={Boolean(rejectTarget)}
        onClose={() => {
          setRejectTarget(null);
          setFeedback("");
        }}
        title="Reject Prompt"
      >
        <p className="mb-4 text-[14px] text-on-surface-variant">
          Provide feedback for &ldquo;{rejectTarget?.title}&rdquo;.
        </p>
        <textarea
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="mb-4 w-full rounded-xl border border-outline-variant/25 px-4 py-3 text-[14px] outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
          placeholder="Explain why this prompt was rejected..."
        />
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setRejectTarget(null)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleReject} disabled={moderatePrompt.isPending}>
            Reject Prompt
          </Button>
        </div>
      </Modal>
    </>
  );
}
