"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import CreatorHelpPanel from "@/components/dashboard/creator/CreatorHelpPanel";

export default function CreatorHelpPage() {
  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <CreatorHelpPanel />
    </RoleGuard>
  );
}
