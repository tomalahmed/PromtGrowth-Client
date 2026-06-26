"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Settings, User } from "lucide-react";
import { toast } from "react-toastify";
import UserFormCard, { UserPageHeader } from "@/components/dashboard/user/UserPageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import useAuth from "@/hooks/useAuth";
import { useUserProfile, useUpdateProfile } from "@/hooks/useUser";
import { getApiErrorMessage } from "@/lib/apiErrors";
import { getInitials } from "@/lib/promptUtils";

export default function UserSettingsPanel() {
  const { data, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const { user, refetchUser } = useAuth();
  const profile = data?.data;
  const [name, setName] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner label="Loading settings..." />
      </div>
    );
  }

  const displayName = name || profile?.name || "";

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name: displayName, photoURL: profile?.photoURL });
      await refetchUser();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile"));
    }
  };

  return (
    <>
      <UserPageHeader
        title="Settings"
        subtitle="Manage your profile and subscription preferences."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <UserFormCard title="Profile" icon={User}>
          <form onSubmit={handleSave} className="max-w-xl space-y-4">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <Input label="Email" value={profile?.email || ""} disabled />
            <Input label="Account Role" value={profile?.role || ""} disabled />
            <div className="flex flex-wrap gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </motion.div>
            </div>
          </form>
        </UserFormCard>

        <div className="space-y-6">
          <UserFormCard title="Account" icon={Settings}>
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-lg font-bold text-on-primary">
                  {getInitials(user?.name)}
                </div>
              )}
              <div>
                <p className="font-semibold text-on-surface">{user?.name}</p>
                <p className="text-[13px] text-on-surface-variant">{user?.email}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-outline-variant/15 bg-surface-container-low/50 px-4 py-3">
              <div>
                <p className="text-[14px] font-semibold text-on-surface">Plan</p>
                <p className="text-[12px] text-on-surface-variant">
                  {profile?.isPremium ? "Lifetime premium access" : "Free account"}
                </p>
              </div>
              <Badge variant={profile?.isPremium ? "primary" : "muted"}>
                {profile?.isPremium ? "Premium" : "Free"}
              </Badge>
            </div>

            {!profile?.isPremium && (
              <Link href="/pricing" className="mt-4 block">
                <Button variant="outline" className="w-full gap-2">
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </UserFormCard>
        </div>
      </div>
    </>
  );
}
