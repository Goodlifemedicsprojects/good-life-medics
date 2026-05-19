'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="h-[60px] sm:h-[70px] border-b border-[var(--border)] px-4 sm:px-8">
      <div className="max-w-[1160px] mx-auto h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] bg-[var(--primary)] rounded-[8px] sm:rounded-[10px] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/>
              <path d="M12 12a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M12 12v7"/>
            </svg>
          </div>
          <span className="font-serif text-[1rem] sm:text-[1.2rem] font-bold text-[var(--primary)]">Good Life Medics</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {[['About', '#about'], ['Free Guides', '#free-ebooks'], ['Premium', '#paid-ebooks'], ['Contact', '#contact-section']].map(([label, href]) => (
            <a key={label} href={href} className="text-[var(--muted)] text-[0.88rem] font-medium hover:text-[var(--primary)] transition-colors no-underline">{label}</a>
          ))}
        </div>

        {/* CTA */}
        <a href="#free-ebooks" className="bg-[var(--primary)] text-white px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-lg text-[0.78rem] sm:text-[0.88rem] font-medium hover:bg-[var(--primary-light)] transition-colors no-underline whitespace-nowrap">
          Get Free Ebook
        </a>
      </div>

      {/* Mobile menu (unused since we have CTA) */}
    </nav>
  )
}
