import RoleGuard from "@/components/shared/RoleGuard";

export default function UserDashboardPage() {
  return (
    <RoleGuard allowedRoles={["user", "creator", "admin"]}>
      <div className="rounded-2xl border border-outline-variant/20 bg-white p-8 shadow-sm">
        <h1 className="text-[28px] font-bold text-primary">User Dashboard</h1>
        <p className="mt-2 text-on-surface-variant">
          Welcome to your dashboard. More features coming in Phase 5.
        </p>
      </div>
    </RoleGuard>
  );
}
