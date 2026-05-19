'use client'
import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-8 sm:py-16">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-10">
        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6 sm:p-12 text-center max-w-[560px] mx-auto">
          <div className="w-12 h-12 bg-[var(--primary-pale)] rounded-[12px] flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 className="font-serif text-[1.2rem] sm:text-[1.4rem] text-[var(--dark)] mb-1">Stay in the Loop</h3>
          <p className="text-[var(--muted)] text-[0.82rem] sm:text-[0.9rem] mb-5">Get notified when new health guides drop. No spam, ever.</p>
          {status === 'success' ? (
            <div className="bg-[var(--success-bg)] text-[var(--success)] rounded-xl py-3 px-4 font-medium text-[0.85rem]">
              ✅ You&apos;re subscribed! We&apos;ll notify you of new guides.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-[380px] mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required
                className="flex-1 px-4 py-2.5 border-[1.5px] border-[var(--border)] rounded-xl text-[0.88rem] outline-none focus:border-[var(--primary)] bg-white transition-colors" />
              <button type="submit" disabled={status === 'loading'}
                className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-semibold text-[0.85rem] hover:bg-[var(--primary-light)] disabled:opacity-60 transition-colors whitespace-nowrap">
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
          {status === 'error' && <p className="text-red-500 text-[0.8rem] mt-2">Something went wrong. Please try again.</p>}
        </div>
      </div>
    </section>
  )
}
