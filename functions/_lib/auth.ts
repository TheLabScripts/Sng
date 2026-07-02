import type { CrawlerEnv } from "./crawler/types.ts";

export type AuthUser = { id: string; role: "user" | "admin" };

function base64UrlBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function verifyJwt(token: string, secret: string): Promise<AuthUser | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(new TextDecoder().decode(base64UrlBytes(parts[0]))) as { alg?: string };
    const payload = JSON.parse(new TextDecoder().decode(base64UrlBytes(parts[1]))) as { sub?: string; exp?: number; role?: string };
    if (header.alg !== "HS256" || !payload.sub || (payload.exp && payload.exp * 1000 <= Date.now())) return null;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("HMAC", key, base64UrlBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    return valid ? { id: payload.sub, role: payload.role === "admin" ? "admin" : "user" } : null;
  } catch { return null; }
}

export async function authenticateRequest(request: Request, env: CrawlerEnv): Promise<AuthUser> {
  const authorization = request.headers.get("Authorization") || "";
  if (authorization.startsWith("Bearer ") && env.AUTH_JWT_SECRET) {
    const user = await verifyJwt(authorization.slice(7), env.AUTH_JWT_SECRET);
    if (user) return user;
  }
  if (env.ALLOW_DEV_AUTH?.toLowerCase() === "true") {
    const devUser = request.headers.get("X-Snagd-Dev-User")?.trim();
    if (devUser) return { id: devUser.slice(0, 128), role: request.headers.get("X-Snagd-Dev-Role") === "admin" ? "admin" : "user" };
  }
  throw new Response(JSON.stringify({ error: "Authentication required." }), { status: 401, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

export function requireAdmin(user: AuthUser) {
  if (user.role !== "admin") throw new Response(JSON.stringify({ error: "Admin access required." }), { status: 403, headers: { "Content-Type": "application/json; charset=utf-8" } });
}
