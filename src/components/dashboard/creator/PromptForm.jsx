"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Code2, FileText, Shapes, Upload } from "lucide-react";
import { toast } from "react-toastify";
import RoleGuard from "@/components/shared/RoleGuard";
import CreatorFormCard, {
  CreatorPageHeader,
  FieldLabel,
  TextArea,
  TextField,
} from "@/components/dashboard/creator/CreatorFormCard";
import DifficultyPicker from "@/components/dashboard/creator/DifficultyPicker";
import TagInput from "@/components/dashboard/creator/TagInput";
import ThumbnailUpload from "@/components/dashboard/creator/ThumbnailUpload";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { useCreatePrompt, useUpdatePrompt } from "@/hooks/useDashboard";
import { usePrompt } from "@/hooks/usePrompt";
import {
  AI_TOOLS,
  DIFFICULTY_LEVELS,
  PROMPT_CATEGORIES,
} from "@/lib/promptConstants";
import { getApiErrorMessage } from "@/lib/apiErrors";

const DRAFT_KEY = "creator-prompt-draft";

const EMPTY_FORM = {
  title: "",
  description: "",
  content: "",
  category: PROMPT_CATEGORIES[0],
  aiTool: AI_TOOLS[0],
  difficulty: DIFFICULTY_LEVELS[0],
  visibility: "public",
  thumbnail: "",
};

export default function PromptForm({ promptId = null }) {
  const isEdit = Boolean(promptId);
  const router = useRouter();
  const createPrompt = useCreatePrompt();
  const updatePrompt = useUpdatePrompt();
  const { data: promptResponse, isLoading: promptLoading } = usePrompt(promptId);
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (isEdit) return;

    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      const draft = JSON.parse(saved);
      setForm((current) => ({ ...current, ...draft.form }));
      setTags(draft.tags || []);
    } catch {
      // ignore invalid draft
    }
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit || !promptResponse?.data || hydrated) return;

    const prompt = promptResponse.data;
    setForm({
      title: prompt.title || "",
      description: prompt.description || "",
      content: prompt.content || "",
      category: prompt.category || PROMPT_CATEGORIES[0],
      aiTool: prompt.aiTool || AI_TOOLS[0],
      difficulty: prompt.difficulty || DIFFICULTY_LEVELS[0],
      visibility: prompt.visibility || "public",
      thumbnail: prompt.thumbnail || "",
    });
    setTags(prompt.tags || []);
    setHydrated(true);
  }, [isEdit, promptResponse, hydrated]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveDraft = () => {
    if (isEdit) return;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form, tags }));
    toast.success("Draft saved locally");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags };

    try {
      if (isEdit) {
        await updatePrompt.mutateAsync({ promptId, payload });
        toast.success("Prompt updated");
        router.push("/creator/my-prompts");
        return;
      }

      await createPrompt.mutateAsync(payload);
      sessionStorage.removeItem(DRAFT_KEY);
      toast.success("Prompt submitted for admin approval");
      router.push("/creator/my-prompts");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, isEdit ? "Failed to update prompt" : "Failed to create prompt")
      );
    }
  };

  const isPublic = form.visibility === "public";
  const isPending = isEdit ? updatePrompt.isPending : createPrompt.isPending;

  if (isEdit && promptLoading) {
    return (
      <RoleGuard allowedRoles={["creator", "admin"]}>
        <div className="flex justify-center py-20">
          <Spinner label="Loading prompt..." />
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <CreatorPageHeader
        title={isEdit ? "Edit Prompt" : "Create New Prompt"}
        subtitle={
          isEdit
            ? "Update your listing details and publish settings."
            : "Share your AI expertise with the PromptGrowth marketplace."
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <CreatorFormCard title="Basic Information" icon={FileText}>
            <div className="space-y-5">
              <div>
                <FieldLabel required>Prompt Title</FieldLabel>
                <TextField
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g., SEO Optimized Blog Post Generator"
                  required
                />
              </div>
              <div>
                <FieldLabel required>Short Description</FieldLabel>
                <TextArea
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Brief summary for marketplace cards..."
                  required
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <FieldLabel required>The Prompt Content</FieldLabel>
                  <motion.span
                    animate={{ rotate: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-primary-container/70"
                  >
                    <Code2 className="h-5 w-5" strokeWidth={1.75} />
                  </motion.span>
                </div>
                <TextArea
                  rows={10}
                  value={form.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  className="font-mono text-[14px]"
                  placeholder="Write the full prompt template here..."
                  required
                />
              </div>
            </div>
          </CreatorFormCard>

          <CreatorFormCard title="Categorization" icon={Shapes}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Select
                label="Category"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                options={PROMPT_CATEGORIES.map((value) => ({ value, label: value }))}
                placeholder=""
              />
              <Select
                label="Target AI Tool"
                value={form.aiTool}
                onChange={(e) => updateField("aiTool", e.target.value)}
                options={AI_TOOLS.map((value) => ({ value, label: value }))}
                placeholder=""
              />
            </div>
            <div className="mt-5">
              <FieldLabel>Difficulty Level</FieldLabel>
              <DifficultyPicker
                value={form.difficulty}
                onChange={(value) => updateField("difficulty", value)}
                options={DIFFICULTY_LEVELS}
              />
            </div>
            <div className="mt-5">
              <TagInput tags={tags} onChange={setTags} />
            </div>
          </CreatorFormCard>
        </div>

        <div className="space-y-6">
          <CreatorFormCard title="Publish Settings" icon={Upload} className="xl:sticky xl:top-28">
            <div className="space-y-5">
              <ThumbnailUpload
                value={form.thumbnail}
                onChange={(url) => updateField("thumbnail", url)}
              />

              <div className="flex items-center justify-between gap-4 rounded-xl border border-outline-variant/15 bg-surface-container-low/50 px-4 py-3">
                <div>
                  <p className="text-[14px] font-semibold text-on-surface">Public Marketplace</p>
                  <p className="text-[12px] text-on-surface-variant">
                    {isPublic ? "Visible to everyone when approved" : "Premium-only private prompt"}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPublic}
                  onClick={() => updateField("visibility", isPublic ? "private" : "public")}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    isPublic ? "bg-primary-container" : "bg-outline-variant/50"
                  }`}
                >
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm ${
                      isPublic ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div>
                <FieldLabel>Price (USD)</FieldLabel>
                <TextField value="$ 0.00" disabled className="opacity-70" />
                <p className="mt-1.5 text-[12px] text-on-surface-variant">
                  Set to 0 for free prompts. Paid listings coming soon.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending
                      ? isEdit
                        ? "Saving..."
                        : "Publishing..."
                      : isEdit
                        ? "Save Changes"
                        : "Publish Prompt"}
                  </Button>
                </motion.div>
                {!isEdit && (
                  <Button type="button" variant="outline" className="w-full" onClick={saveDraft}>
                    Save Draft
                  </Button>
                )}
                {isEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/creator/my-prompts")}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CreatorFormCard>
        </div>
      </form>
    </RoleGuard>
  );
}
