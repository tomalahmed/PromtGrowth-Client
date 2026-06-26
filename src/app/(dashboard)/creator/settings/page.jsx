"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import CreatorSettingsPanel from "@/components/dashboard/creator/CreatorSettingsPanel";

export default function CreatorSettingsPage() {
  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <CreatorSettingsPanel />
    </RoleGuard>
  );
}
