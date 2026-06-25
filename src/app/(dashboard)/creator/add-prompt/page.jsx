"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RoleGuard from "@/components/shared/RoleGuard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useCreatePrompt } from "@/hooks/useDashboard";
import {
  AI_TOOLS,
  DIFFICULTY_LEVELS,
  PROMPT_CATEGORIES,
} from "@/lib/promptConstants";
import { getApiErrorMessage } from "@/lib/apiErrors";
import { uploadImageToImgBB } from "@/lib/imgbb";

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private (Premium)" },
];

export default function AddPromptPage() {
  const router = useRouter();
  const createPrompt = useCreatePrompt();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: PROMPT_CATEGORIES[0],
    aiTool: AI_TOOLS[0],
    difficulty: DIFFICULTY_LEVELS[0],
    visibility: "public",
    tags: "",
    thumbnail: "",
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      updateField("thumbnail", url);
      toast.success("Thumbnail uploaded");
    } catch (error) {
      toast.error(error.message || "Failed to upload thumbnail");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPrompt.mutateAsync({
        ...form,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      toast.success("Prompt submitted for admin approval");
      router.push("/creator/my-prompts");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create prompt"));
    }
  };

  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-primary">Add Prompt</h1>
          <p className="mt-1 text-on-surface-variant">
            Submit a new prompt for marketplace review.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-outline-variant/15 bg-white p-6 shadow-sm"
        >
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />
          <div>
            <label className="mb-2 block text-[14px] font-medium text-on-surface-variant">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full rounded-xl border border-outline-variant/25 bg-white px-4 py-3 text-[15px] outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/15"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-on-surface-variant">
              Prompt Content
            </label>
            <textarea
              rows={8}
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              className="w-full rounded-xl border border-outline-variant/25 bg-white px-4 py-3 font-mono text-[14px] outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/15"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              options={PROMPT_CATEGORIES.map((value) => ({ value, label: value }))}
              placeholder=""
            />
            <Select
              label="AI Tool"
              value={form.aiTool}
              onChange={(e) => updateField("aiTool", e.target.value)}
              options={AI_TOOLS.map((value) => ({ value, label: value }))}
              placeholder=""
            />
            <Select
              label="Difficulty"
              value={form.difficulty}
              onChange={(e) => updateField("difficulty", e.target.value)}
              options={DIFFICULTY_LEVELS.map((value) => ({ value, label: value }))}
              placeholder=""
            />
            <Select
              label="Visibility"
              value={form.visibility}
              onChange={(e) => updateField("visibility", e.target.value)}
              options={VISIBILITY_OPTIONS}
              placeholder=""
            />
          </div>

          <Input
            label="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
            placeholder="seo, marketing, copywriting"
          />

          <div>
            <label className="mb-2 block text-[14px] font-medium text-on-surface-variant">
              Thumbnail
            </label>
            <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
            {uploading && <p className="mt-2 text-[13px] text-on-surface-variant">Uploading...</p>}
            {form.thumbnail && (
              <img
                src={form.thumbnail}
                alt="Thumbnail preview"
                className="mt-3 h-28 w-28 rounded-xl object-cover"
              />
            )}
          </div>

          <Button type="submit" disabled={createPrompt.isPending || uploading}>
            {createPrompt.isPending ? "Submitting..." : "Submit Prompt"}
          </Button>
        </form>
      </div>
    </RoleGuard>
  );
}
