/**
 * Minimal in-memory, fixed-window rate limiter for the form endpoints. Good enough for a
 * single container (Coolify); a shared store would be needed with several instances.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  entry.count++;
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
  }
  return { allowed: entry.count <= limit, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
}

/** Best-effort client IP behind the reverse proxy. */
export function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
