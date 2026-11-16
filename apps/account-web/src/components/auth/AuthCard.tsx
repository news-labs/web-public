"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ONBOARDING_PANEL_CLASS } from "@/lib/onboarding-layout";
import { ACCOUNT_SIGNIN_URL, ACCOUNT_SIGNUP_URL, DASHBOARD_PATH, EMAIL_RE } from "@/lib/account-urls";
import { accountApi, describeError } from "@/lib/account-api";

export type AuthFlow = "login" | "signup";

interface AuthCardProps {
  flow: AuthFlow;
  initialEmail?: string;
  plan?: string;
  /** Post-login destination (CMS / hub push); sanitized server-side by the BFF. */
  returnUrl?: string;
}

const INPUT_CLASS =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2";

export function AuthCard({ flow, initialEmail = "", plan, returnUrl }: AuthCardProps) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isLogin = flow === "login";
  const wantsPro = plan === "pro" || plan === "pro_monthly" || plan === "pro_annual";
  const title = step === "code" ? "Check your email" : isLogin ? "Log in" : "Create account";
  const subtitle =
    step === "code"
      ? `We sent a 6-digit code to ${email}. It expires in 10 minutes.`
      : isLogin
        ? wantsPro
          ? "Log in to continue to Pro checkout. We will email you a one-time code."
          : "We will email you a one-time code — no password needed."
        : wantsPro
          ? "Create your account, then continue to a 14-day Pro trial. A card is required at checkout; you will not be charged until the trial ends."
          : "Free plan: 1,000 requests per month, no credit card required.";

  const switchHref = (() => {
    const url = new URL(isLogin ? ACCOUNT_SIGNUP_URL : ACCOUNT_SIGNIN_URL);
    if (plan) url.searchParams.set("plan", plan);
    if (returnUrl) url.searchParams.set("return_url", returnUrl);
    return url.toString();
  })();

  async function sendCode(event?: FormEvent) {
    event?.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await accountApi.requestCode(normalized);
      setEmail(normalized);
      setStep("code");
      setNotice(res.debugCode ? `Development code: ${res.debugCode}` : null);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  }

  async function verify(event: FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from the email.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await accountApi.verify({
        email,
        code: code.trim(),
        name: name.trim() || undefined,
        company: company.trim() || undefined,
        returnUrl,
      });
      if (res.next) {
        window.location.assign(res.next);
        return;
      }
      const next = new URL(DASHBOARD_PATH, window.location.origin);
      if (plan) next.searchParams.set("plan", plan);
      window.location.assign(next.pathname + next.search);
    } catch (err) {
      setError(describeError(err));
      setBusy(false);
    }
  }

  return (
    <div className={ONBOARDING_PANEL_CLASS}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

      {error && (
        <div className="mt-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="mt-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
          {notice}
        </div>
      )}

      {step === "email" ? (
        <form className="mt-6 space-y-4" onSubmit={sendCode}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className={INPUT_CLASS}
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Name <span className="text-muted-foreground">(optional)</span>
                </label>
                <input id="name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground">
                  Company <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            </>
          )}
          <Button type="submit" variant="accent" size="lg" disabled={busy}>
            {busy ? "Sending…" : isLogin ? "Email me a code" : "Continue"}
          </Button>
        </form>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={verify}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-foreground">
              Verification code
            </label>
            <input
              id="code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ""));
                setError(null);
              }}
              className={`${INPUT_CLASS} tracking-[0.4em]`}
            />
          </div>
          <Button type="submit" variant="accent" size="lg" disabled={busy}>
            {busy ? "Verifying…" : "Verify and continue"}
          </Button>
          <div className="flex justify-between text-sm">
            <button
              type="button"
              className="text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => {
                setStep("email");
                setCode("");
                setNotice(null);
              }}
            >
              Use a different email
            </button>
            <button
              type="button"
              className="font-medium text-foreground underline-offset-2 hover:underline disabled:opacity-50"
              disabled={busy}
              onClick={() => void sendCode()}
            >
              Resend code
            </button>
          </div>
        </form>
      )}

      {step === "email" && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "New to Newsfork API? " : "Already have an account? "}
          <Link href={switchHref} className="font-medium text-foreground underline-offset-2 hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      )}
    </div>
  );
}
