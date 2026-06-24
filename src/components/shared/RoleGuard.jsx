"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { getDashboardPath } from "@/utils/roleRedirect";

export default function RoleGuard({ allowedRoles, children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-on-surface-variant">Loading dashboard...</p>
      </div>
    );
  }

  return children;
}
