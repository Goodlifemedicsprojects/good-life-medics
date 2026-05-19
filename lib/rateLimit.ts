// Simple in-memory rate limiter
// For production scale, replace with Upstash Redis

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  Array.from(store.keys()).forEach(key => {
    const entry = store.get(key)
    if (entry && now > entry.resetAt) store.delete(key)
  })
}, 600_000)
