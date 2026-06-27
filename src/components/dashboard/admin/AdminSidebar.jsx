"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  FileText,
  Flag,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Users,
  X,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { logoutAndRefresh } from "@/utils/navigateAfterAuth";
import { cn } from "@/lib/cn";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/prompts", label: "All Prompts", icon: FileText },
  { href: "/admin/users", label: "All Users", icon: Users },
  { href: "/admin/payments", label: "All Payments", icon: CreditCard },
  { href: "/admin/reports", label: "Reported Prompts", icon: Flag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

function NavItem({ item, active, onNavigate }) {
  const Icon = item.icon;

  return (
    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all",
          active
            ? "bg-primary-container text-on-primary shadow-sm"
            : "text-on-surface-variant hover:bg-white/70 hover:text-primary"
        )}
      >
        <motion.span
          animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            active
              ? "bg-white/15 text-on-primary"
              : "bg-surface-container-high/80 text-primary-container group-hover:bg-primary-container/10"
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </motion.span>
        {item.label}
      </Link>
    </motion.div>
  );
}

function isNavActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logoutAndRefresh(logout);
  };

  const sidebarBody = (
    <div className="flex h-full flex-col">
      <div className="border-b border-outline-variant/15 p-5">
        <p className="text-[18px] font-bold text-primary">Admin Panel</p>
        <p className="text-[12px] text-on-surface-variant">System Oversight</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {ADMIN_NAV.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={isNavActive(pathname, item)}
            onNavigate={closeMenu}
          />
        ))}
      </nav>

      <div className="space-y-3 border-t border-outline-variant/15 p-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/admin/prompts"
            onClick={closeMenu}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-4 py-3 text-[14px] font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Review Queue
          </Link>
        </motion.div>

        <Link
          href="/admin/help"
          onClick={closeMenu}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-white/60 hover:text-primary",
            pathname.startsWith("/admin/help")
              ? "bg-white/70 text-primary"
              : "text-on-surface-variant"
          )}
        >
          <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
          Help Center
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-on-surface-variant transition-colors hover:bg-white/60 hover:text-primary"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Logout
        </button>
      </div>
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
        Admin Panel
      </button>

      <aside className="hidden w-[260px] shrink-0 overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-low/90 shadow-[0_8px_32px_-8px_rgba(21,82,30,0.12)] backdrop-blur-sm lg:sticky lg:top-28 lg:self-start lg:block">
        {sidebarBody}
      </aside>

      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={closeMenu}
            aria-label="Close menu"
          />
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-surface-container-low shadow-xl">
            <div className="flex justify-end p-3">
              <button type="button" onClick={closeMenu} className="rounded-lg p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebarBody}
          </aside>
        </div>
      )}
    </>
  );
}
