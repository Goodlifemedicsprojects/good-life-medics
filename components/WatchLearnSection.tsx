'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const CHANNEL_ID = process.env.NEXT_PUBLIC_YT_CHANNEL_ID ?? 'UCi5Q9YNkphYHv2T0XLnvfkA'
const CHANNEL_URL = 'https://www.youtube.com/@chinonyeremeuphemia8308'

interface YTVideo {
  id: string
  title: string
  date: string
  thumb: string
  url: string
}

export default function WatchLearnSection() {
  const [videos, setVideos] = useState<YTVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const rss = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
        const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(rss)}`
        const res = await fetch(proxy)
        const data = await res.json()
        const xml = data.contents as string

        const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g)?.slice(0, 3) ?? []
        const parsed = entries.map(entry => {
          const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? ''
          const title = entry.match(/<title>(.*?)<\/title>/)?.[1]
            ?.replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>') ?? ''
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
        })
        setVideos(parsed)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  return (
    <section id="watch-learn" className="py-8 sm:py-16">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--primary-pale)] text-[var(--primary)] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="#FF0000" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
              </svg>
              Watch &amp; Learn
            </div>
            <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-bold text-[var(--dark)] mb-2">Latest From YouTube</h2>
            <p className="text-[var(--muted)] max-w-lg">Free health education videos — new content every week.</p>
          </div>
          <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-[1.5px] border-[var(--primary)] text-[var(--primary)] px-5 py-2.5 rounded-[10px] text-[0.85rem] font-semibold hover:bg-[var(--primary-pale)] transition-colors no-underline">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="#FF0000" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
              <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
            </svg>
            Subscribe on YouTube
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-[14px] border border-[var(--border)] overflow-hidden bg-white">
                <div className="aspect-video skeleton" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 rounded-lg w-full" />
                  <div className="skeleton h-3 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error || videos.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-2xl">
            <p className="text-[var(--muted)] mb-2">Couldn&apos;t load videos right now.</p>
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer"
              className="text-[var(--primary)] font-semibold no-underline hover:underline">
              Visit the YouTube channel directly →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {videos.map(video => (
              <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer"
                className="no-underline group block rounded-[14px] border border-[var(--border)] overflow-hidden bg-white hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="aspect-video relative overflow-hidden">
                  <Image src={video.thumb} alt={video.title} fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-[46px] h-[46px] bg-red-600 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--dark)] text-[0.88rem] leading-snug line-clamp-2 mb-1.5">{video.title}</h3>
                  <p className="text-[var(--muted)] text-[0.75rem]">{video.date}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
