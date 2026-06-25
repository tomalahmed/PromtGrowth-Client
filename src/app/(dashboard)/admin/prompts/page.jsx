"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RoleGuard from "@/components/shared/RoleGuard";
import PromptTable from "@/components/dashboard/PromptTable";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useAdminPrompts, useModeratePrompt } from "@/hooks/useDashboard";
import { getApiErrorMessage } from "@/lib/apiErrors";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminPromptsPage() {
  const router = useRouter();
  const [status, setStatus] = useState("pending");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [feedback, setFeedback] = useState("");
  const { data, isLoading } = useAdminPrompts(1, 50, status);
  const moderatePrompt = useModeratePrompt();
  const prompts = data?.data || [];

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
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-primary">Prompt Moderation</h1>
          <p className="mt-1 text-on-surface-variant">
            Approve, reject, feature, or review submitted prompts.
          </p>
        </div>

        <div className="max-w-xs">
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
          <PromptTable
            prompts={prompts}
            showCreator
            showActions
            onView={(prompt) => router.push(`/prompts/${prompt._id}`)}
            onApprove={handleApprove}
            onReject={(prompt) => setRejectTarget(prompt)}
            onFeature={handleFeature}
            actionPending={moderatePrompt.isPending}
          />
        )}
      </div>

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
    </RoleGuard>
  );
}
