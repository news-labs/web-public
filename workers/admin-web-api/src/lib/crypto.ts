export async function createSessionToken(
  payload: Record<string, string>,
  secret: string,
  ttlSeconds = 86400,
): Promise<string> {
  const exp = String(Math.floor(Date.now() / 1000) + ttlSeconds);
  const body = JSON.stringify({ ...payload, exp });
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${btoa(body)}.${sigB64}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<Record<string, string> | null> {
  const [bodyB64, sigB64] = token.split(".");
  if (!bodyB64 || !sigB64) return null;
  const body = atob(bodyB64);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(body));
  if (!valid) return null;
  const payload = JSON.parse(body) as Record<string, string>;
  if (Number(payload.exp) < Math.floor(Date.now() / 1000)) return null;
  return payload;
}
