import type { Metadata } from "next";
import { KeysPanel } from "@/components/dashboard/KeysPanel";

export const metadata: Metadata = {
  title: "API keys",
};

export default function DashboardKeysPage() {
  return <KeysPanel />;
}
