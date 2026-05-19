'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="h-[70px] border-b border-[var(--border)] px-8">
      <div className="max-w-[1160px] mx-auto h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-[38px] h-[38px] bg-[var(--primary)] rounded-[10px] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/>
              <path d="M12 12a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M12 12v7"/>
            </svg>
          </div>
          <span className="font-serif text-[1.2rem] font-bold text-[var(--primary)]">Good Life Medics</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['About', 'Free Guides', 'Premium', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-[var(--muted)] text-[0.9rem] font-medium hover:text-[var(--primary)] transition-colors no-underline"
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="#free-ebooks"
          className="bg-[var(--primary)] text-white px-5 py-2 rounded-lg text-[0.88rem] font-medium hover:bg-[var(--primary-light)] transition-colors no-underline"
        >
          Get Free Ebook
        </a>
      </div>
    </nav>
  )
}
