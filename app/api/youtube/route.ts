import { NextRequest, NextResponse } from 'next/server'

// Fetch video metadata from YouTube oEmbed API
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const res = await fetch(oembedUrl)

    if (!res.ok) throw new Error('oEmbed fetch failed')

    const data = await res.json()

    // Extract video ID from URL
    const videoId = extractVideoId(url)
    if (!videoId) throw new Error('Invalid YouTube URL')

    return NextResponse.json({
      success: true,
      title: data.title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoId,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not fetch video info' }, { status: 400 })
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
