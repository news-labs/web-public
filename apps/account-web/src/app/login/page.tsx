import type { Metadata } from "next";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginPageClient } from "./login-page-client";
import {
  ONBOARDING_MAIN_CLASS,
  ONBOARDING_MAIN_INNER_CLASS,
  ONBOARDING_PAGE_ROOT_CLASS,
} from "@/lib/onboarding-layout";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div className={ONBOARDING_PAGE_ROOT_CLASS}>
      <AuthHeader />
      <main className={ONBOARDING_MAIN_CLASS}>
        <div className={ONBOARDING_MAIN_INNER_CLASS}>
          <LoginPageClient />
        </div>
      </main>
      <AuthFooter />
    </div>
  );
}
