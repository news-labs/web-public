import type { Metadata } from "next";
import { BillingPanel } from "@/components/dashboard/BillingPanel";

export const metadata: Metadata = {
  title: "Billing",
};

export default function DashboardBillingPage() {
  return <BillingPanel />;
}
