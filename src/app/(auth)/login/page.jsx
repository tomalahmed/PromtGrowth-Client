"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { AuthField, AuthInput } from "@/components/auth/AuthField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import useAuth from "@/hooks/useAuth";
import { getDashboardPath } from "@/utils/roleRedirect";

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login, googleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectPath =
    searchParams.get("redirect") || (user ? getDashboardPath(user.role) : null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectPath || getDashboardPath(user.role));
    }
  }, [loading, user, router, redirectPath]);

  const navigateAfterAuth = (role) => {
    router.push(searchParams.get("redirect") || getDashboardPath(role));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = await login({ email, password });
      toast.success("Welcome back!");
      navigateAfterAuth(data.data.role);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const data = await googleLogin();
      toast.success("Signed in with Google!");
      navigateAfterAuth(data.data.role);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[440px] text-center">
        <p className="text-on-surface-variant">Loading...</p>
      </main>
    );
  }

  return (
    <main className="auth-fade-in mx-auto w-full max-w-[440px]">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-[32px] font-bold leading-tight tracking-tight text-primary">
          PromptGrowth
        </h1>
        <p className="text-[15px] leading-relaxed text-on-surface-variant">
          Welcome back. Please enter your details.
        </p>
      </div>

      <div className="rounded-2xl border border-outline-variant/10 bg-white p-7 shadow-[0_4px_24px_-4px_rgba(28,82,83,0.1)] md:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthField label="Email" htmlFor="email">
            <AuthInput
              id="email"
              name="email"
              type="email"
              required
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </AuthField>

          <AuthField
            label="Password"
            htmlFor="password"
            labelExtra={
              <span className="text-[12px] font-semibold text-primary/70">
                Forgot Password?
              </span>
            }
          >
            <div className="relative">
              <AuthInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                inputClassName="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline-variant transition-colors hover:text-on-surface-variant"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.75} />
                ) : (
                  <Eye className="h-[18px] w-[18px]" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </AuthField>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3.5 text-[14px] font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{submitting ? "Logging in..." : "Login"}</span>
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>
        </form>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-outline-variant/30" />
          <span className="text-[12px] font-semibold uppercase tracking-wide text-outline">
            or
          </span>
          <div className="h-px flex-1 bg-outline-variant/30" />
        </div>

        <GoogleAuthButton
          label="Sign in with Google"
          variant="soft"
          onClick={handleGoogleLogin}
          disabled={googleLoading || submitting}
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-[15px] text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-[440px] text-center">
          <p className="text-on-surface-variant">Loading...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
