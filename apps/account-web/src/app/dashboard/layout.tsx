import type { ReactNode } from "react";
import { DashboardProvider } from "@/components/dashboard/DashboardProvider";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ServiceUnavailable } from "@/components/ServiceUnavailable";
import { ACCOUNT_API_ENABLED } from "@/lib/account-api";
import {
  ONBOARDING_MAIN_CLASS,
  ONBOARDING_MAIN_INNER_CLASS,
  ONBOARDING_PAGE_ROOT_CLASS,
} from "@/lib/onboarding-layout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Static build: no account API, so skip the provider (it would fetch /api/account/* and loop to /login/).
  if (!ACCOUNT_API_ENABLED) {
    return (
      <div className={ONBOARDING_PAGE_ROOT_CLASS}>
        <AuthHeader />
        <main className={ONBOARDING_MAIN_CLASS}>
          <div className={ONBOARDING_MAIN_INNER_CLASS}>
            <ServiceUnavailable />
          </div>
        </main>
        <AuthFooter />
      </div>
    );
  }

  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
