import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = 'glm_admin_token'

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(32)
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) reject(err)
      else resolve('scrypt:' + salt.toString('hex') + ':' + derived.toString('hex'))
    })
  })
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const parts = storedHash.split(':')
    if (parts.length !== 3 || parts[0] !== 'scrypt') { resolve(false); return }
    const [, saltHex, hashHex] = parts
    const salt = Buffer.from(saltHex, 'hex')
    const expected = Buffer.from(hashHex, 'hex')
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) reject(err)
      else resolve(derived.length === expected.length && crypto.timingSafeEqual(derived, expected))
    })
  })
}

export function generateToken(): string {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): boolean {
  try { jwt.verify(token, JWT_SECRET); return true } catch { return false }
}

export function setAdminCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export function getAdminCookie(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME)
}

export function isAdminAuthenticated(): boolean {
  const token = getAdminCookie()
  if (!token) return false
  return verifyToken(token)
}
