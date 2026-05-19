import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken, setAdminCookie, clearAdminCookie, getActivePasswordHash } from '@/lib/auth'
import { adminLoginSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
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
    // Check DB first, then env var — allows password reset without redeploy
    const hash = await getActivePasswordHash()
    const valid = await verifyPassword(password, hash)

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = generateToken()
    await setAdminCookie(token)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  await clearAdminCookie()
  return NextResponse.json({ success: true })
}
