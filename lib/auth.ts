import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = 'glm_admin_token'

// ---- Password hashing using built-in Node.js crypto ----
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

// Get the active password hash — checks DB first, falls back to env var
// This allows password reset without redeploying
export async function getActivePasswordHash(): Promise<string> {
  try {
    const { supabaseAdmin } = await import('./supabase')
    const { data } = await supabaseAdmin
      .from('admin_settings')
      .select('password_hash')
      .eq('id', 1)
      .single()
    if (data?.password_hash) return data.password_hash
  } catch { /* fall through to env var */ }
  return process.env.ADMIN_PASSWORD_HASH!
}

// ---- JWT ----
export function generateToken(): string {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): boolean {
  try { jwt.verify(token, JWT_SECRET); return true } catch { return false }
}

// ---- Cookies — async in Next.js 15 ----
export async function setAdminCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function getAdminCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = await getAdminCookie()
  if (!token) return false
  return verifyToken(token)
}
