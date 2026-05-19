import Image from 'next/image'
import { SiteConfig } from '@/types'

export default function AboutSection({ config }: { config: SiteConfig }) {
  return (
    <section id="about" className="py-8 sm:py-16">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-10">
        <span className="inline-flex items-center gap-1.5 bg-[var(--primary-pale)] text-[var(--primary)] px-3 py-1 rounded-full text-[0.72rem] font-semibold uppercase tracking-wide mb-2">About</span>
        <h2 className="font-serif text-[1.5rem] sm:text-[2.2rem] font-bold text-[var(--dark)] mb-2">Meet Your Health Educator</h2>
        <p className="text-[var(--muted)] text-[0.85rem] sm:text-[1rem] max-w-lg mb-8">Dedicated to making medical knowledge accessible, accurate, and actionable for everyone.</p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16 items-center">
          <div className="aspect-[4/3] md:aspect-[4/5] rounded-[16px] bg-[var(--primary-pale)] border border-[var(--border)] overflow-hidden flex items-center justify-center relative">
            {config?.creator_photo_url ? (
              <Image src={config.creator_photo_url} alt="Creator" fill className="object-cover" />
            ) : (
              <div className="text-center text-[var(--muted)] p-4">
                <svg viewBox="0 0 24 24" className="mx-auto mb-2 opacity-30" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                <p className="text-sm">Creator photo goes here</p>
              </div>
            )}
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 bg-[var(--primary-pale)] text-[var(--primary)] px-3 py-1 rounded-full text-[0.72rem] font-semibold uppercase tracking-wide mb-2">Our Mission</span>
            <h3 className="font-serif text-[1.3rem] sm:text-[1.6rem] font-bold text-[var(--dark)] mb-3">Simplifying Medicine For Everyday People</h3>
            <p className="text-[var(--muted)] text-[0.85rem] sm:text-[0.95rem] leading-relaxed mb-3">Good Life Medics was founded on the belief that everyone deserves access to clear, accurate, and evidence-based health information. Through YouTube videos and downloadable guides, we break down complex medical topics into simple, actionable knowledge.</p>
            <p className="text-[var(--muted)] text-[0.85rem] sm:text-[0.95rem] leading-relaxed mb-5">Our resources are carefully researched, regularly updated, and designed to empower you — whether you&apos;re managing a chronic condition, looking to improve your lifestyle, or simply want to understand your health better.</p>
            <div className="flex flex-wrap gap-2">
              {['Verified Medical Content', 'Expert Reviewed', '10,000+ Readers'].map(badge => (
                <div key={badge} className="flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] px-3 py-1.5 rounded-lg text-[0.75rem] text-[var(--text)] font-medium">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
