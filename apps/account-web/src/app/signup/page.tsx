import type { Metadata } from "next";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SignupPageClient } from "./signup-page-client";
import {
  ONBOARDING_MAIN_CLASS,
  ONBOARDING_MAIN_INNER_CLASS,
  ONBOARDING_PAGE_ROOT_CLASS,
} from "@/lib/onboarding-layout";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <div className={ONBOARDING_PAGE_ROOT_CLASS}>
      <AuthHeader />
      <main className={ONBOARDING_MAIN_CLASS}>
        <div className={ONBOARDING_MAIN_INNER_CLASS}>
          <SignupPageClient />
        </div>
      </main>
      <AuthFooter />
    </div>
  );
}
