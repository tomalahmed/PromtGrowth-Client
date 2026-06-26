"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import { isDemoAccount } from "@/lib/demoAccounts";
import {
  getDashboardHref,
  getDashboardLabel,
  getMainNavLinks,
  getPrimaryAccountAction,
  isNavLinkActive,
} from "@/utils/navLinks";

function NavLink({ link, active, onClick, className }) {
  return (
    <Link href={link.href} onClick={onClick} className={className}>
      {link.label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainLinks = getMainNavLinks(user);
  const dashboardHref = getDashboardHref(user);
  const dashboardLabel = user ? getDashboardLabel(user.role) : "Dashboard";
  const primaryAction = user ? getPrimaryAccountAction(user) : null;
  const isDemoUser = user ? isDemoAccount(user.email) : false;

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
      closeMobile();
    } catch {
      toast.error("Failed to logout");
    }
  };

  const desktopLinkClass = (active) =>
    `text-[14px] font-medium leading-[1.4] transition-colors ${
      active
        ? "border-b-2 border-primary pb-1 font-bold text-primary"
        : "text-on-surface-variant hover:text-primary"
    }`;

  const mobileLinkClass = (active) =>
    `rounded-lg px-3 py-2.5 text-[14px] font-medium ${
      active ? "bg-primary-container/10 font-bold text-primary" : "text-on-surface-variant"
    }`;

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

          <div className="hidden items-center gap-5 lg:gap-6 md:flex">
            {mainLinks.map((link) => {
              const active = isNavLinkActive(pathname, link);
              return (
                <NavLink
                  key={link.href + link.label}
                  link={link}
                  active={active}
                  className={desktopLinkClass(active)}
                />
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex md:gap-4">
            {!loading && user ? (
              <>
                {isDemoUser && (
                  <Link
                    href="/demo"
                    className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800 transition-colors hover:bg-amber-200"
                    title="Demo sandbox — seeded data only"
                  >
                    Demo mode
                  </Link>
                )}
                {primaryAction && (
                  <Link
                    href={primaryAction.href}
                    className="rounded-lg bg-primary-container px-5 py-2.5 text-[14px] font-medium text-on-primary transition-colors hover:bg-primary"
                  >
                    {primaryAction.label}
                  </Link>
                )}
                <Link
                  href={dashboardHref}
                  className="text-[14px] font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  {dashboardLabel}
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
                  href="/demo"
                  className="text-[14px] font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  Demo
                </Link>
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
        <div className="fixed inset-x-0 top-20 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-outline-variant/20 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-2">
            {mainLinks.map((link) => {
              const active = isNavLinkActive(pathname, link);
              return (
                <NavLink
                  key={link.href + link.label}
                  link={link}
                  active={active}
                  onClick={closeMobile}
                  className={mobileLinkClass(active)}
                />
              );
            })}
            <hr className="my-1 border-outline-variant/30" />
            {!loading && user ? (
              <>
                {isDemoUser && (
                  <Link
                    href="/demo"
                    onClick={closeMobile}
                    className="rounded-lg bg-amber-100 px-3 py-2 text-[12px] font-semibold text-amber-800"
                  >
                    Demo sandbox — seeded data only
                  </Link>
                )}
                {primaryAction && (
                  <Link
                    href={primaryAction.href}
                    onClick={closeMobile}
                    className="rounded-lg bg-primary-container px-3 py-2.5 text-center text-[14px] font-medium text-on-primary"
                  >
                    {primaryAction.label}
                  </Link>
                )}
                <Link
                  href={dashboardHref}
                  onClick={closeMobile}
                  className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-on-surface-variant"
                >
                  {dashboardLabel}
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
                  href="/demo"
                  onClick={closeMobile}
                  className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-on-surface-variant"
                >
                  Demo
                </Link>
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-on-surface-variant"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobile}
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
