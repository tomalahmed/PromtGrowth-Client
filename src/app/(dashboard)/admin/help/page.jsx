"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import AdminHelpPanel from "@/components/dashboard/admin/AdminHelpPanel";

export default function AdminHelpPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminHelpPanel />
    </RoleGuard>
  );
}
