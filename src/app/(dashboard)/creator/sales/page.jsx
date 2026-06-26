"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import CreatorSalesPanel from "@/components/dashboard/creator/CreatorSalesPanel";

export default function CreatorSalesPage() {
  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <CreatorSalesPanel />
    </RoleGuard>
  );
}
