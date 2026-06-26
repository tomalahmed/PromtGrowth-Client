"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bookmark,
  CreditCard,
  Flag,
  LayoutDashboard,
  Menu,
  MessageSquare,
  FileText,
  PlusCircle,
  Users,
  X,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { getInitials } from "@/lib/promptUtils";
import { cn } from "@/lib/cn";

const NAV_BY_ROLE = {
  user: [
    { href: "/user", label: "Overview", icon: LayoutDashboard },
    { href: "/user/bookmarks", label: "Saved Prompts", icon: Bookmark },
    { href: "/user/reviews", label: "My Reviews", icon: MessageSquare },
  ],
  creator: [
    { href: "/creator", label: "Creator Hub", icon: LayoutDashboard },
    { href: "/creator/add-prompt", label: "Add Prompt", icon: PlusCircle },
    { href: "/creator/my-prompts", label: "My Prompts", icon: FileText },
  ],
  admin: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/prompts", label: "Prompts", icon: LayoutDashboard },
    { href: "/admin/reports", label: "Reports", icon: Flag },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
  ],
};

function getNavItems(role) {
  if (role === "admin") return NAV_BY_ROLE.admin;
  if (role === "creator") return [...NAV_BY_ROLE.creator, ...NAV_BY_ROLE.user.slice(1)];
  return NAV_BY_ROLE.user;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const navItems = getNavItems(user.role);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-outline-variant/15 p-5">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-container">
              {getInitials(user.name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-on-surface">{user.name}</p>
            <p className="truncate text-[12px] capitalize text-on-surface-variant">
              {user.role}
              {user.isPremium ? " · Premium" : ""}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/user" &&
              item.href !== "/creator" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors",
                active
                  ? "bg-primary-container/15 text-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-outline-variant/20 bg-white px-4 py-2 text-[14px] font-semibold text-on-surface lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
        Dashboard Menu
      </button>

      <aside className="hidden w-64 shrink-0 rounded-2xl border border-outline-variant/15 bg-white shadow-sm lg:block">
        {sidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex justify-end p-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
