"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import { getDashboardPath } from "@/utils/roleRedirect";

const navLinks = [
  { href: "/", label: "Home", exact: true },
  { href: "/prompts", label: "Marketplace" },
  { href: "/#top-creators", label: "Creators" },
  { href: "/pricing", label: "Premium" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href, exact) => {
    if (href === "/#top-creators") return false;
    if (exact) return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
      setMobileOpen(false);
    } catch {
      toast.error("Failed to logout");
    }
  };

  const dashboardPath = user ? getDashboardPath(user.role) : "/user";

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 flex h-20 w-full items-center justify-between bg-surface/80 px-4 shadow-sm backdrop-blur-md md:px-10">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between">
          <Link
            href="/"
            className="text-[24px] font-bold leading-[1.4] text-primary"
          >
            PromptGrowth
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] font-medium leading-[1.4] transition-colors ${
                    active
                      ? "border-b-2 border-primary pb-1 font-bold text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {!loading && user ? (
              <>
                <Link
                  href={dashboardPath}
                  className="text-[14px] font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-outline-variant/30 px-5 py-2.5 text-[14px] font-medium text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[14px] font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary-container px-6 py-3 text-[14px] font-medium text-on-primary transition-colors hover:bg-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" strokeWidth={1.75} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-20 z-40 border-t border-outline-variant/20 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-[14px] font-medium ${
                    active
                      ? "bg-primary-container/10 font-bold text-primary"
                      : "text-on-surface-variant"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <hr className="my-1 border-outline-variant/30" />
            {!loading && user ? (
              <>
                <Link
                  href={dashboardPath}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-on-surface-variant"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-on-surface-variant"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-on-surface-variant"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-primary-container px-3 py-2.5 text-center text-[14px] font-medium text-on-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
