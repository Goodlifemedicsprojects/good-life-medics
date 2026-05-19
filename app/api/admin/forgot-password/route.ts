import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { rateLimit } from '@/lib/rateLimit'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed } = rateLimit(`forgot-password:${ip}`, 3, 900_000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait 15 minutes.' },
      { status: 429 }
    )
  }

  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check email matches the configured admin email
    const adminEmail = process.env.CREATOR_EMAIL!
    if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json({ success: true })
    }

    // Generate secure token — expires in 1 hour
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    // Save token to DB
    await supabaseAdmin
      .from('admin_settings')
      .upsert({
        id: 1,
        reset_token: token,
        reset_token_expires_at: expiresAt,
        admin_email: email.toLowerCase().trim(),
        updated_at: new Date().toISOString(),
      })

    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://good-life-medics.vercel.app'
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    // Send reset email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '🔐 Reset Your Good Life Medics Admin Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"/></head>
        <body style="font-family:'DM Sans',Arial,sans-serif;background:#f7fafa;margin:0;padding:0;">
          <div style="max-width:520px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #d0e4e4;">
            <div style="background:linear-gradient(135deg,#0a5c5c,#0e8080);padding:32px;text-align:center;">
              <h1 style="color:white;font-size:22px;margin:0 0 6px;">Good Life Medics</h1>
              <p style="color:rgba(255,255,255,0.8);margin:0;font-size:13px;">Admin Dashboard</p>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#0d1f1f;font-size:20px;margin:0 0 12px;">Password Reset Request</h2>
              <p style="color:#5a7070;font-size:15px;line-height:1.6;margin:0 0 24px;">
                You requested a password reset for the Good Life Medics admin dashboard.
                Click the button below to set a new password.
              </p>
              <div style="text-align:center;margin-bottom:24px;">
                <a href="${resetUrl}"
                  style="background:#0a5c5c;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
                  🔐 Reset My Password
                </a>
              </div>
              <div style="background:#f7fafa;border-radius:10px;padding:16px;margin-bottom:20px;">
                <p style="color:#5a7070;font-size:12px;margin:0 0 6px;font-weight:600;">Or copy this link:</p>
                <p style="color:#0a5c5c;font-size:11px;margin:0;word-break:break-all;">${resetUrl}</p>
              </div>
              <p style="color:#aab5b5;font-size:12px;margin:0;">
                ⏱ This link expires in <strong>1 hour</strong>.<br/>
                If you did not request this, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
