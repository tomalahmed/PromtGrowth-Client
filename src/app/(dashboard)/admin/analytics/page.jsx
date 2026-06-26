"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import AdminAnalyticsPanel from "@/components/dashboard/admin/AdminAnalyticsPanel";

export default function AdminAnalyticsPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminAnalyticsPanel />
    </RoleGuard>
  );
}
