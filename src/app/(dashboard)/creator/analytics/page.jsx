"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import CreatorAnalyticsPanel from "@/components/dashboard/creator/CreatorAnalyticsPanel";

export default function CreatorAnalyticsPage() {
  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <CreatorAnalyticsPanel />
    </RoleGuard>
  );
}
