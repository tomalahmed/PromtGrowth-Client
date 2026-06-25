"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RoleGuard from "@/components/shared/RoleGuard";
import PromptTable from "@/components/dashboard/PromptTable";
import Spinner from "@/components/ui/Spinner";
import Select from "@/components/ui/Select";
import { useDeletePrompt, useMyPrompts } from "@/hooks/useDashboard";
import { getApiErrorMessage } from "@/lib/apiErrors";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function CreatorMyPromptsPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const { data, isLoading } = useMyPrompts(1, 50, status);
  const deletePrompt = useDeletePrompt();
  const prompts = data?.data || [];

  const handleDelete = async (prompt) => {
    if (!window.confirm(`Delete "${prompt.title}"?`)) return;

    try {
      await deletePrompt.mutateAsync(prompt._id);
      toast.success("Prompt deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete prompt"));
    }
  };

  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-primary">My Prompts</h1>
            <p className="mt-1 text-on-surface-variant">
              Manage prompts you have submitted to the marketplace.
            </p>
          </div>
          <Link href="/creator/add-prompt">
            <button
              type="button"
              className="rounded-xl bg-primary-container px-5 py-2.5 text-[14px] font-semibold text-on-primary"
            >
              Add Prompt
            </button>
          </Link>
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
            showActions
            onView={(prompt) => router.push(`/prompts/${prompt._id}`)}
            onDelete={handleDelete}
            actionPending={deletePrompt.isPending}
          />
        )}
      </div>
    </RoleGuard>
  );
}
