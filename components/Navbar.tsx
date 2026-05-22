'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    function handleScroll() {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const currentY = window.scrollY
        // Always show at top
        if (currentY < 60) {
          setVisible(true)
        } else if (currentY < lastScrollY.current) {
          // Scrolling UP — show
          setVisible(true)
        } else if (currentY > lastScrollY.current + 5) {
          // Scrolling DOWN — hide (with 5px threshold to avoid jitter)
          setVisible(false)
          setOpen(false)
        }
        lastScrollY.current = currentY
        ticking.current = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50
      transition-transform duration-300 ease-in-out
      ${visible ? 'translate-y-0' : '-translate-y-full'}
    `}>
      <div className="max-w-[1260px] mx-auto sm:px-5 sm:pt-3">
        <nav className="bg-white/95 backdrop-blur-md border-b border-[var(--border)] sm:border sm:rounded-[18px] sm:shadow-lg h-[58px] sm:h-[64px] px-4 sm:px-6">
          <div className="max-w-[1160px] mx-auto h-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <div className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] bg-[var(--primary)] rounded-[8px] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/>
                  <path d="M12 12a3 3 0 100-6 3 3 0 000 6z"/>
                  <path d="M12 12v7"/>
                </svg>
              </div>
              <span className="font-serif text-[0.95rem] sm:text-[1.1rem] font-bold text-[var(--primary)]">Good Life Medics</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              {[['About','#about'],['Free Checklists','#free-ebooks'],['Premium','#paid-ebooks'],['Contact','#contact-section']].map(([label, href]) => (
                <a key={label} href={href} className="text-[var(--muted)] text-[0.85rem] font-medium hover:text-[var(--primary)] transition-colors no-underline">{label}</a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a href="#free-ebooks" className="bg-[var(--primary)] text-white px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[0.75rem] sm:text-[0.85rem] font-semibold hover:bg-[var(--primary-light)] transition-colors no-underline whitespace-nowrap">
                Get Free Checklist
              </a>
              {/* Hamburger */}
              <button onClick={() => setOpen(!open)} className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 ml-1" aria-label="Menu">
                <span className={`block w-5 h-0.5 bg-[var(--text)] transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-[var(--text)] transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-[var(--text)] transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden bg-white border border-t-0 border-[var(--border)] sm:rounded-b-[18px] px-4 py-3 space-y-1 shadow-lg">
            {[['About','#about'],['Free Checklists','#free-ebooks'],['Premium','#paid-ebooks'],['Contact','#contact-section']].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)}
                className="block text-[var(--text)] text-[0.88rem] font-medium py-2.5 border-b border-[var(--bg)] last:border-0 no-underline hover:text-[var(--primary)]">
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
