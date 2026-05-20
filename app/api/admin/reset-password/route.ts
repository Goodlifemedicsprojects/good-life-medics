import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed } = rateLimit(`reset-password:${ip}`, 5, 900_000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many attempts. Please wait.' }, { status: 429 })
  }

  try {
    const { token, newPassword } = await req.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Look up the token in DB
    const { data: settings, error } = await supabaseAdmin
      .from('admin_settings')
      .select('reset_token, reset_token_expires_at')
      .eq('id', 1)
      .single()

    if (error || !settings) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    // Verify token matches
    if (settings.reset_token !== token) {
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 })
    }

    // Verify token not expired
    const expiresAt = new Date(settings.reset_token_expires_at)
    if (Date.now() > expiresAt.getTime()) {
      return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
    }

    // Hash new password and save to DB
    const newHash = await hashPassword(newPassword)

    await supabaseAdmin
      .from('admin_settings')
      .update({
        password_hash: newHash,
        reset_token: null,
        reset_token_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
