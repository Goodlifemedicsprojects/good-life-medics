import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { ebookSchema, sanitizeString } from '@/lib/validation'

// GET — public, fetches all ebooks
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('ebooks')
      .select('id, title, description, cover_url, type, price, drive_link')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Ebooks fetch error:', error)
    return NextResponse.json({ error: 'Could not fetch ebooks.' }, { status: 500 })
  }
}

// POST — admin only, create new ebook
export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = ebookSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { title, description, type, drive_link, price, cover_url } = parsed.data

    const { data, error } = await supabaseAdmin
      .from('ebooks')
      .insert({
        title: sanitizeString(title),
        description: sanitizeString(description),
        type,
        drive_link: drive_link ?? null,
        price: price ?? null,
        cover_url: cover_url ?? null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Ebook create error:', error)
    return NextResponse.json({ error: 'Could not create ebook.' }, { status: 500 })
  }
}

// PATCH — admin only, update ebook
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const parsed = ebookSchema.partial().safeParse(updates)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('ebooks')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Ebook update error:', error)
    return NextResponse.json({ error: 'Could not update ebook.' }, { status: 500 })
  }
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    // Delete cover from storage if exists
    const { data: ebook } = await supabaseAdmin
      .from('ebooks')
      .select('cover_url')
      .eq('id', id)
      .single()

    if (ebook?.cover_url) {
      const path = ebook.cover_url.split('/storage/v1/object/public/covers/')[1]
      if (path) await supabaseAdmin.storage.from('covers').remove([path])
    }

    const { error } = await supabaseAdmin.from('ebooks').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ebook delete error:', error)
    return NextResponse.json({ error: 'Could not delete ebook.' }, { status: 500 })
  }
}
