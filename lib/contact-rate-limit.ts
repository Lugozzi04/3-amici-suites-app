type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, RateLimitEntry>();

export function checkContactRateLimit(
  key: string,
  options: {
    limit?: number;
    windowMs?: number;
  } = {},
) {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 10 * 60 * 1000;
  const now = Date.now();
  const existing = attempts.get(key);

  if (!existing || existing.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true as const, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return {
      allowed: false as const,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  attempts.set(key, existing);

  return {
    allowed: true as const,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

export function getClientRateLimitKey(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const key = forwarded?.split(",")[0]?.trim() || realIp || "unknown";

  return key.toLowerCase();
}
