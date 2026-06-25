"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  Bot,
  Copy,
  Crown,
  Flag,
  Lock,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import FadeUp from "@/components/shared/FadeUp";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import PromptDetailSidebar from "@/components/prompts/detail/PromptDetailSidebar";
import PromptReviewsSection from "@/components/prompts/detail/PromptReviewsSection";
import ReportModal from "@/components/prompts/ReportModal";
import useAuth from "@/hooks/useAuth";
import { useBookmarkStatus, useToggleBookmark } from "@/hooks/useBookmark";
import { useIncrementCopy, usePrompt } from "@/hooks/usePrompt";
import usePrompts from "@/hooks/usePrompts";
import { formatCopyCount } from "@/lib/promptConstants";
import {
  dedupePromptsById,
  estimateTokenCount,
  extractPlaceholders,
  formatPromptDate,
  getInitials,
  isPromptContentLocked,
} from "@/lib/promptUtils";
import { setPremiumReturnTo } from "@/lib/premiumCheckout";
import { cn } from "@/lib/cn";

function StarRating({ rating, size = "md" }) {
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex gap-0.5 text-tertiary-container">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            iconClass,
            index < Math.round(rating)
              ? "fill-current"
              : "text-outline-variant/40"
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const promptId = params?.id;
  const { user } = useAuth();
  const [reportOpen, setReportOpen] = useState(false);
  const { data, isLoading, isError, error } = usePrompt(promptId);
  const { data: bookmarkData } = useBookmarkStatus(promptId, { enabled: Boolean(user) });
  const toggleBookmarkMutation = useToggleBookmark(promptId);
  const copyMutation = useIncrementCopy(promptId);

  const bookmarked = bookmarkData?.bookmarked ?? false;

  const prompt = data?.data;
  const contentLocked = prompt ? isPromptContentLocked(prompt, user) : false;
  const displayContent =
    prompt?.content || prompt?.contentPreview || "Premium prompt content locked.";

  const { data: similarData } = usePrompts(
    { category: prompt?.category, limit: 4, page: 1 },
    { enabled: Boolean(prompt?.category) }
  );

  const similarPrompts = dedupePromptsById(similarData?.data || [])
    .filter((item) => String(item._id) !== String(promptId))
    .slice(0, 2);

  const placeholders = extractPlaceholders(prompt?.content || prompt?.contentPreview || "");
  const tokenEstimate = estimateTokenCount(prompt?.content || prompt?.contentPreview);

  const handleCopy = async () => {
    if (contentLocked) {
      toast.info("Subscribe to Premium to copy this prompt");
      return;
    }

    if (!prompt?.content) return;

    try {
      await navigator.clipboard.writeText(prompt.content);
      await copyMutation.mutateAsync();
      toast.success("Prompt copied to clipboard");
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/prompts/${promptId}`)}`);
      return;
    }

    if (toggleBookmarkMutation.isPending) return;

    try {
      await toggleBookmarkMutation.mutateAsync();
    } catch {
      // Toast handled in hook
    }
  };

  const handleReport = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/prompts/${promptId}`)}`);
      return;
    }

    setReportOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading prompt details..." />
      </div>
    );
  }

  if (isError || !prompt) {
    const isNetworkError = !error?.response;
    const message = error?.response?.data?.message;

    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <h1 className="mb-3 text-[24px] font-bold text-primary">
          {isNetworkError ? "Unable to reach server" : "Prompt not found"}
        </h1>
        <p className="mb-6 text-on-surface-variant">
          {isNetworkError
            ? "Start the API server (npm run dev) and ensure MongoDB Atlas allows your IP address."
            : message || "This prompt may have been removed or you do not have access."}
        </p>
        <Link
          href="/prompts"
          className="text-[14px] font-semibold text-primary-container hover:underline"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const creator = prompt.creator || {};
  const creatorRating = prompt.averageRating || 4.9;

  return (
    <>
      <Link
        href="/prompts"
        className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-on-surface-variant transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Back to Marketplace
      </Link>

      <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-8 py-8 lg:flex-row lg:gap-10"
    >
      <div className="flex w-full flex-col gap-8 lg:w-2/3">
        <FadeUp>
          <section className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(28,82,83,0.08)] transition-colors hover:border-primary/30 md:p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h1 className="text-[28px] font-bold leading-tight text-primary md:text-[32px]">
                {prompt.title}
              </h1>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={handleBookmark}
                  className={cn(
                    "rounded-full p-2 transition-colors",
                    bookmarked
                      ? "bg-primary-container/15 text-primary-container"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                  )}
                  title={bookmarked ? "Remove bookmark" : "Bookmark"}
                  disabled={toggleBookmarkMutation.isPending}
                  aria-label={bookmarked ? "Remove bookmark" : "Bookmark prompt"}
                  aria-pressed={bookmarked}
                >
                  <Bookmark
                    className="h-5 w-5"
                    strokeWidth={1.75}
                    fill={bookmarked ? "currentColor" : "none"}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleReport}
                  className="rounded-full p-2 text-error transition-colors hover:bg-error-container/50"
                  title="Report"
                  aria-label="Report prompt"
                >
                  <Flag className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 text-[12px] font-semibold text-on-surface">
                <Bot className="h-4 w-4" strokeWidth={1.75} />
                {prompt.aiTool}
              </span>
              <span className="rounded-full bg-surface-container px-3 py-1 text-[12px] font-semibold text-on-surface">
                {prompt.category}
              </span>
              {prompt.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-container px-3 py-1 text-[12px] font-semibold text-on-surface"
                >
                  {tag}
                </span>
              ))}
              <span className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 text-[12px] font-semibold text-on-surface">
                <BarChart3 className="h-4 w-4" strokeWidth={1.75} />
                {prompt.difficulty}
              </span>
              {prompt.visibility === "private" && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[12px] font-semibold text-amber-800">
                  <Crown className="h-3.5 w-3.5" strokeWidth={2} />
                  Premium
                </span>
              )}
            </div>

            <p className="mb-6 text-[17px] leading-relaxed text-on-surface-variant md:text-[18px]">
              {prompt.description}
            </p>

            <div className="flex items-center gap-4 border-t border-outline-variant/20 py-4">
              {creator.photoURL ? (
                <img
                  src={creator.photoURL}
                  alt={creator.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-[14px] font-bold text-on-secondary-container">
                  {getInitials(creator.name)}
                </div>
              )}
              <div>
                <div className="text-[14px] font-bold text-on-surface">
                  {creator.name || "Unknown Creator"}
                </div>
                <div className="text-[12px] text-on-surface-variant">
                  Top Creator • {creatorRating.toFixed(1)} Rating
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-on-surface-variant">
                <Copy className="h-4 w-4" strokeWidth={1.75} />
                {formatCopyCount(prompt.copyCount)} Copies
              </div>
            </div>
          </section>
        </FadeUp>

        <FadeUp delay={0.05}>
          <section className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(28,82,83,0.08)] md:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[24px] font-semibold text-primary">Prompt Content</h2>
              <Button
                size="sm"
                onClick={handleCopy}
                disabled={contentLocked || copyMutation.isPending}
              >
                <Copy className="h-4 w-4" strokeWidth={1.75} />
                {copyMutation.isPending ? "Copying..." : "Copy Prompt"}
              </Button>
            </div>

            <div className="relative rounded-xl border border-primary/10 bg-primary/5 p-6">
              <pre
                className={cn(
                  "whitespace-pre-wrap font-mono text-sm leading-relaxed text-on-background",
                  contentLocked && "pointer-events-none select-none blur-md"
                )}
              >
                {displayContent}
              </pre>

              {contentLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/75 px-6 text-center backdrop-blur-sm">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container/15 text-primary-container">
                    <Lock className="h-7 w-7" strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-2 text-[18px] font-semibold text-primary">
                    Premium Content Locked
                  </h3>
                  <p className="mb-5 max-w-sm text-[14px] text-on-surface-variant">
                    Subscribe to Premium to unlock private prompts, copy content,
                    and leave reviews.
                  </p>
                  <Link
                    href="/pricing"
                    onClick={() => setPremiumReturnTo(`/prompts/${promptId}`)}
                  >
                    <Button>
                      <Crown className="h-4 w-4" strokeWidth={2} />
                      Subscribe to Premium
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        </FadeUp>

        <FadeUp delay={0.1}>
          <section className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(28,82,83,0.08)] md:p-8">
            <h2 className="mb-4 text-[24px] font-semibold text-primary">
              Usage Instructions
            </h2>
            <div className="space-y-4 text-[16px] leading-relaxed text-on-surface-variant">
              <p>
                Before running this prompt, ensure you have clear definitions for
                the bracketed placeholders:
              </p>
              {placeholders.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5">
                  {placeholders.map((placeholder) => (
                    <li key={placeholder}>
                      <strong>[{placeholder}]:</strong> Replace with your specific
                      value before sending to {prompt.aiTool}.
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Review the prompt content and customize any bracketed fields
                    for your use case.
                  </li>
                  <li>
                    Match the tone and difficulty level ({prompt.difficulty}) when
                    iterating on outputs.
                  </li>
                </ul>
              )}
              <p>
                For best results, use this prompt in a new chat session to avoid
                context contamination from previous conversations.
              </p>
            </div>
          </section>
        </FadeUp>

        <FadeUp delay={0.15}>
          <PromptReviewsSection
            prompt={prompt}
            contentLocked={contentLocked}
            StarRating={StarRating}
          />
        </FadeUp>
      </div>

      <div className="w-full lg:w-1/3">
        <PromptDetailSidebar
          prompt={prompt}
          tokenEstimate={tokenEstimate}
          contentLocked={contentLocked}
          onCopy={handleCopy}
          onBookmark={handleBookmark}
          bookmarked={bookmarked}
          copyPending={copyMutation.isPending}
          similarPrompts={similarPrompts}
          formatDate={formatPromptDate}
        />
      </div>
      </motion.div>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        promptId={promptId}
        promptTitle={prompt.title}
      />
    </>
  );
}
