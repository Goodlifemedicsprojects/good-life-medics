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
    <section className="py-16">
      <div className="max-w-[1160px] mx-auto px-10">
        <div className="bg-white border border-[var(--border)] rounded-[20px] p-12 text-center max-w-[560px] mx-auto">
          <div className="w-14 h-14 bg-[var(--primary-pale)] rounded-[14px] flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h3 className="font-serif text-[1.4rem] text-[var(--dark)] mb-2">Stay in the Loop</h3>
          <p className="text-[var(--muted)] text-[0.9rem] mb-6">Get notified when new health guides drop. No spam, ever.</p>
          {status === 'success' ? (
            <div className="bg-[var(--success-bg)] text-[var(--success)] rounded-xl py-3 px-4 font-medium text-[0.9rem]">✅ You&apos;re subscribed! We&apos;ll notify you of new guides.</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2.5 max-w-[380px] mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required
                className="flex-1 px-4 py-3 border-[1.5px] border-[var(--border)] rounded-lg text-[0.9rem] outline-none focus:border-[var(--primary)] bg-[var(--bg)] transition-colors" />
              <button type="submit" disabled={status === 'loading'}
                className="bg-[var(--primary)] text-white px-5 py-3 rounded-lg font-semibold text-[0.88rem] hover:bg-[var(--primary-light)] disabled:opacity-60 transition-colors whitespace-nowrap">
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
          {status === 'error' && <p className="text-red-500 text-[0.83rem] mt-2">Something went wrong. Please try again.</p>}
        </div>
      </div>
    </section>
  )
}
