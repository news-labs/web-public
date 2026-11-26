import { useState, type FormEvent } from "react";
import { Globe } from "lucide-react";
import { Button, Input, useTurnstile } from "@core-labs/admin-shell";
import {
  loginWebTenantPassword,
  type WebTenantSession,
} from "../lib/tenant-session";
import { WEB_PORTAL } from "../portal.config";

interface WebTenantLoginPageProps {
  onSuccess: (session: WebTenantSession) => void;
}

export function WebTenantLoginPage({ onSuccess }: WebTenantLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cpApiBase = import.meta.env.VITE_CP_API_URL ?? WEB_PORTAL.apiBaseUrl;
  const turnstile = useTurnstile(cpApiBase);

  const signIn = async () => {
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    if (turnstile.required && !turnstile.token) {
      setError("Complete the security check and try again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const session = await loginWebTenantPassword(
        cpApiBase,
        email.trim().toLowerCase(),
        password,
        turnstile.token,
      );
      setPassword("");
      if (session.tenants.length === 0) {
        setError("No web admin tenants assigned to your account.");
        return;
      }
      onSuccess(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      turnstile.reset();
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void signIn();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Globe className="h-6 w-6" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold">Web Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Email + password for webmaster / designer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          {turnstile.widget}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Platform operators: use the unified login at admin.newsfork.com.
          </p>
        </form>
      </div>
    </div>
  );
}
