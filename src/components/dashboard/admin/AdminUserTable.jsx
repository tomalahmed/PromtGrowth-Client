"use client";

import { motion } from "framer-motion";
import { Pencil, Shield, Trash2, User as UserIcon, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import { getInitials } from "@/lib/promptUtils";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "creator", label: "Creator" },
  { value: "admin", label: "Admin" },
];

const ROLE_ICONS = {
  admin: Shield,
  creator: Pencil,
  user: UserIcon,
};

export default function AdminUserTable({
  users = [],
  onRoleChange,
  onDelete,
  actionPending = false,
}) {
  if (users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/30 bg-white px-8 py-16 text-center"
      >
        <Users className="mb-3 h-10 w-10 text-primary-container/50" strokeWidth={1.5} />
        <p className="text-[15px] font-semibold text-primary">No users found</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-white shadow-[0_8px_32px_-8px_rgba(21,82,30,0.1)]"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[14px]">
          <thead className="border-b border-outline-variant/15 bg-[#f4f9ee] text-[11px] uppercase tracking-wider text-primary">
            <tr>
              <th className="px-5 py-3.5 font-semibold">User</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Role</th>
              <th className="px-5 py-3.5 font-semibold">Joined</th>
              <th className="px-5 py-3.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const RoleIcon = ROLE_ICONS[user.role] || UserIcon;

              return (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="border-b border-outline-variant/10 transition-colors last:border-0 hover:bg-surface-container-low/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container/15 text-[12px] font-bold text-primary-container">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-on-surface">{user.name}</p>
                        <p className="text-[12px] text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={user.isPremium ? "primary" : "muted"}>
                      {user.isPremium ? "Active" : "Free"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <RoleIcon className="h-4 w-4 text-primary-container" strokeWidth={1.75} />
                      <Select
                        value={user.role}
                        options={ROLE_OPTIONS}
                        onChange={(e) => onRoleChange?.(user, e.target.value)}
                        disabled={actionPending}
                        className="min-w-[120px]"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">
                    {user.createdAt
                      ? new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(user.createdAt))
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete?.(user)}
                      disabled={actionPending}
                      className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      aria-label={`Delete ${user.name}`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-outline-variant/15 bg-surface-container-low/30 px-5 py-3 text-[13px] text-on-surface-variant">
        Showing {users.length} users
      </div>
    </motion.div>
  );
}
