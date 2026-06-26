"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Compass } from "lucide-react";
import { toast } from "react-toastify";
import { CreatorPageHeader } from "@/components/dashboard/creator/CreatorFormCard";
import PromptCard from "@/components/prompts/PromptCard";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useMyBookmarks } from "@/hooks/useAdmin";
import { useToggleBookmark } from "@/hooks/useBookmark";

export default function CreatorCollectionsPanel() {
  const { data, isLoading } = useMyBookmarks(1, 24);
  const prompts = data?.data || [];

  return (
    <>
      <CreatorPageHeader
        title="Collections"
        subtitle="Prompts you've saved from the marketplace for inspiration."
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading collections..." />
        </div>
      ) : prompts.length === 0 ? (
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
            <Bookmark className="h-7 w-7" strokeWidth={1.5} />
          </motion.div>
          <h3 className="text-[18px] font-semibold text-primary">No saved prompts yet</h3>
          <p className="mt-2 max-w-sm text-[14px] text-on-surface-variant">
            Browse the marketplace and bookmark prompts you want to reference later.
          </p>
          <Link href="/prompts" className="mt-6">
            <Button className="gap-2">
              <Compass className="h-4 w-4" />
              Browse Marketplace
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt, index) => (
            <CollectionCard key={prompt._id} prompt={prompt} index={index} />
          ))}
        </div>
      )}
    </>
  );
}

function CollectionCard({ prompt, index }) {
  const toggleBookmark = useToggleBookmark(prompt._id);

  const handleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleBookmark.mutateAsync();
      toast.success("Removed from collections");
    } catch {
      toast.error("Failed to remove bookmark");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="flex flex-col"
    >
      <PromptCard prompt={prompt} />
      <div className="mt-3 flex gap-2">
        <Link href={`/prompts/${prompt._id}`} className="flex-1">
          <Button className="w-full" size="sm">
            View Details
          </Button>
        </Link>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRemove}
          disabled={toggleBookmark.isPending}
        >
          Remove
        </Button>
      </div>
    </motion.div>
  );
}
