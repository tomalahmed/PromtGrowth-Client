"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import RoleGuard from "@/components/shared/RoleGuard";
import PromptCard from "@/components/prompts/PromptCard";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { useMyBookmarks } from "@/hooks/useAdmin";
import { useToggleBookmark } from "@/hooks/useBookmark";

export default function UserBookmarksPage() {
  const { data, isLoading } = useMyBookmarks();
  const prompts = data?.data || [];

  return (
    <RoleGuard allowedRoles={["user", "creator", "admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-primary">Saved Prompts</h1>
          <p className="mt-1 text-on-surface-variant">
            Prompts you bookmarked from the marketplace.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Loading bookmarks..." />
          </div>
        ) : prompts.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/15 bg-white p-10 text-center">
            <p className="mb-4 text-on-surface-variant">No saved prompts yet.</p>
            <Link href="/prompts">
              <Button>Browse Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {prompts.map((prompt) => (
              <BookmarkCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

function BookmarkCard({ prompt }) {
  const toggleBookmark = useToggleBookmark(prompt._id);

  const handleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleBookmark.mutateAsync();
    } catch {
      toast.error("Failed to remove bookmark");
    }
  };

  return (
    <div className="relative">
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
    </div>
  );
}
