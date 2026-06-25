"use client";

import Link from "next/link";
import { Crown, MessageSquare, Bookmark, FileText } from "lucide-react";
import { toast } from "react-toastify";
import RoleGuard from "@/components/shared/RoleGuard";
import StatCard from "@/components/dashboard/StatCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import useAuth from "@/hooks/useAuth";
import { useUserProfile, useUpdateProfile } from "@/hooks/useUser";
import { getApiErrorMessage } from "@/lib/apiErrors";
import { useState } from "react";

export default function UserDashboardPage() {
  const { data, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const { refetchUser } = useAuth();
  const profile = data?.data;
  const stats = profile?.stats;
  const [name, setName] = useState("");

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["user", "creator", "admin"]}>
        <div className="flex justify-center py-20">
          <Spinner label="Loading profile..." />
        </div>
      </RoleGuard>
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
    <RoleGuard allowedRoles={["user", "creator", "admin"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-[28px] font-bold text-primary">Overview</h1>
          <p className="mt-1 text-on-surface-variant">
            Manage your profile, saved prompts, and reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Saved Prompts" value={stats?.bookmarkCount ?? 0} icon={Bookmark} />
          <StatCard label="My Reviews" value={stats?.reviewCount ?? 0} icon={MessageSquare} />
          <StatCard label="Prompts Created" value={stats?.totalPrompts ?? 0} icon={FileText} />
          <StatCard
            label="Subscription"
            value={stats?.subscription ?? "Free"}
            icon={Crown}
            hint={profile?.isPremium ? "Lifetime access" : "Upgrade for private prompts"}
          />
        </div>

        <section className="rounded-2xl border border-outline-variant/15 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[20px] font-semibold text-on-surface">Profile</h2>
            <Badge variant={profile?.isPremium ? "primary" : "muted"}>
              {profile?.isPremium ? "Premium" : "Free plan"}
            </Badge>
          </div>

          <form onSubmit={handleSave} className="grid max-w-xl gap-4">
            <Input
              label="Name"
              value={displayName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <Input label="Email" value={profile?.email || ""} disabled />
            <Input label="Role" value={profile?.role || ""} disabled />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Profile"}
              </Button>
              {!profile?.isPremium && (
                <Link href="/pricing">
                  <Button type="button" variant="outline">
                    <Crown className="h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              )}
            </div>
          </form>
        </section>
      </div>
    </RoleGuard>
  );
}
