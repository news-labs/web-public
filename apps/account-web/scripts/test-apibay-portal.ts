import {
  buildApibayGoogleOauthUrl,
  buildApibayPortalUrl,
  getApibayPortalConfig,
  sanitizeReturnUrl,
} from "../functions/lib/apibay-portal";

const config = getApibayPortalConfig();

const signup = buildApibayPortalUrl(
  "signup",
  config,
  new URLSearchParams("plan=pro&email=test@example.com"),
);
if (!signup.includes("api.newsfork.com/signup") || !signup.includes("plan=pro")) {
  throw new Error(`signup URL failed: ${signup}`);
}

const login = buildApibayPortalUrl("login", config, new URLSearchParams("email=user@example.com"));
if (!login.includes("/login") || !login.includes("email=user")) {
  throw new Error(`login URL failed: ${login}`);
}

const oauth = buildApibayGoogleOauthUrl("signup", config, new URLSearchParams("plan=pro"));
if (!oauth.includes("/oauth/google") || !oauth.includes("plan=pro")) {
  throw new Error(`oauth URL failed: ${oauth}`);
}

const blocked = sanitizeReturnUrl("https://evil.example/phish", config.accountOrigin);
if (blocked !== null) throw new Error("allowlist should block evil host");

const allowed = sanitizeReturnUrl("https://api.newsfork.com/dashboard", config.accountOrigin);
if (!allowed) throw new Error("allowlist should permit api.newsfork.com");

console.log("✅ apibay-portal URL builders OK");
