"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import CreatorCollectionsPanel from "@/components/dashboard/creator/CreatorCollectionsPanel";

export default function CreatorCollectionsPage() {
  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <CreatorCollectionsPanel />
    </RoleGuard>
  );
}
