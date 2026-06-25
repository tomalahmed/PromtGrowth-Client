"use client";

import { toast } from "react-toastify";
import RoleGuard from "@/components/shared/RoleGuard";
import UserTable from "@/components/dashboard/UserTable";
import Spinner from "@/components/ui/Spinner";
import {
  useAdminUsers,
  useDeleteUser,
  useUpdateUserRole,
} from "@/hooks/useUser";
import { getApiErrorMessage } from "@/lib/apiErrors";

export default function AdminUsersPage() {
  const { data, isLoading } = useAdminUsers();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const users = data?.data || [];

  const handleRoleChange = async (user, role) => {
    try {
      await updateRole.mutateAsync({ userId: user._id, role });
      toast.success("Role updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update role"));
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user ${user.email}?`)) return;

    try {
      await deleteUser.mutateAsync(user._id);
      toast.success("User deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete user"));
    }
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-primary">Users</h1>
          <p className="mt-1 text-on-surface-variant">
            Manage roles and remove accounts from the platform.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Loading users..." />
          </div>
        ) : (
          <UserTable
            users={users}
            onRoleChange={handleRoleChange}
            onDelete={handleDelete}
            actionPending={updateRole.isPending || deleteUser.isPending}
          />
        )}
      </div>
    </RoleGuard>
  );
}
