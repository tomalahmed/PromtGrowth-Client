"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImageIcon, Lock, Mail, User } from "lucide-react";
import { toast } from "react-toastify";
import { AuthField, AuthInput } from "@/components/auth/AuthField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import useAuth from "@/hooks/useAuth";
import { getDashboardPath } from "@/utils/roleRedirect";
import { CONTACT_EMAIL, getContactMailto } from "@/lib/contact";

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, register, googleLogin } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [loading, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = await register({
        name,
        email,
        password,
        photoURL: photoURL.trim(),
      });
      toast.success("Account created successfully!");
      router.push(getDashboardPath(data.data.role));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);

    try {
      const data = await googleLogin();
      toast.success("Signed up with Google!");
      router.push(getDashboardPath(data.data.role));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[480px] text-center">
        <p className="text-on-surface-variant">Loading...</p>
      </main>
    );
  }

  return (
    <main className="auth-fade-in mx-auto w-full max-w-[480px]">
      <div className="mb-8 text-center">
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-primary md:text-[42px]">
          PromptGrowth
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant">
          Join the leading AI prompt marketplace.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[24px] border border-outline-variant/20 bg-white p-7 shadow-[0_4px_24px_-4px_rgba(28,82,83,0.1)] md:p-8">
        <div className="mb-7 text-center">
          <h2 className="text-[22px] font-semibold text-on-surface">
            Create an Account
          </h2>
        </div>

        <GoogleAuthButton
          label="Sign up with Google"
          variant="outline"
          onClick={handleGoogleSignup}
          disabled={googleLoading || submitting}
        />

        <div className="relative my-7 flex items-center">
          <div className="flex-grow border-t border-outline-variant/40" />
          <span className="mx-4 shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Or register with email
          </span>
          <div className="flex-grow border-t border-outline-variant/40" />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthField label="Full Name" htmlFor="name">
            <AuthInput
              id="name"
              name="name"
              type="text"
              required
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </AuthField>

          <AuthField label="Email Address" htmlFor="email">
            <AuthInput
              id="email"
              name="email"
              type="email"
              required
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
            />
          </AuthField>

          <AuthField label="Photo URL (Optional)" htmlFor="photo">
            <AuthInput
              id="photo"
              name="photo"
              type="url"
              icon={ImageIcon}
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </AuthField>

          <AuthField label="Password" htmlFor="password">
            <AuthInput
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </AuthField>

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 w-full rounded-xl bg-primary-container px-6 py-3.5 text-[14px] font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-5 space-y-2 text-center">
          <p className="text-[15px] text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p className="text-[14px] text-on-surface-variant">
            Just exploring?{" "}
            <Link href="/demo" className="font-semibold text-primary hover:underline">
              Try a demo account instead
            </Link>
          </p>
          <p className="text-[14px] text-on-surface-variant">
            Want to publish prompts?{" "}
            <a
              href={getContactMailto("Creator access request")}
              className="font-semibold text-primary hover:underline"
            >
              Contact {CONTACT_EMAIL}
            </a>{" "}
            to request creator access.
          </p>
        </div>

        <div className="pointer-events-none absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-primary-container/[0.06] blur-2xl" />
      </div>

      <div className="mt-8 flex justify-center gap-3 text-[12px] font-medium text-on-surface-variant">
        <span className="hover:text-primary">Privacy Policy</span>
        <span className="text-outline-variant">•</span>
        <span className="hover:text-primary">Terms of Service</span>
      </div>
    </main>
  );
}
