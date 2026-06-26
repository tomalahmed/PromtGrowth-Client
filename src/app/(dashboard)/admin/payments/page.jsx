"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import AdminPaymentsPanel from "@/components/dashboard/admin/AdminPaymentsPanel";

export default function AdminPaymentsPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminPaymentsPanel />
    </RoleGuard>
  );
}
