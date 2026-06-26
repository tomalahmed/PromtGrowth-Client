"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import UserHelpPanel from "@/components/dashboard/user/UserHelpPanel";

export default function UserHelpPage() {
  return (
    <RoleGuard allowedRoles={["user", "creator", "admin"]}>
      <UserHelpPanel />
    </RoleGuard>
  );
}
