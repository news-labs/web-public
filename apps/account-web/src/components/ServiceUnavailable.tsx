import { ONBOARDING_PANEL_CLASS } from "@/lib/onboarding-layout";
import { API_DOCS_URL } from "@/lib/account-urls";

/**
 * Shown instead of the login/signup forms and the dashboard while the account API is offline
 * (builds without `NEXT_PUBLIC_ACCOUNT_API_ENABLED=1`).
 */
export function ServiceUnavailable() {
  return (
    <div className={ONBOARDING_PANEL_CLASS} role="status">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Accounts temporarily unavailable</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign-in, sign-up and the developer dashboard are offline while we move our infrastructure.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Need help now? Email{" "}
        <a href="mailto:hello@newsfork.com" className="font-medium text-foreground underline-offset-2 hover:underline">
          hello@newsfork.com
        </a>{" "}
        or read the{" "}
        <a href={API_DOCS_URL} className="font-medium text-foreground underline-offset-2 hover:underline">
          documentation
        </a>
        .
      </p>
    </div>
  );
}
