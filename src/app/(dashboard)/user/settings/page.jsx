"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import UserSettingsPanel from "@/components/dashboard/user/UserSettingsPanel";

export default function UserSettingsPage() {
  return (
    <RoleGuard allowedRoles={["user", "creator", "admin"]}>
      <UserSettingsPanel />
    </RoleGuard>
  );
}
