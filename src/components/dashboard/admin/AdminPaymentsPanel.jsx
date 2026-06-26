"use client";

import { AdminPageHeader } from "@/components/dashboard/admin/AdminPageHeader";
import AdminPaymentsTable from "@/components/dashboard/admin/AdminPaymentsTable";
import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import Spinner from "@/components/ui/Spinner";
import { useAdminPayments } from "@/hooks/useAdmin";
import { useAdminAnalytics } from "@/hooks/useUser";
import { CreditCard, DollarSign } from "lucide-react";

export default function AdminPaymentsPanel() {
  const { data, isLoading } = useAdminPayments(1, 50);
  const { data: analyticsData } = useAdminAnalytics();
  const payments = data?.data || [];
  const totals = analyticsData?.data?.totals;

  return (
    <>
      <AdminPageHeader
        title="All Payments"
        subtitle="Stripe checkout transactions and premium upgrades."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminStatCard
          index={0}
          label="Total Revenue"
          value={`$${((totals?.revenue ?? 0) / 100).toFixed(2)}`}
          icon={DollarSign}
          accent="revenue"
        />
        <AdminStatCard
          index={1}
          label="Paid Transactions"
          value={totals?.paidPayments ?? payments.length}
          icon={CreditCard}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading payments..." />
        </div>
      ) : (
        <AdminPaymentsTable payments={payments} />
      )}
    </>
  );
}
