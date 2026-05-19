'use client'
import { useState, useEffect } from 'react'
import { Ebook } from '@/types'
import Image from 'next/image'

interface Props { freeEbooks: Ebook[] }

export default function WelcomePopup({ freeEbooks }: Props) {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  function close() {
    setVisible(false)
    setTimeout(() => { setStep(1); setName(''); setEmail(''); setStatus('idle') }, 400)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setStatus('loading')
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
    } catch { /* silent */ }
    setStatus('idle')
    setStep(2)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

      {/* MOBILE: full-width bottom sheet. DESKTOP: centered card */}
      <div className="relative z-10 w-full sm:max-w-[480px] sm:mx-4 sm:rounded-[20px] rounded-t-[20px] overflow-hidden shadow-2xl animate-pop-in bg-white"
        style={{ maxHeight: '95vh', overflowY: 'auto' }}>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            {/* Teal header */}
            <div className="bg-gradient-to-br from-[#0a5c5c] to-[#0d7a7a] px-5 pt-5 pb-5 text-center relative">
              <button onClick={close}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 border-none text-white flex items-center justify-center text-sm cursor-pointer z-10">
                ✕
              </button>

              {/* Gift icon — compact */}
              <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
                </svg>
              </div>

              <div className="inline-block bg-white/20 text-white/90 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
                🎁 Free Gift For You
              </div>

              <h2 className="font-serif text-[1.3rem] font-bold text-white leading-tight mb-1.5">
                Get Your <span className="text-[#f0d4a0]">Free</span> Health Ebook
              </h2>
              <p className="text-white/75 text-[0.78rem] leading-relaxed mb-3 px-2">
                Join thousands taking charge of their health — completely free.
              </p>

              <div className="flex justify-center gap-3">
                {[['Instant access', 'animate-perk-1'], ['Expert-reviewed', 'animate-perk-2'], ['100% Free', 'animate-perk-3']].map(([label, cls]) => (
                  <div key={label} className={`flex items-center gap-1 text-white/90 text-[0.7rem] font-medium ${cls}`}>
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#c8e8b8" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white px-5 pt-4 pb-5">
              <p className="text-[0.7rem] font-bold text-[var(--muted)] uppercase tracking-wider mb-3">
                Enter your details to get instant access
              </p>
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="👤  Your full name" required
                  className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-xl text-[0.85rem] outline-none focus:border-[var(--primary)] bg-[var(--bg)] transition-colors"
                />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="📧  Your email address" required
                  className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-xl text-[0.85rem] outline-none focus:border-[var(--primary)] bg-[var(--bg)] transition-colors"
                />
                <button
                  type="submit" disabled={status === 'loading'}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0a5c5c] to-[#0d7a7a] text-white font-bold text-[0.88rem] flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-transform"
                >
                  {status === 'loading' ? 'Loading...' : '🎁 Claim My Free Ebook Now'}
                </button>
              </form>
              <div className="flex items-center justify-center gap-1 text-[#aab5b5] text-[0.68rem] mt-2">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#aab5b5" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Your info is safe. No spam, ever.
              </div>
              <p className="text-center mt-2.5 text-[0.75rem] text-[var(--muted)]">
                <span className="underline cursor-pointer" onClick={close}>No thanks, skip for now</span>
              </p>
            </div>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <div className="bg-gradient-to-br from-[#0a5c5c] to-[#0d7a7a] px-5 pt-5 pb-5 text-center relative">
              <button onClick={close}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 border-none text-white flex items-center justify-center text-sm cursor-pointer">
                ✕
              </button>
              <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div className="inline-block bg-white/20 text-white/90 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
                ✅ You&apos;re In!
              </div>
              <h2 className="font-serif text-[1.3rem] font-bold text-white mb-1">
                Your Free <span className="text-[#f0d4a0]">Ebooks</span> Are Ready
              </h2>
              <p className="text-white/75 text-[0.78rem]">Tap any ebook to download instantly.</p>
            </div>

            <div className="bg-white px-5 pt-4 pb-5">
              {freeEbooks.length === 0 ? (
                <p className="text-center text-[var(--muted)] text-[0.85rem] py-4">
                  No free ebooks yet — check back soon!
                </p>
              ) : (
                <div className="space-y-2">
                  {freeEbooks.map(ebook => (
                    <a key={ebook.id} href={ebook.drive_link ?? '#'} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 no-underline active:bg-[var(--primary-pale)] transition-colors group">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-[var(--primary-pale)] flex-shrink-0 flex items-center justify-center">
                        {ebook.cover_url
                          ? <Image src={ebook.cover_url} alt={ebook.title} width={36} height={36} className="object-cover w-full h-full" />
                          : <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2">
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[var(--dark)] text-[0.82rem] leading-snug truncate">{ebook.title}</div>
                        <div className="text-[var(--muted)] text-[0.72rem] mt-0.5 truncate">{ebook.description}</div>
                      </div>
                      <span className="text-[var(--primary)] flex-shrink-0">→</span>
                    </a>
                  ))}
                </div>
              )}
              <p className="text-center mt-3 text-[0.75rem] text-[var(--muted)]">
                <span className="underline cursor-pointer" onClick={close}>Close &amp; browse the site</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
