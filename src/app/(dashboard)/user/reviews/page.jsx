"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import UserReviewsPanel from "@/components/dashboard/user/UserReviewsPanel";

export default function UserReviewsPage() {
  return (
    <RoleGuard allowedRoles={["user", "creator", "admin"]}>
      <UserReviewsPanel />
    </RoleGuard>
  );
}
