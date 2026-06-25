"use client";

import RoleGuard from "@/components/shared/RoleGuard";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import { useAdminPayments } from "@/hooks/useAdmin";
import { formatPromptDate } from "@/lib/promptUtils";

export default function AdminPaymentsPage() {
  const { data, isLoading } = useAdminPayments();
  const payments = data?.data || [];

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-primary">Payments</h1>
          <p className="mt-1 text-on-surface-variant">
            Stripe checkout transactions and premium upgrades.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Loading payments..." />
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/15 bg-white p-10 text-center text-on-surface-variant">
            No payments recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-outline-variant/15 bg-white shadow-sm">
            <table className="min-w-full text-left text-[14px]">
              <thead className="border-b border-outline-variant/15 bg-surface-container-low/50 text-[12px] uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3 font-semibold">Session ID</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Paid At</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-b border-outline-variant/10 last:border-0">
                    <td className="px-4 py-3 font-mono text-[12px] text-on-surface-variant">
                      {payment.stripeSessionId}
                    </td>
                    <td className="px-4 py-3 text-on-surface">{payment.email}</td>
                    <td className="px-4 py-3 text-on-surface">
                      ${(payment.amount / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={payment.status === "paid" ? "primary" : "muted"}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {formatPromptDate(payment.paidAt || payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
