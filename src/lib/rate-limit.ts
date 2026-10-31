/**
 * Fixed-window, in-memory rate limiter: one allowed hit per key per window.
 *
 * Best-effort only. On Vercel each serverless instance has its own memory, so
 * the limit is per instance and resets on cold start. For durable limits use a
 * Vercel Firewall rate-limit rule or a shared store. Memory is bounded: expired
 * entries are pruned, and at most `maxKeys` keys are held (oldest evicted first).
 */
export type RateLimitResult = { allowed: boolean; retryAfterMs: number };

export function createRateLimiter({
  windowMs,
  maxKeys = 10_000,
}: {
  windowMs: number;
  maxKeys?: number;
}) {
  // key -> timestamp of the allowed hit that opened its window.
  // Map iteration order is insertion order, so the first entry is the oldest.
  const hits = new Map<string, number>();

  function prune(now: number) {
    for (const [key, start] of hits) {
      if (now - start >= windowMs) hits.delete(key);
    }
  }

  function check(key: string, now: number = Date.now()): RateLimitResult {
    const start = hits.get(key);
    if (start !== undefined && now - start < windowMs) {
      return { allowed: false, retryAfterMs: windowMs - (now - start) };
    }

    hits.delete(key); // re-insert so this key becomes the newest
    if (hits.size >= maxKeys) prune(now);
    while (hits.size >= maxKeys) {
      const oldest = hits.keys().next().value as string;
      hits.delete(oldest);
    }
    hits.set(key, now);
    return { allowed: true, retryAfterMs: 0 };
  }

  return { check, size: () => hits.size };
}
