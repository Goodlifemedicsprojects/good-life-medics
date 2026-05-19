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
  const [errorMsg, setErrorMsg] = useState('')

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
    setErrorMsg('')

    // Save to newsletter (popup signup)
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
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />
      <div className="relative z-10 w-full max-w-[520px] rounded-[24px] overflow-hidden shadow-2xl animate-pop-in">

        {/* Step 1 — Form */}
        {step === 1 && (
          <>
            <div className="bg-gradient-to-br from-[var(--primary)] to-[#0d7a7a] px-10 py-10 text-center relative overflow-hidden">
              <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-white/5" />
              <div className="absolute bottom-[-40px] left-[-40px] w-[150px] h-[150px] rounded-full bg-[var(--accent)]/10" />
              <button onClick={close} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 border-none text-white/80 flex items-center justify-center cursor-pointer text-lg hover:bg-white/25 transition-colors z-10">✕</button>
              <div className="relative z-10">
                <div className="w-[72px] h-[72px] rounded-[20px] bg-white/15 border-2 border-white/25 flex items-center justify-center mx-auto mb-5">
                  <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="white" strokeWidth="1.8">
                    <path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
                  </svg>
                </div>
                <div className="inline-block bg-[var(--accent)]/30 border border-[var(--accent)]/50 text-[#f0d4a0] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">🎁 Free Gift For You</div>
                <h2 className="font-serif text-[clamp(1.5rem,3vw,2rem)] font-bold text-white leading-tight mb-3">
                  Get Your <span className="text-[#f0d4a0]">Free</span><br/>Health Ebook Today
                </h2>
                <p className="text-white/75 text-[0.9rem] leading-relaxed mb-5">
                  Join thousands of Nigerians taking charge of their health — completely free.
                </p>
                <div className="flex justify-center gap-5 flex-wrap">
                  {[['Instant access', 'animate-perk-1'], ['Expert-reviewed', 'animate-perk-2'], ['100% Free', 'animate-perk-3']].map(([label, cls]) => (
                    <div key={label} className={`flex items-center gap-1.5 text-white/85 text-[0.78rem] font-medium ${cls}`}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#c8e8b8" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white px-10 py-8">
              <span className="block text-[0.82rem] font-semibold text-[var(--muted)] uppercase tracking-wide mb-4">Enter your details to get instant access</span>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input className="w-full px-4 py-3 border-[1.5px] border-[var(--border)] rounded-[10px] text-[0.92rem] outline-none focus:border-[var(--primary)] bg-[var(--bg)] transition-colors" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="👤  Your full name" required />
                <input className="w-full px-4 py-3 border-[1.5px] border-[var(--border)] rounded-[10px] text-[0.92rem] outline-none focus:border-[var(--primary)] bg-[var(--bg)] transition-colors" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="📧  Your email address" required />
                {errorMsg && <p className="text-red-500 text-[0.83rem]">{errorMsg}</p>}
                <button type="submit" disabled={status === 'loading'} className="w-full py-3.5 rounded-[12px] bg-gradient-to-r from-[var(--primary)] to-[#0d7a7a] text-white font-bold text-[1rem] flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 transition-all">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 5l7 7-7 7M5 12h15"/></svg>
                  {status === 'loading' ? 'Loading...' : '🎁 Claim My Free Ebook Now'}
                </button>
              </form>
              <div className="flex items-center justify-center gap-1.5 text-[#aab5b5] text-[0.75rem] mt-3">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#aab5b5" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Your info is safe. No spam, ever.
              </div>
              <p className="text-center mt-3 text-[0.8rem] text-[var(--muted)]">
                <span className="underline cursor-pointer hover:text-[var(--primary)]" onClick={close}>No thanks, I&apos;ll skip for now</span>
              </p>
            </div>
          </>
        )}

        {/* Step 2 — Ebook List */}
        {step === 2 && (
          <>
            <div className="bg-gradient-to-br from-[var(--primary)] to-[#0d7a7a] px-10 py-10 text-center relative overflow-hidden">
              <button onClick={close} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 border-none text-white/80 flex items-center justify-center cursor-pointer text-lg hover:bg-white/25 transition-colors">✕</button>
              <div className="w-[72px] h-[72px] rounded-[20px] bg-white/15 border-2 border-white/25 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div className="inline-block bg-[var(--accent)]/30 border border-[var(--accent)]/50 text-[#f0d4a0] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3">✅ You&apos;re In!</div>
              <h2 className="font-serif text-2xl font-bold text-white mb-2">Your Free <span className="text-[#f0d4a0]">Ebooks</span><br/>Are Ready</h2>
              <p className="text-white/75 text-[0.9rem]">Click any ebook below to download it instantly.</p>
            </div>
            <div className="bg-white px-10 py-6">
              {freeEbooks.length === 0 ? (
                <p className="text-center text-[var(--muted)] text-[0.88rem] py-4">No free ebooks available yet — check back soon!</p>
              ) : (
                <div className="space-y-2.5">
                  {freeEbooks.map(ebook => (
                    <a key={ebook.id} href={ebook.drive_link ?? '#'} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-[var(--bg)] border-[1.5px] border-[var(--border)] rounded-xl p-3.5 no-underline hover:border-[var(--primary)] hover:bg-[var(--primary-pale)] hover:translate-x-1 transition-all group">
                      <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-[var(--primary-pale)] border border-[var(--border)] flex-shrink-0 flex items-center justify-center">
                        {ebook.cover_url
                          ? <Image src={ebook.cover_url} alt={ebook.title} width={40} height={40} className="object-cover w-full h-full" />
                          : <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                        }
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[var(--dark)] text-[0.9rem] leading-snug">{ebook.title}</div>
                        <div className="text-[var(--muted)] text-[0.78rem] mt-0.5">{ebook.description}</div>
                      </div>
                      <span className="text-[var(--primary)] text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  ))}
                </div>
              )}
              <p className="text-center mt-4 text-[0.8rem] text-[var(--muted)]">
                <span className="underline cursor-pointer hover:text-[var(--primary)]" onClick={close}>Close &amp; browse the site</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
