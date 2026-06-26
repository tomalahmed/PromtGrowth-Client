"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import AdminModerationPanel from "@/components/dashboard/admin/AdminModerationPanel";

export default function AdminPromptsPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminModerationPanel />
    </RoleGuard>
  );
}
