"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AdminPageHeader } from "@/components/dashboard/admin/AdminPageHeader";
import AdminUserTable from "@/components/dashboard/admin/AdminUserTable";
import AdminToolbar from "@/components/dashboard/admin/AdminToolbar";
import Spinner from "@/components/ui/Spinner";
import {
  useAdminUsers,
  useDeleteUser,
  useUpdateUserRole,
} from "@/hooks/useUser";
import { getApiErrorMessage } from "@/lib/apiErrors";

export default function AdminUsersPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminUsers(1, 50);
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const users = data?.data || [];

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [users, search]);

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
    <>
      <AdminPageHeader
        title="User Management"
        subtitle="View, modify roles, and manage all registered accounts on the platform."
      >
        <AdminToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users by name or email..."
          filterLabel="Filter"
        />
      </AdminPageHeader>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading users..." />
        </div>
      ) : (
        <AdminUserTable
          users={filteredUsers}
          onRoleChange={handleRoleChange}
          onDelete={handleDelete}
          actionPending={updateRole.isPending || deleteUser.isPending}
        />
      )}
    </>
  );
}
