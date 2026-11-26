import type { Metadata } from "next";
import { BillingPanel } from "@/components/dashboard/BillingPanel";
import { BILLING_ENABLED } from "@/lib/account-api";

export const metadata: Metadata = {
  title: "Billing",
};

export default function DashboardBillingPage() {
  if (!BILLING_ENABLED) {
    return <p className="text-sm text-muted-foreground">Paid plans are not available yet.</p>;
  }
  return <BillingPanel />;
}
