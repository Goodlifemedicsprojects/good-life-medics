'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const CHANNEL_URL = 'https://www.youtube.com/@chinonyeremeuphemia8308'

interface YTVideo {
  id: string
  url: string
  video_id: string
  title: string
  description: string | null
  thumbnail: string
}

export default function WatchLearnSection() {
  const [videos, setVideos] = useState<YTVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/youtube-videos')
      .then(r => r.json())
      .then(data => { if (data.data) setVideos(data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="watch-learn" className="py-8 sm:py-16">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-10">
        <div className="flex items-start sm:items-end justify-between flex-wrap gap-3 mb-6 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--primary-pale)] text-[var(--primary)] px-3 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-wide mb-2">
              <svg viewBox="0 0 24 24" width="12" height="12">
                <path fill="#FF0000" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
              </svg>
              Watch &amp; Learn
            </div>
            <h2 className="font-serif text-[1.5rem] sm:text-[clamp(1.6rem,3vw,2.2rem)] font-bold text-[var(--dark)] mb-1">Watch &amp; Learn</h2>
            <p className="text-[var(--muted)] text-[0.82rem] sm:text-base max-w-lg">Free health education videos — handpicked for you.</p>
          </div>
          <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-[1.5px] border-[var(--primary)] text-[var(--primary)] px-4 py-2 rounded-[10px] text-[0.78rem] sm:text-[0.85rem] font-semibold hover:bg-[var(--primary-pale)] transition-colors no-underline flex-shrink-0">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <path fill="#FF0000" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
              <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
            </svg>
            Subscribe
          </a>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="aspect-video skeleton" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-3.5 rounded w-full" />
                  <div className="skeleton h-3 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-[var(--border)] rounded-2xl">
            <svg className="mx-auto mb-3" viewBox="0 0 24 24" width="40" height="40">
              <path fill="#FF0000" opacity="0.3" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
              <polygon fill="white" opacity="0.3" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
            </svg>
            <p className="text-[var(--muted)] text-[0.85rem] mb-1">No videos added yet.</p>
            <p className="text-[var(--muted)] text-[0.78rem]">Admin can add up to 3 YouTube videos from the dashboard.</p>
          </div>
        )}

        {/* Videos grid */}
        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            {videos.map(video => (
              <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer"
                className="no-underline group block rounded-xl border border-[var(--border)] overflow-hidden bg-white hover:-translate-y-0.5 hover:shadow-lg transition-all">
                <div className="aspect-video relative overflow-hidden bg-[var(--bg)]">
                  <Image
                    src={video.thumbnail} alt={video.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-[var(--dark)] text-[0.8rem] sm:text-[0.88rem] leading-snug line-clamp-2 mb-1.5">{video.title}</h3>
                  {video.description && (
                    <p className="text-[var(--muted)] text-[0.72rem] sm:text-[0.78rem] leading-relaxed line-clamp-2">{video.description}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
