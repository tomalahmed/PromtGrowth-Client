"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, MessageSquare, Star } from "lucide-react";
import { UserPageHeader } from "@/components/dashboard/user/UserPageHeader";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useMyReviews } from "@/hooks/useReviews";
import { formatRelativeDate } from "@/lib/promptUtils";

export default function UserReviewsPanel() {
  const { data, isLoading } = useMyReviews();
  const reviews = data?.data || [];

  return (
    <>
      <UserPageHeader
        title="My Reviews"
        subtitle="Feedback you have shared on marketplace prompts."
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading reviews..." />
        </div>
      ) : reviews.length === 0 ? (
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
            <MessageSquare className="h-7 w-7" strokeWidth={1.5} />
          </motion.div>
          <h3 className="text-[18px] font-semibold text-primary">No reviews yet</h3>
          <p className="mt-2 max-w-sm text-[14px] text-on-surface-variant">
            Explore the marketplace and share your experience on prompts you use.
          </p>
          <Link href="/prompts" className="mt-6">
            <Button className="gap-2">
              <Compass className="h-4 w-4" />
              Browse Prompts
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.article
              key={review._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-outline-variant/15 bg-white p-5 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.08)]"
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
                <Badge variant="primary" className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {review.rating} / 5
                </Badge>
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
            </motion.article>
          ))}
        </div>
      )}
    </>
  );
}
