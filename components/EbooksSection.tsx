'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Ebook, SiteConfig } from '@/types'
import SubscribeModal from './SubscribeModal'

interface Props {
  ebooks: Ebook[]
  type: 'free' | 'paid'
  config?: SiteConfig
}

export default function EbooksSection({ ebooks, type, config }: Props) {
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null)
  const waNumber = config?.whatsapp_number ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

  function buildWaLink(ebook: Ebook) {
    const msg = encodeURIComponent(`Hi, I'm interested in buying "${ebook.title}" priced at ₦${Number(ebook.price).toLocaleString()}. Please guide me on how to pay.`)
    return `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${msg}`
  }

  return (
    <section id={type === 'free' ? 'free-ebooks' : 'paid-ebooks'} className="py-8 sm:py-16">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-10">
        <div className="mb-6 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 bg-[var(--primary-pale)] text-[var(--primary)] px-3 py-1 rounded-full text-[0.72rem] font-semibold uppercase tracking-wide mb-2">
            {type === 'free' ? 'Free Resources' : 'Premium Resources'}
          </span>
          <h2 className="font-serif text-[1.5rem] sm:text-[2.2rem] font-bold text-[var(--dark)] mb-1">
            {type === 'free' ? 'Free Medical Guides' : 'Premium Medical Guides'}
          </h2>
          <p className="text-[var(--muted)] text-[0.82rem] sm:text-[1rem] max-w-lg">
            {type === 'free'
              ? 'Download free, expert-written health guides. Just enter your name and email.'
              : 'In-depth guides for those who want to go deeper. Purchase via WhatsApp.'}
          </p>
        </div>

        {ebooks.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-[var(--border)] rounded-2xl">
            <svg className="mx-auto mb-3 opacity-30" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--border)" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <h3 className="text-[var(--muted)] font-medium text-[0.9rem]">
              {type === 'free' ? 'Free ebooks coming soon' : 'Premium guides coming soon'}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ebooks.map(ebook => (
              <div key={ebook.id} className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                <div className={`aspect-[3/2] relative flex items-center justify-center ${type === 'free' ? 'bg-[var(--primary-pale)]' : 'bg-[var(--accent-light)]'}`}>
                  {ebook.cover_url ? (
                    <Image src={ebook.cover_url} alt={ebook.title} fill className="object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke={type === 'free' ? 'var(--primary)' : 'var(--accent)'} strokeWidth="1.5" className="opacity-25">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  )}
                  <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[0.68rem] font-bold ${type === 'free' ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--accent-light)] text-[#7a5c20]'}`}>
                    {type === 'free' ? 'FREE' : 'PREMIUM'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--dark)] text-[0.88rem] sm:text-[0.95rem] leading-snug mb-1">{ebook.title}</h3>
                  <p className="text-[var(--muted)] text-[0.78rem] leading-relaxed line-clamp-3 mb-3">{ebook.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[1rem] sm:text-[1.1rem] font-bold text-[var(--primary)]">
                      {type === 'free' ? 'Free' : `₦${Number(ebook.price).toLocaleString()}`}
                    </span>
                    {type === 'free' ? (
                      <button onClick={() => setSelectedEbook(ebook)}
                        className="bg-[var(--primary)] text-white px-3.5 py-1.5 rounded-lg text-[0.78rem] font-semibold hover:bg-[var(--primary-light)] transition-colors">
                        Get Free Copy
                      </button>
                    ) : (
                      <a href={buildWaLink(ebook)} target="_blank" rel="noopener noreferrer"
                        className="bg-[var(--accent)] text-white px-3.5 py-1.5 rounded-lg text-[0.78rem] font-semibold hover:opacity-90 transition-opacity no-underline">
                        Buy via WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEbook && (
        <SubscribeModal ebook={selectedEbook} onClose={() => setSelectedEbook(null)} />
      )}
    </section>
  )
}
