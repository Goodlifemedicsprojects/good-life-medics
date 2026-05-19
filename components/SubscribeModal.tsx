'use client'
import { useState } from 'react'
import { Ebook } from '@/types'

interface Props {
  ebook: Ebook
  onClose: () => void
}

export default function SubscribeModal({ ebook, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), ebookId: ebook.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')

      // Auto-open Drive link
      if (data.driveLink) {
        window.open(data.driveLink, '_blank')
      }

      // Close modal after 2.5s
      setTimeout(onClose, 2500)
    } catch {
      setErrorMsg('Network error. Please check your connection.')
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] p-10 w-full max-w-[440px] relative animate-pop-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-[var(--border)] transition-colors"
        >
          ✕
        </button>

        <div className="w-[52px] h-[52px] bg-[var(--primary-pale)] rounded-[14px] flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--primary)" strokeWidth="2">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>

        <h3 className="font-serif text-[1.4rem] text-[var(--dark)] mb-1">Get Your Free Copy</h3>
        <p className="text-[var(--muted)] text-[0.88rem] mb-6">
          Enter your details and instantly download <span className="font-semibold text-[var(--primary)]">&ldquo;{ebook.title}&rdquo;</span>
        </p>

        {status === 'success' ? (
          <div className="text-center py-6 bg-[var(--success-bg)] rounded-xl">
            <div className="text-2xl mb-2">✅</div>
            <p className="font-semibold text-[var(--success)]">Opening your ebook now. Enjoy!</p>
            <p className="text-[0.82rem] text-[var(--muted)] mt-1">Check your email too — we sent a copy there.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.85rem] font-medium text-[var(--text)] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Adaeze Nwosu"
                required
                className="w-full px-4 py-3 border-[1.5px] border-[var(--border)] rounded-[10px] text-[0.92rem] text-[var(--text)] bg-[var(--bg)] outline-none focus:border-[var(--primary)] focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[0.85rem] font-medium text-[var(--text)] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border-[1.5px] border-[var(--border)] rounded-[10px] text-[0.92rem] text-[var(--text)] bg-[var(--bg)] outline-none focus:border-[var(--primary)] focus:bg-white transition-colors"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-[0.83rem] bg-red-50 p-3 rounded-lg">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white py-3.5 rounded-[10px] font-bold text-[0.95rem] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              {status === 'loading' ? '⏳ Opening...' : '⬇️ Download Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
