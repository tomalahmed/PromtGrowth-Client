"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import AdminReportsPanel from "@/components/dashboard/admin/AdminReportsPanel";

export default function AdminReportsPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminReportsPanel />
    </RoleGuard>
  );
}
