import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "creator", label: "Creator" },
  { value: "admin", label: "Admin" },
];

export default function UserTable({
  users = [],
  onRoleChange,
  onDelete,
  actionPending = false,
}) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-outline-variant/15 bg-white p-8 text-center text-on-surface-variant">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-outline-variant/15 bg-white shadow-sm">
      <table className="min-w-full text-left text-[14px]">
        <thead className="border-b border-outline-variant/15 bg-surface-container-low/50 text-[12px] uppercase tracking-wide text-on-surface-variant">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Plan</th>
            <th className="px-4 py-3 font-semibold">Prompts</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-outline-variant/10 last:border-0">
              <td className="px-4 py-3 font-medium text-on-surface">{user.name}</td>
              <td className="px-4 py-3 text-on-surface-variant">{user.email}</td>
              <td className="px-4 py-3">
                <Select
                  value={user.role}
                  options={ROLE_OPTIONS}
                  onChange={(e) => onRoleChange?.(user, e.target.value)}
                  disabled={actionPending}
                  className="min-w-[120px]"
                />
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.isPremium ? "primary" : "muted"}>
                  {user.isPremium ? "Premium" : "Free"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-on-surface-variant">{user.promptCount ?? 0}</td>
              <td className="px-4 py-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete?.(user)}
                  disabled={actionPending}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
