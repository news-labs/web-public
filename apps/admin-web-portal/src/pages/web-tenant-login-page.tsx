import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { Button, Input } from "@core-labs/admin-shell";
import { loginWebTenantUser, type WebTenantSession } from "../lib/tenant-session";
import { WEB_PORTAL } from "../portal.config";

interface WebTenantLoginPageProps {
  onSuccess: (session: WebTenantSession) => void;
}

export function WebTenantLoginPage({ onSuccess }: WebTenantLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const cpApiBase = import.meta.env.VITE_CP_API_URL ?? WEB_PORTAL.apiBaseUrl;
      const session = await loginWebTenantUser(cpApiBase, email, password);
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Globe className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Web Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Sign in as webmaster or designer</p>
        </div>

        <form onSubmit={(e) => void handleLogin(e)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading || !email || !password}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
