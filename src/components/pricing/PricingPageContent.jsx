"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Crown, Lock, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import FadeUp from "@/components/shared/FadeUp";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import useAuth from "@/hooks/useAuth";
import { useCreateCheckoutSession } from "@/hooks/usePayment";
import { getApiErrorMessage } from "@/lib/apiErrors";
import { PREMIUM_RETURN_STORAGE_KEY } from "@/lib/premiumCheckout";
import { getStripe } from "@/lib/stripe";
import { useQueryClient } from "@tanstack/react-query";

const PREMIUM_BENEFITS = [
  {
    icon: Lock,
    title: "Unlock private prompts",
    description: "Access premium-only prompts with advanced frameworks and workflows.",
  },
  {
    icon: Copy,
    title: "Copy premium content",
    description: "Copy full prompt text from private listings without blur or restrictions.",
  },
  {
    icon: MessageSquare,
    title: "Review premium prompts",
    description: "Share ratings and feedback on private prompts after you use them.",
  },
  {
    icon: Sparkles,
    title: "Lifetime access",
    description: "One-time payment — no recurring subscription or hidden fees.",
  },
];

export default function PricingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, refetchUser } = useAuth();
  const checkoutMutation = useCreateCheckoutSession();
  const queryClient = useQueryClient();
  const handledPaymentRef = useRef(false);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    if (!paymentStatus || handledPaymentRef.current) {
      return;
    }

    if (paymentStatus === "cancelled") {
      handledPaymentRef.current = true;
      toast.info("Checkout cancelled. You can upgrade anytime.");
      router.replace("/pricing");
      return;
    }

    if (paymentStatus !== "success") {
      return;
    }

    handledPaymentRef.current = true;

    const completePayment = async () => {
      toast.success("Premium unlocked! Enjoy private prompts and full access.");
      await refetchUser();
      await queryClient.invalidateQueries({ queryKey: ["prompt"] });
      await queryClient.invalidateQueries({ queryKey: ["prompts"] });

      const returnTo =
        sessionStorage.getItem(PREMIUM_RETURN_STORAGE_KEY) || "/prompts";
      sessionStorage.removeItem(PREMIUM_RETURN_STORAGE_KEY);
      router.replace(returnTo);
    };

    completePayment();
  }, [searchParams, refetchUser, router, queryClient]);

  const handleSubscribe = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/pricing")}`);
      return;
    }

    if (user.isPremium) {
      toast.info("You already have Premium access");
      return;
    }

    if (typeof window !== "undefined") {
      const referrer = document.referrer;
      const sameOriginReferrer =
        referrer && referrer.startsWith(window.location.origin)
          ? new URL(referrer).pathname
          : null;

      sessionStorage.setItem(
        PREMIUM_RETURN_STORAGE_KEY,
        sameOriginReferrer && sameOriginReferrer !== "/pricing"
          ? sameOriginReferrer
          : "/prompts"
      );
    }

    try {
      const session = await checkoutMutation.mutateAsync();

      if (session?.url) {
        window.location.href = session.url;
        return;
      }

      if (session?.sessionId) {
        const stripe = await getStripe();

        if (!stripe) {
          toast.error("Stripe publishable key is not configured");
          return;
        }

        const { error } = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to start checkout"));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading pricing..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 py-16 md:px-10">
      <FadeUp className="mb-10 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-container/20 bg-primary-container/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-primary-container">
          <Crown className="h-3.5 w-3.5" strokeWidth={2} />
          Premium
        </span>
        <h1 className="mb-4 text-[36px] font-bold text-primary md:text-[42px]">
          Unlock PromptGrowth Premium
        </h1>
        <p className="mx-auto max-w-2xl text-[17px] leading-relaxed text-on-surface-variant">
          One-time payment for lifetime access to private prompts, premium copy
          actions, and reviews on locked content.
        </p>
      </FadeUp>

      <FadeUp delay={0.05}>
        <motion.div
          whileHover={{ y: -4 }}
          className="overflow-hidden rounded-3xl border border-outline-variant/15 bg-white shadow-[0_8px_32px_-4px_rgba(28,82,83,0.12)]"
        >
          <div className="bg-gradient-to-br from-primary-container/10 via-white to-tertiary-fixed/20 px-8 py-10 text-center md:px-12">
            <p className="mb-2 text-[14px] font-semibold uppercase tracking-wider text-on-surface-variant">
              One-time payment
            </p>
            <div className="mb-2 flex items-end justify-center gap-2">
              <span className="text-[56px] font-bold leading-none text-primary">$5</span>
              <span className="pb-2 text-[16px] text-on-surface-variant">USD</span>
            </div>
            <p className="text-[15px] text-on-surface-variant">
              No subscription. Premium access stays on your account forever.
            </p>
          </div>

          <div className="grid gap-4 px-8 py-8 md:grid-cols-2 md:px-12">
            {PREMIUM_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="flex gap-4 rounded-2xl border border-outline-variant/10 bg-surface-container-low/40 p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="mb-1 text-[16px] font-semibold text-on-surface">
                      {benefit.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-on-surface-variant">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-outline-variant/10 px-8 py-8 text-center md:px-12">
            {user?.isPremium ? (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-container/15 px-4 py-2 text-[14px] font-semibold text-primary-container">
                  <Check className="h-4 w-4" strokeWidth={2} />
                  You have Premium access
                </div>
                <div>
                  <Link href="/prompts">
                    <Button variant="outline">Browse Marketplace</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={handleSubscribe}
                  disabled={checkoutMutation.isPending}
                  className="min-w-[240px]"
                >
                  <Crown className="h-4 w-4" strokeWidth={2} />
                  {checkoutMutation.isPending
                    ? "Redirecting to checkout..."
                    : "Subscribe to Premium"}
                </Button>
                <p className="text-[13px] text-on-surface-variant">
                  Secure checkout powered by Stripe. You will return here after payment.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </FadeUp>
    </div>
  );
}
