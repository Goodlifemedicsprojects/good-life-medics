import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('youtube_videos')
    .select('*')
    .order('position', { ascending: true })
    .limit(3)
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { url, video_id, title, description, thumbnail, position } = body
    if (!url || !video_id || !title || !thumbnail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    // Max 3 videos
    const { count } = await supabaseAdmin
      .from('youtube_videos')
      .select('*', { count: 'exact', head: true })
    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Maximum 3 videos allowed. Delete one first.' }, { status: 400 })
    }
    const { data, error } = await supabaseAdmin
      .from('youtube_videos')
      .insert({ url, video_id, title, description, thumbnail, position: position ?? count ?? 0 })
      .select().single()
    if (error) throw error
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save video' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const { id, description } = body
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const { data, error } = await supabaseAdmin
    .from('youtube_videos')
    .update({ description })
    .eq('id', id).select().single()
  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const { error } = await supabaseAdmin.from('youtube_videos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  return NextResponse.json({ success: true })
}
