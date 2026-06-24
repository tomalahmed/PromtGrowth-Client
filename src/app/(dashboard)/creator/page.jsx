import RoleGuard from "@/components/shared/RoleGuard";

export default function CreatorDashboardPage() {
  return (
    <RoleGuard allowedRoles={["creator", "admin"]}>
      <div className="rounded-2xl border border-outline-variant/20 bg-white p-8 shadow-sm">
        <h1 className="text-[28px] font-bold text-primary">Creator Dashboard</h1>
        <p className="mt-2 text-on-surface-variant">
          Analytics and prompt management will be added in Phase 5.
        </p>
      </div>
    </RoleGuard>
  );
}
