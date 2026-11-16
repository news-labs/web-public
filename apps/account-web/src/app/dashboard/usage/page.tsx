import type { Metadata } from "next";
import { UsagePanel } from "@/components/dashboard/UsagePanel";

export const metadata: Metadata = {
  title: "Usage",
};

export default function DashboardUsagePage() {
  return <UsagePanel />;
}
