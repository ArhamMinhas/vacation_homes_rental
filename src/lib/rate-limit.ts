/**
 * In-process fixed-window rate limiter.
 *
 * Works for single-server and local dev out of the box.
 * For serverless / multi-instance deployments (Vercel, AWS Lambda) replace the
 * store with Upstash Redis: https://github.com/upstash/ratelimit-js
 */

interface Window {
  count: number
  resetAt: number
}

const store = new Map<string, Window>()

// Prune expired entries every 5 minutes so the Map never grows unbounded.
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now()
    for (const [key, w] of store) {
      if (w.resetAt < now) store.delete(key)
    }
  }, 5 * 60 * 1000)
  // Don't prevent Node.js from exiting cleanly during tests / shutdown.
  if (timer && typeof (timer as NodeJS.Timeout).unref === "function") {
    (timer as NodeJS.Timeout).unref()
  }
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  /** Milliseconds until the window resets (only meaningful when success=false) */
  retryAfterMs: number
}

/**
 * Fixed-window counter keyed by an arbitrary string.
 * @param key      Unique key per (action + client identifier), e.g. `"login:1.2.3.4"`
 * @param max      Maximum allowed calls within the window
 * @param windowMs Window length in milliseconds
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || existing.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: max - 1, retryAfterMs: 0 }
  }

  if (existing.count >= max) {
    return {
      success: false,
      remaining: 0,
      retryAfterMs: existing.resetAt - now,
    }
  }

  existing.count++
  return {
    success: true,
    remaining: max - existing.count,
    retryAfterMs: 0,
  }
}

/**
 * Extract the real client IP from a Request, handling reverse-proxy headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}
