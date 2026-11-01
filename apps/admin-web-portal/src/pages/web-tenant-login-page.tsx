import { useEffect, useState, type FormEvent } from "react";
import { Globe } from "lucide-react";
import { Button, Input } from "@core-labs/admin-shell";
import {
  loginWebTenantOtp,
  requestWebTenantOtp,
  type WebTenantSession,
} from "../lib/tenant-session";
import { WEB_PORTAL } from "../portal.config";

interface WebTenantLoginPageProps {
  onSuccess: (session: WebTenantSession) => void;
}

export function WebTenantLoginPage({ onSuccess }: WebTenantLoginPageProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const cpApiBase = import.meta.env.VITE_CP_API_URL ?? WEB_PORTAL.apiBaseUrl;

  const sendCode = async () => {
    setLoading(true);
    setError("");
    try {
      const seconds = await requestWebTenantOtp(cpApiBase, email.trim().toLowerCase());
      setStep("code");
      setCode("");
      setCooldown(seconds);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    setError("");
    try {
      const session = await loginWebTenantOtp(cpApiBase, email.trim().toLowerCase(), code.trim());
      if (session.tenants.length === 0) {
        setError("No web admin tenants assigned to your account.");
        return;
      }
      onSuccess(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step === "email") void sendCode();
    else void verify();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Globe className="h-6 w-6" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold">Web Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Email OTP for webmaster / designer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || step === "code"}
              autoFocus
              required
            />
          </div>
          {step === "code" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="code">
                Login code
              </label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                disabled={loading}
                required
              />
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {step === "email" ? (loading ? "Sending…" : "Send code") : loading ? "Signing in…" : "Sign in"}
          </Button>

          {step === "code" ? (
            <div className="flex justify-between text-sm">
              <button
                type="button"
                className="text-muted-foreground underline-offset-4 hover:underline"
                onClick={() => {
                  setStep("email");
                  setCode("");
                }}
                disabled={loading}
              >
                Use another email
              </button>
              <button
                type="button"
                className="text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
                onClick={() => void sendCode()}
                disabled={loading || cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
