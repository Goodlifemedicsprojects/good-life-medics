import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEbookEmail, sendNewSubscriberAlert } from '@/lib/resend'
import { subscribeSchema, sanitizeString } from '@/lib/validation'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — max 5 requests per IP per minute
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const { allowed } = rateLimit(`subscribe:${ip}`, 5, 60_000)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    // Parse and validate input
    const body = await req.json()
    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { name, email, ebookId } = parsed.data
    const safeName = sanitizeString(name)

    // Get ebook from DB
    const { data: ebook, error: ebookError } = await supabaseAdmin
      .from('ebooks')
      .select('id, title, drive_link, type')
      .eq('id', ebookId)
      .eq('type', 'free')
      .single()

    if (ebookError || !ebook) {
      return NextResponse.json({ error: 'Ebook not found' }, { status: 404 })
    }

    if (!ebook.drive_link) {
      return NextResponse.json({ error: 'Ebook link not available' }, { status: 400 })
    }

    // Save subscriber (upsert to avoid duplicates)
    const { error: subError } = await supabaseAdmin
      .from('subscribers')
      .upsert(
        { name: safeName, email, ebook_title: ebook.title, source: 'ebook_card' },
        { onConflict: 'email', ignoreDuplicates: false }
      )

    if (subError) {
      console.error('Subscriber save error:', subError)
    }

    // Send ebook email to subscriber
    await sendEbookEmail(email, safeName, ebook.title, ebook.drive_link)

    // Notify creator
    await sendNewSubscriberAlert(safeName, email, ebook.title)

    return NextResponse.json({ success: true, driveLink: ebook.drive_link })

  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
