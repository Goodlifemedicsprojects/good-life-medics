'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!token) setErrorMsg('Invalid reset link. Please request a new one.')
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong')
        setStatus('error')
        return
      }
      setStatus('success')
      setTimeout(() => router.push('/admin'), 3000)
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  const strength = newPassword.length === 0 ? 0
    : newPassword.length < 8 ? 1
    : newPassword.length < 12 ? 2
    : /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 4 : 3

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']

  return (
    <div className="min-h-screen bg-[#cfe0e0] flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[440px] overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#0a5c5c] to-[#0d7a7a] px-8 py-8 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-white/70 text-sm">Good Life Medics Admin Dashboard</p>
        </div>

        <div className="px-8 py-8">
          {status === 'success' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e6f5ed] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#1a7a4a" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h2 className="font-serif text-xl text-[#0d1f1f] mb-2">Password Updated! 🎉</h2>
              <p className="text-[#5a7070] text-sm mb-4">
                Your password has been successfully reset. Redirecting you to login...
              </p>
              <Link href="/admin" className="inline-block bg-[#0a5c5c] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0e8080] transition-colors no-underline">
                Go to Login →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {(errorMsg || !token) && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                  </svg>
                  {errorMsg || 'Invalid reset link. Please request a new one.'}
                </div>
              )}

              {token && (
                <>
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e2e] mb-1.5">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="w-full px-4 py-3 border-[1.5px] border-[#d0e4e4] rounded-xl text-[0.92rem] outline-none focus:border-[#0a5c5c] bg-[#f7fafa] pr-11 transition-colors"
                      />
                      <button type="button" onClick={() => setShowNew(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a7070] hover:text-[#0a5c5c] transition-colors">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          {showNew
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                          }
                        </svg>
                      </button>
                    </div>
                    {/* Password strength bar */}
                    {newPassword.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : 'bg-[#d0e4e4]'}`} />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${strength <= 1 ? 'text-red-500' : strength === 2 ? 'text-orange-500' : strength === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {strengthLabel[strength]} password
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a2e2e] mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        required
                        className={`w-full px-4 py-3 border-[1.5px] rounded-xl text-[0.92rem] outline-none bg-[#f7fafa] pr-11 transition-colors ${
                          confirmPassword && confirmPassword !== newPassword
                            ? 'border-red-400 focus:border-red-400'
                            : confirmPassword && confirmPassword === newPassword
                            ? 'border-green-400 focus:border-green-400'
                            : 'border-[#d0e4e4] focus:border-[#0a5c5c]'
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a7070] hover:text-[#0a5c5c] transition-colors">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          {showConfirm
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                          }
                        </svg>
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                    {confirmPassword && confirmPassword === newPassword && (
                      <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading' || !token}
                    className="w-full bg-gradient-to-r from-[#0a5c5c] to-[#0d7a7a] text-white py-3.5 rounded-xl font-bold text-[0.95rem] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  >
                    {status === 'loading' ? '⏳ Updating password...' : '🔐 Set New Password'}
                  </button>
                </>
              )}

              <p className="text-center text-sm text-[#5a7070]">
                <Link href="/admin" className="text-[#0a5c5c] font-medium hover:underline no-underline">
                  ← Back to Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#cfe0e0] flex items-center justify-center">
        <div className="text-[#0a5c5c] font-medium">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
