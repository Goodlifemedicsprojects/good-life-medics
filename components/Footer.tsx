'use client'
import Link from 'next/link'

const LOBOS_WA = 'https://wa.me/2347011462002?text=Hi%20Lobos!%20I%20found%20you%20through%20Good%20Life%20Medics.'

export default function Footer() {
  return (
    <footer className="py-8 sm:py-12 px-5 sm:px-10">
      <div className="max-w-[1160px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-[32px] h-[32px] bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/></svg>
              </div>
              <span className="font-serif text-[1rem] sm:text-[1.1rem] text-white font-bold">Good Life Medics</span>
            </div>
            <p className="text-white/60 text-[0.8rem] leading-relaxed max-w-[240px]">Evidence-based health education for everyone. Making medicine simple, accessible, and actionable.</p>
            <div className="flex gap-2 mt-3">
              <a href="https://www.youtube.com/@chinonyeremeuphemia8308" target="_blank" rel="noopener noreferrer"
                className="w-[32px] h-[32px] rounded-lg bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors no-underline">
                <svg viewBox="0 0 24 24" width="15" height="15">
                  <path fill="#FF0000" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                  <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-[0.85rem]">Quick Links</h4>
            {[['About Us', '#about'], ['Free Guides', '#free-ebooks'], ['Premium Guides', '#paid-ebooks'], ['Contact', '#contact-section']].map(([label, href]) => (
              <a key={label} href={href} className="block text-white/60 text-[0.8rem] mb-1.5 no-underline hover:text-white transition-colors">{label}</a>
            ))}
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-[0.85rem]">Resources</h4>
            {[
              ['Privacy Policy', '#', false],
              ['Terms of Use', '#', false],
              ['YouTube Channel', 'https://www.youtube.com/@chinonyeremeuphemia8308', true],
              ['Contact Us', '#contact-section', false],
            ].map(([label, href, external]) => (
              <a key={label as string} href={href as string}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="block text-white/60 text-[0.8rem] mb-1.5 no-underline hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-white/50 text-[0.78rem]">© {new Date().getFullYear()} Good Life Medics. All rights reserved.</span>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 px-3.5 py-1.5 rounded-full text-[0.75rem] font-medium cursor-pointer hover:bg-white/20 transition-colors">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
              Back to Top
            </button>
            <a href={LOBOS_WA} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1aad19]/20 border border-[#1aad19]/40 text-[#4ade80] px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold hover:bg-[#1aad19]/30 transition-colors no-underline">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              Built by Lobos
            </a>
            <Link href="/admin" className="text-white/30 text-[0.78rem] no-underline hover:text-white/60 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
