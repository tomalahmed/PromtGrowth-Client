import RoleGuard from "@/components/shared/RoleGuard";

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="rounded-2xl border border-outline-variant/20 bg-white p-8 shadow-sm">
        <h1 className="text-[28px] font-bold text-primary">Admin Dashboard</h1>
        <p className="mt-2 text-on-surface-variant">
          User and prompt moderation tools will be added in Phase 5.
        </p>
      </div>
    </RoleGuard>
  );
}
