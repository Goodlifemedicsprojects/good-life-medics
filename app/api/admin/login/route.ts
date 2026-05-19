import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken, setAdminCookie, clearAdminCookie } from '@/lib/auth'
import { adminLoginSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rateLimit'

// POST — login
export async function POST(req: NextRequest) {
  try {
    // Strict rate limiting for login — 5 attempts per 15 minutes
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const { allowed } = rateLimit(`admin-login:${ip}`, 5, 900_000)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 15 minutes.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = adminLoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { password } = parsed.data
    const hash = process.env.ADMIN_PASSWORD_HASH!

    const valid = await verifyPassword(password, hash)
    if (!valid) {
      // Generic error — don't reveal if password or username was wrong
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = generateToken()
    setAdminCookie(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

// DELETE — logout
export async function DELETE() {
  clearAdminCookie()
  return NextResponse.json({ success: true })
}
