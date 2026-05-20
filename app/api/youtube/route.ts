import { NextResponse } from 'next/server'

const CHANNEL_ID = process.env.NEXT_PUBLIC_YT_CHANNEL_ID ?? 'UCi5Q9YNkphYHv2T0XLnvfkA'

export async function GET() {
  try {
    const rss = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
    const res = await fetch(rss, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)

    const xml = await res.text()
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g)?.slice(0, 3) ?? []

    const videos = entries.map(entry => {
      const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? ''
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1]
        ?.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') ?? ''
      const pubDate = entry.match(/<published>(.*?)<\/published>/)?.[1] ?? ''
      const date = pubDate
        ? new Date(pubDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
        : ''
      return {
        id: videoId,
        title,
        date,
        thumb: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      }
    }).filter(v => v.id)

    return NextResponse.json({ success: true, videos })
  } catch (error) {
    console.error('YouTube RSS error:', error)
    return NextResponse.json({ success: false, videos: [] }, { status: 200 })
  }
}
