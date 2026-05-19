import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { configSchema } from '@/lib/validation'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data, error } = await supabaseAdmin
    .from('site_config')
    .select('whatsapp_number, creator_email, creator_photo_url')
    .single()
  if (error) return NextResponse.json({ error: 'Could not fetch config' }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    // Allow creator_photo_url to pass through without strict validation
    const { creator_photo_url, ...rest } = body
    const parsed = configSchema.safeParse(rest)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }
    const updateData: Record<string, unknown> = {
      id: 1,
      ...parsed.data,
      updated_at: new Date().toISOString(),
    }
    if (creator_photo_url !== undefined) updateData.creator_photo_url = creator_photo_url
    const { data, error } = await supabaseAdmin
      .from('site_config')
      .upsert(updateData)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Config update error:', error)
    return NextResponse.json({ error: 'Could not update config' }, { status: 500 })
  }
}
