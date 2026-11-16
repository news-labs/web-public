import type { Metadata } from "next";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";

export const metadata: Metadata = {
  title: "Overview",
};

export default function DashboardOverviewPage() {
  return <OverviewPanel />;
}
