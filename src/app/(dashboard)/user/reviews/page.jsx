"use client";

import Link from "next/link";
import RoleGuard from "@/components/shared/RoleGuard";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { formatPromptDate, formatRelativeDate } from "@/lib/promptUtils";

function useMyReviews() {
  return useQuery({
    queryKey: ["reviews", "me"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reviews/me");
      return data;
    },
  });
}

export default function UserReviewsPage() {
  const { data, isLoading } = useMyReviews();
  const reviews = data?.data || [];

  return (
    <RoleGuard allowedRoles={["user", "creator", "admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-primary">My Reviews</h1>
          <p className="mt-1 text-on-surface-variant">
            Feedback you have shared on marketplace prompts.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Loading reviews..." />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/15 bg-white p-10 text-center">
            <p className="mb-4 text-on-surface-variant">You have not written any reviews yet.</p>
            <Link href="/prompts">
              <Button>Browse Prompts</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border border-outline-variant/15 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-semibold text-on-surface">
                      {review.prompt?.title || "Prompt"}
                    </h3>
                    <p className="text-[13px] text-on-surface-variant">
                      {formatRelativeDate(review.createdAt)}
                    </p>
                  </div>
                  <Badge variant="primary">{review.rating} / 5</Badge>
                </div>
                <p className="text-[15px] leading-relaxed text-on-surface-variant">
                  {review.comment}
                </p>
                {review.prompt?._id && (
                  <div className="mt-4">
                    <Link href={`/prompts/${review.prompt._id}`}>
                      <Button size="sm" variant="outline">
                        View Prompt
                      </Button>
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
