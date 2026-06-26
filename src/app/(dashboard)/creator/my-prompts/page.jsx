"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, Plus } from "lucide-react";
import { toast } from "react-toastify";
import RoleGuard from "@/components/shared/RoleGuard";
import { CreatorPageHeader } from "@/components/dashboard/creator/CreatorFormCard";
import CreatorPromptTable from "@/components/dashboard/creator/CreatorPromptTable";
import Spinner from "@/components/ui/Spinner";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
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
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <CreatorPageHeader
          className="mb-0"
          title="My Prompts"
          subtitle="Manage prompts you have submitted to the marketplace."
        />
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link href="/creator/add-prompt">
            <Button className="gap-2">
              <Plus className="h-4 w-4" strokeWidth={2} />
              Post New Prompt
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 max-w-xs"
      >
        <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-on-surface">
          <Filter className="h-4 w-4 text-primary-container" strokeWidth={1.75} />
          Filter by status
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={STATUS_OPTIONS}
          placeholder=""
        />
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading prompts..." />
        </div>
      ) : (
        <CreatorPromptTable
          prompts={prompts}
          onView={(prompt) => router.push(`/prompts/${prompt._id}`)}
          onEdit={(prompt) => router.push(`/creator/edit-prompt/${prompt._id}`)}
          onDelete={handleDelete}
          actionPending={deletePrompt.isPending}
        />
      )}
    </RoleGuard>
  );
}
