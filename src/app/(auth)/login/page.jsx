"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { AuthField, AuthInput } from "@/components/auth/AuthField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import AuthLoadingScreen from "@/components/auth/AuthLoadingScreen";
import useAuth from "@/hooks/useAuth";
import { navigateAfterAuth } from "@/utils/navigateAfterAuth";
import {
  DEMO_PASSWORD,
  getDemoAccountByEmail,
} from "@/lib/demoAccounts";

function getErrorMessage(error) {
  if (error?.isNetworkError) {
    return "Cannot reach the server. Check your connection and try again.";
  }

  if (error?.code?.startsWith("auth/")) {
    if (error.code === "auth/account-exists-with-different-credential") {
      return "This email is already registered. Sign in with email and password instead.";
    }
    return "Google sign-in was interrupted. Please try again.";
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const { user, loading, completingGoogle, authError, clearAuthError, login, googleLogin } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoAccount, setDemoAccount] = useState(null);
  const autoLoginAttempted = useRef(false);

  useEffect(() => {
    if (!authError) return;
    toast.error(authError);
    clearAuthError();
  }, [authError, clearAuthError]);

  useEffect(() => {
    if (!loading && user) {
      navigateAfterAuth(user.role, searchParams.get("redirect"));
    }
  }, [loading, user, searchParams]);

  useEffect(() => {
    if (loading || user) return;

    const isDemo = searchParams.get("demo") === "1";
    const demoEmail = searchParams.get("email")?.trim().toLowerCase();
    const shouldAutoLogin = searchParams.get("auto") === "1";

    if (!isDemo || !demoEmail) return;

    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setDemoAccount(getDemoAccountByEmail(demoEmail) || { email: demoEmail, name: demoEmail });

    if (!shouldAutoLogin || autoLoginAttempted.current) return;

    autoLoginAttempted.current = true;

    const runDemoLogin = async () => {
      setSubmitting(true);
      try {
        const data = await login({ email: demoEmail, password: DEMO_PASSWORD });
        toast.success(`Signed in as demo ${data.data.role}`);
        navigateAfterAuth(data.data.role, searchParams.get("redirect"));
      } catch (error) {
        autoLoginAttempted.current = false;
        toast.error(getErrorMessage(error));
      } finally {
        setSubmitting(false);
      }
    };

    runDemoLogin();
  }, [loading, user, searchParams, login]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = await login({ email, password });
      toast.success("Welcome back!");
      navigateAfterAuth(data.data.role, searchParams.get("redirect"));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const redirectTarget =
        searchParams.get("redirect") || window.location.pathname + window.location.search;
      const data = await googleLogin(redirectTarget);

      if (data?.redirected) {
        return;
      }

      toast.success("Signed in with Google!");
      navigateAfterAuth(data.data.role, searchParams.get("redirect"));
    } catch (error) {
      setGoogleLoading(false);
      toast.error(getErrorMessage(error));
    }
  };

  if (loading || completingGoogle) {
    return (
      <AuthLoadingScreen
        message={
          completingGoogle
            ? "Completing your Google sign-in..."
            : "Loading your session..."
        }
      />
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
        {demoAccount && (
          <div className="mb-5 rounded-xl border border-primary-container/20 bg-primary-container/10 px-4 py-3 text-[13px] text-on-surface-variant">
            <p className="font-semibold text-primary">
              Demo account: {demoAccount.name || demoAccount.email}
            </p>
            <p className="mt-1">
              Email and password are filled in for you. Click Login or wait a moment
              for automatic sign-in.
            </p>
            <Link href="/demo" className="mt-2 inline-block font-semibold text-primary-container hover:underline">
              Choose a different demo account
            </Link>
          </div>
        )}

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
          loading={googleLoading}
        />
      </div>

      <div className="mt-6 space-y-3 text-center">
        <p className="text-[15px] text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create a free account
          </Link>
        </p>
        <p className="text-[14px] text-on-surface-variant">
          Evaluating the app?{" "}
          <Link href="/demo" className="font-semibold text-primary hover:underline">
            Try a demo account
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
        <AuthLoadingScreen message="Loading your session..." />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
