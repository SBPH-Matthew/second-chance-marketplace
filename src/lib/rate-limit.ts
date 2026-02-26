const inMemoryCounter = new Map<string, { count: number; resetAt: number }>()

export function enforceSimpleRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const record = inMemoryCounter.get(key)

  if (!record || record.resetAt <= now) {
    inMemoryCounter.set(key, { count: 1, resetAt: now + windowMs })
    return
  }

  if (record.count >= limit) {
    throw new Error('Rate limit exceeded')
  }

  record.count += 1
}
