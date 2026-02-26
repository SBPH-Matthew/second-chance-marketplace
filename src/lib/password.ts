import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto'

const ITERATIONS = 120000
const KEY_LENGTH = 64
const DIGEST = 'sha512'

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex')
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [scheme, rawIterations, salt, originalHash] = stored.split('$')
  if (scheme !== 'pbkdf2' || !rawIterations || !salt || !originalHash) return false

  const iterations = Number(rawIterations)
  if (!Number.isFinite(iterations) || iterations <= 0) return false

  const candidate = pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST).toString('hex')
  return timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(originalHash, 'hex'))
}
