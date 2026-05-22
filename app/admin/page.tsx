'use client'
import { useState, useRef } from 'react'
import { Ebook, Subscriber, NewsletterSignup, SiteConfig } from '@/types'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [newsletter, setNewsletter] = useState<NewsletterSignup[]>([])
  const [config, setConfig] = useState<Partial<SiteConfig>>({})
  const [toast, setToast] = useState('')
  const [editingEbook, setEditingEbook] = useState<Partial<Ebook> | null>(null)
  const [ebookModalOpen, setEbookModalOpen] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const photoFileRef = useRef<HTMLInputElement>(null)

  // Change password state
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdStatus, setPwdStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [pwdError, setPwdError] = useState('')
  const [newHash, setNewHash] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwdError('')
    setNewHash('')
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match')
      return
    }
    if (newPwd.length < 8) {
      setPwdError('Password must be at least 8 characters')
      return
    }
    setPwdStatus('loading')
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPwdError(data.error ?? 'Failed to reset password')
        setPwdStatus('error')
        return
      }
      setNewHash(data.newHash)
      setPwdStatus('success')
      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
    } catch {
      setPwdError('Network error. Please try again.')
      setPwdStatus('error')
    }
  }

  async function doLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setAuthed(true)
        loadData()
      } else {
        const d = await res.json()
        setLoginError(d.error ?? 'Invalid credentials')
      }
    } catch {
      setLoginError('Network error')
    }
    setLoginLoading(false)
  }

  async function doLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    setAuthed(false)
    setPassword('')
  }

  async function loadData() {
    const [ebooksRes, configRes] = await Promise.all([
      fetch('/api/ebooks').then(r => r.json()),
      fetch('/api/admin/config').then(r => r.json()),
    ])
    if (ebooksRes.data) setEbooks(ebooksRes.data)
    if (configRes.data) setConfig(configRes.data)
    // Load subscribers from supabase via a dedicated endpoint (simplified here)
  }

  async function saveConfig() {
    const res = await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp_number: config.whatsapp_number, creator_email: config.creator_email }),
    })
    if (res.ok) showToast('✅ Configuration saved!')
    else showToast('❌ Failed to save config')
  }

  async function uploadCover(file: File): Promise<string | null> {
    setUploadingCover(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'covers')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    setUploadingCover(false)
    if (!res.ok) { showToast('❌ Upload failed'); return null }
    const { url } = await res.json()
    return url
  }

  async function uploadCreatorPhoto(file: File) {
    setUploadingPhoto(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'creator')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    setUploadingPhoto(false)
    if (!res.ok) { showToast('❌ Upload failed'); return }
    const { url } = await res.json()
    await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creator_photo_url: url }),
    })
    setConfig(c => ({ ...c, creator_photo_url: url }))
    showToast('✅ Creator photo updated!')
  }

  async function saveEbook() {
    if (!editingEbook) return
    const method = editingEbook.id ? 'PATCH' : 'POST'
    const body = editingEbook.id
      ? { id: editingEbook.id, title: editingEbook.title, description: editingEbook.description, cover_url: editingEbook.cover_url, drive_link: editingEbook.drive_link, price: editingEbook.price }
      : { title: editingEbook.title, description: editingEbook.description, type: editingEbook.type, cover_url: editingEbook.cover_url, drive_link: editingEbook.drive_link, price: editingEbook.price }
    const res = await fetch('/api/ebooks', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      showToast(editingEbook.id ? '✅ Ebook updated!' : '✅ Ebook added!')
      setEbookModalOpen(false)
      setEditingEbook(null)
      loadData()
    } else {
      const d = await res.json()
      showToast('❌ ' + (d.error ?? 'Failed'))
    }
  }

  async function deleteEbook(id: string) {
    if (!confirm('Delete this ebook?')) return
    const res = await fetch(`/api/ebooks?id=${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Ebook removed'); loadData() }
    else showToast('❌ Failed to delete')
  }

  const freeEbooks = ebooks.filter(e => e.type === 'free')
  const paidEbooks = ebooks.filter(e => e.type === 'paid')

  // ---- LOGIN SCREEN ----
  // ---- FORGOT PASSWORD STATE ----
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState<'idle'|'loading'|'sent'>('idle')

  async function doForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setForgotStatus('loading')
    try {
      await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      setForgotStatus('sent') // Always show sent (security)
    } catch {
      setForgotStatus('sent')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#cfe0e0] flex items-center justify-center p-4">
        <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-br from-[var(--primary)] to-[#0d7a7a] px-8 py-8 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold text-white">
              {showForgot ? 'Reset Password' : 'Admin Login'}
            </h2>
            <p className="text-white/70 text-sm mt-1">Good Life Medics Dashboard</p>
          </div>

          <div className="px-8 py-8">
            {!showForgot ? (
              <>
                {loginError && (
                  <div className="bg-red-50 text-red-600 text-[0.85rem] rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    {loginError}
                  </div>
                )}
                <form onSubmit={doLogin} className="space-y-4">
                  <div>
                    <label className="block text-[0.85rem] font-medium text-[var(--text)] mb-1.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full px-4 py-3 border-[1.5px] border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] text-[0.92rem] bg-[var(--bg)] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-gradient-to-r from-[var(--primary)] to-[#0d7a7a] text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    {loginLoading ? 'Checking...' : 'Access Dashboard'}
                  </button>
                </form>
                <div className="flex items-center justify-between mt-5">
                  <a href="/" className="text-[var(--muted)] text-[0.83rem] hover:text-[var(--primary)] no-underline">← Back to site</a>
                  <button
                    onClick={() => setShowForgot(true)}
                    className="text-[var(--primary)] text-[0.83rem] font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </>
            ) : forgotStatus === 'sent' ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--success-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--success)" strokeWidth="2.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h3 className="font-serif text-lg text-[var(--dark)] mb-2">Check your email!</h3>
                <p className="text-[var(--muted)] text-sm mb-5">
                  If that email is registered, a reset link has been sent. Check your inbox and spam folder.
                  <br/><br/>
                  <span className="font-medium text-[var(--text)]">The link expires in 1 hour.</span>
                </p>
                <button
                  onClick={() => { setShowForgot(false); setForgotStatus('idle'); setForgotEmail('') }}
                  className="text-[var(--primary)] text-sm font-medium hover:underline"
                >
                  ← Back to login
                </button>
              </div>
            ) : (
              <>
                <p className="text-[var(--muted)] text-sm mb-5">
                  Enter the admin email address and we&apos;ll send you a password reset link.
                </p>
                <form onSubmit={doForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-[0.85rem] font-medium text-[var(--text)] mb-1.5">Admin Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="admin@email.com"
                      required
                      className="w-full px-4 py-3 border-[1.5px] border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] text-[0.92rem] bg-[var(--bg)] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotStatus === 'loading'}
                    className="w-full bg-gradient-to-r from-[var(--primary)] to-[#0d7a7a] text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    {forgotStatus === 'loading' ? '⏳ Sending...' : '📧 Send Reset Link'}
                  </button>
                </form>
                <button
                  onClick={() => setShowForgot(false)}
                  className="block w-full text-center text-[var(--muted)] text-[0.83rem] mt-4 hover:text-[var(--primary)]"
                >
                  ← Back to login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ---- DASHBOARD ----
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <div className="bg-white border-b border-[var(--border)] h-16 flex items-center justify-between px-8 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-[34px] h-[34px] bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/></svg>
          </div>
          <span className="font-serif text-[1.1rem] text-[var(--dark)] font-bold">Good Life Medics</span>
          <span className="bg-[var(--primary-pale)] text-[var(--primary)] text-xs font-semibold px-2.5 py-0.5 rounded-md">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-[var(--muted)] text-[0.85rem] hover:text-[var(--primary)] no-underline">View Site →</a>
          <button onClick={doLogout} className="border border-[var(--border)] text-[var(--muted)] px-4 py-1.5 rounded-lg text-[0.85rem] hover:border-red-400 hover:text-red-500 transition-colors">Logout</button>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['Total Subscribers', subscribers.length, 'subscribers-section'], ['Free Checklists', freeEbooks.length, 'free-section'], ['Paid Ebooks', paidEbooks.length, 'paid-section'], ['Newsletter', newsletter.length, 'newsletter-section']].map(([label, val, id]) => (
            <div key={label as string} onClick={() => document.getElementById(id as string)?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white border border-[var(--border)] rounded-[14px] p-5 cursor-pointer hover:border-[var(--primary)] hover:-translate-y-0.5 transition-all">
              <div className="text-[0.8rem] text-[var(--muted)] font-medium mb-1">{label}</div>
              <div className="font-serif text-[1.8rem] text-[var(--primary)] font-bold">{val}</div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <h3 className="font-semibold text-[var(--dark)] mb-1">Settings & Configuration</h3>
          <p className="text-[var(--muted)] text-[0.82rem] mb-5">Configure your creator photo, WhatsApp and email</p>

          {/* Creator Photo */}
          <div className="flex items-center gap-4 pb-5 mb-5 border-b border-[var(--border)]">
            <div className="w-[72px] h-[72px] rounded-full bg-[var(--primary-pale)] border-2 border-[var(--border)] overflow-hidden flex items-center justify-center flex-shrink-0">
              {config.creator_photo_url
                ? <img src={config.creator_photo_url} alt="Creator" className="w-full h-full object-cover" />
                : <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--muted)" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              }
            </div>
            <div>
              <p className="font-medium text-[var(--text)] text-[0.88rem] mb-2">Creator Photo</p>
              <div className="flex gap-2">
                <button onClick={() => photoFileRef.current?.click()} disabled={uploadingPhoto}
                  className="bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg text-[0.83rem] font-semibold hover:bg-[var(--primary-light)] disabled:opacity-60 transition-colors">
                  {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                </button>
                {config.creator_photo_url && (
                  <button onClick={async () => { await fetch('/api/admin/config', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ creator_photo_url: null }) }); setConfig(c => ({...c, creator_photo_url: null})); showToast('Photo removed') }}
                    className="border border-[var(--border)] text-[var(--muted)] px-4 py-1.5 rounded-lg text-[0.83rem] hover:border-red-400 hover:text-red-500 transition-colors">Remove</button>
                )}
              </div>
              <p className="text-[var(--muted)] text-xs mt-1">JPG, PNG · Max 2MB · Square photo recommended</p>
              <input ref={photoFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { const f = e.target.files?.[0]; if(f) uploadCreatorPhoto(f) }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[['WhatsApp Number', 'whatsapp_number', '+2348012345678', 'text'], ['Creator Email', 'creator_email', 'creator@email.com', 'email']].map(([label, key, ph, type]) => (
              <div key={key}>
                <label className="block text-[0.82rem] font-medium text-[var(--muted)] mb-1.5">{label}</label>
                <input type={type} value={(config as any)[key] ?? ''} onChange={e => setConfig(c => ({...c, [key]: e.target.value}))} placeholder={ph}
                  className="w-full px-4 py-2.5 border-[1.5px] border-[var(--border)] rounded-lg text-[0.88rem] outline-none focus:border-[var(--primary)] bg-[var(--bg)]" />
              </div>
            ))}
          </div>
          <button onClick={saveConfig} className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg text-[0.88rem] font-semibold hover:bg-[var(--primary-light)] transition-colors">Save Configuration</button>
        </div>

        {/* Free Checklists */}
        <div id="free-section" className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-[var(--dark)]">Free Checklists</h3>
              <p className="text-[var(--muted)] text-[0.82rem]">Manage free checklist listings</p>
            </div>
            <button onClick={() => { setEditingEbook({ type: 'free' }); setEbookModalOpen(true) }}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-[0.85rem] font-semibold hover:bg-[var(--primary-light)] transition-colors">+ Add Free Checklist</button>
          </div>
          <EbookList ebooks={freeEbooks} onEdit={e => { setEditingEbook(e); setEbookModalOpen(true) }} onDelete={deleteEbook} />
        </div>

        {/* Paid Ebooks */}
        <div id="paid-section" className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-[var(--dark)]">Paid Ebooks</h3>
              <p className="text-[var(--muted)] text-[0.82rem]">Manage paid ebook listings</p>
            </div>
            <button onClick={() => { setEditingEbook({ type: 'paid' }); setEbookModalOpen(true) }}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-[0.85rem] font-semibold hover:bg-[var(--primary-light)] transition-colors">+ Add Paid Ebook</button>
          </div>
          <EbookList ebooks={paidEbooks} onEdit={e => { setEditingEbook(e); setEbookModalOpen(true) }} onDelete={deleteEbook} />
        </div>

        {/* Subscribers */}
        <div id="subscribers-section" className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-[var(--dark)]">Subscribers</h3>
              <p className="text-[var(--muted)] text-[0.82rem]">Users who downloaded a free checklist</p>
            </div>
          </div>
          {subscribers.length === 0
            ? <div className="text-center py-8 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] text-[0.88rem]">No subscribers yet.</div>
            : <table className="w-full text-[0.88rem]">
                <thead><tr className="text-left text-[var(--muted)] text-xs uppercase tracking-wide border-b border-[var(--border)]"><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Ebook</th><th className="pb-3">Date</th></tr></thead>
                <tbody>{subscribers.map(s => <tr key={s.id} className="border-b border-[var(--bg)]"><td className="py-2.5">{s.name}</td><td>{s.email}</td><td>{s.ebook_title ?? '—'}</td><td>{new Date(s.created_at).toLocaleDateString()}</td></tr>)}</tbody>
              </table>
          }
        </div>

        {/* YouTube Videos */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6" id="youtube-section">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-[var(--dark)]">Watch &amp; Learn Videos</h3>
              <p className="text-[var(--muted)] text-[0.82rem]">Add up to 3 YouTube videos. Paste a link to auto-fetch title &amp; thumbnail.</p>
            </div>
          </div>
          <YoutubeVideoManager showToast={showToast} />
        </div>

        {/* Newsletter */}
        <div id="newsletter-section" className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <h3 className="font-semibold text-[var(--dark)] mb-1">Newsletter Signups</h3>
          <p className="text-[var(--muted)] text-[0.82rem] mb-5">Users who subscribed to the newsletter</p>
          {newsletter.length === 0
            ? <div className="text-center py-8 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] text-[0.88rem]">No newsletter signups yet.</div>
            : <table className="w-full text-[0.88rem]">
                <thead><tr className="text-left text-[var(--muted)] text-xs uppercase tracking-wide border-b border-[var(--border)]"><th className="pb-3">Email</th><th className="pb-3">Date</th></tr></thead>
                <tbody>{newsletter.map(n => <tr key={n.id} className="border-b border-[var(--bg)]"><td className="py-2.5">{n.email}</td><td>{new Date(n.created_at).toLocaleDateString()}</td></tr>)}</tbody>
              </table>
          }
        </div>

        {/* Change Password */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--dark)]">Change Password</h3>
              <p className="text-[var(--muted)] text-[0.82rem]">Update your admin dashboard password</p>
            </div>
          </div>

          {pwdStatus === 'success' && newHash ? (
            <div className="space-y-4">
              <div className="bg-[var(--success-bg)] border border-green-200 rounded-xl p-4">
                <p className="font-semibold text-[var(--success)] mb-1">✅ New hash generated!</p>
                <p className="text-[0.82rem] text-[var(--success)]">Copy the hash below and update <code className="bg-green-100 px-1.5 py-0.5 rounded text-xs">ADMIN_PASSWORD_HASH</code> in your Vercel environment variables, then redeploy.</p>
              </div>
              <div>
                <label className="block text-[0.82rem] font-medium text-[var(--muted)] mb-1.5">Your New Password Hash</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={newHash}
                    className="flex-1 px-3 py-2.5 border border-[var(--border)] rounded-lg text-[0.78rem] font-mono bg-[var(--bg)] text-[var(--text)] outline-none"
                  />
                  <button
                    onClick={() => { navigator.clipboard.writeText(newHash); showToast('✅ Hash copied!') }}
                    className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-[0.83rem] font-semibold hover:bg-[var(--primary-light)] transition-colors whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[0.82rem] text-amber-800">
                <p className="font-semibold mb-1">📋 Steps to activate new password:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Copy the hash above</li>
                  <li>Go to <strong>Vercel</strong> → Project → Settings → Environment Variables</li>
                  <li>Find <code className="bg-amber-100 px-1 rounded">ADMIN_PASSWORD_HASH</code> → Edit → paste the new hash</li>
                  <li>Save → Go to Deployments → Redeploy</li>
                  <li>Login with your new password</li>
                </ol>
              </div>
              <button onClick={() => { setPwdStatus('idle'); setNewHash('') }} className="text-[var(--muted)] text-[0.83rem] underline">Change again</button>
            </div>
          ) : (
            <form onSubmit={changePassword} className="space-y-4">
              {pwdError && (
                <div className="bg-red-50 text-red-600 text-[0.83rem] rounded-lg px-4 py-2.5">{pwdError}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[0.82rem] font-medium text-[var(--muted)] mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={e => setCurrentPwd(e.target.value)}
                    placeholder="Current password"
                    required
                    className="w-full px-4 py-2.5 border-[1.5px] border-[var(--border)] rounded-lg outline-none focus:border-[var(--primary)] text-[0.88rem] bg-[var(--bg)]"
                  />
                </div>
                <div>
                  <label className="block text-[0.82rem] font-medium text-[var(--muted)] mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={e => setNewPwd(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                    className="w-full px-4 py-2.5 border-[1.5px] border-[var(--border)] rounded-lg outline-none focus:border-[var(--primary)] text-[0.88rem] bg-[var(--bg)]"
                  />
                </div>
                <div>
                  <label className="block text-[0.82rem] font-medium text-[var(--muted)] mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={e => setConfirmPwd(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    className="w-full px-4 py-2.5 border-[1.5px] border-[var(--border)] rounded-lg outline-none focus:border-[var(--primary)] text-[0.88rem] bg-[var(--bg)]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={pwdStatus === 'loading'}
                className="bg-red-500 text-white px-6 py-2.5 rounded-lg text-[0.88rem] font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {pwdStatus === 'loading' ? 'Generating...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Add/Edit Ebook Modal */}
      {ebookModalOpen && editingEbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] p-8 w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-[1.2rem] text-[var(--dark)]">{editingEbook.id ? 'Edit Ebook' : `Add ${editingEbook.type === 'free' ? 'Free' : 'Paid'} Ebook`}</h3>
              <button onClick={() => { setEbookModalOpen(false); setEditingEbook(null) }} className="w-8 h-8 rounded-lg bg-[var(--bg)] flex items-center justify-center text-[var(--muted)] hover:bg-[var(--border)] transition-colors">✕</button>
            </div>

            {/* Cover Preview */}
            {editingEbook.cover_url && (
              <div className="mb-4 rounded-xl overflow-hidden aspect-[16/7] relative">
                <img src={editingEbook.cover_url} alt="Cover" className="w-full h-full object-cover" />
                <button onClick={() => setEditingEbook(e => e ? {...e, cover_url: undefined} : e)}
                  className="absolute top-2 right-2 bg-black/50 text-white border-none rounded-md px-2.5 py-1 text-xs cursor-pointer">✕ Remove</button>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[0.85rem] font-medium text-[var(--text)] mb-1.5">Ebook Title</label>
                <input type="text" value={editingEbook.title ?? ''} onChange={e => setEditingEbook(b => b ? {...b, title: e.target.value} : b)} placeholder="e.g. Understanding Diabetes"
                  className="w-full px-4 py-2.5 border-[1.5px] border-[var(--border)] rounded-lg outline-none focus:border-[var(--primary)] text-[0.92rem] bg-[var(--bg)]" />
              </div>
              <div>
                <label className="flex items-center justify-between text-[0.85rem] font-medium text-[var(--text)] mb-1.5">
                  Description
                  <span className={`text-xs font-normal ${(editingEbook.description?.length ?? 0) > 100 ? 'text-orange-500' : 'text-[var(--muted)]'}`}>{editingEbook.description?.length ?? 0} / 120</span>
                </label>
                <textarea value={editingEbook.description ?? ''} onChange={e => setEditingEbook(b => b ? {...b, description: e.target.value.slice(0, 120)} : b)} placeholder="Brief description (max 120 chars)" rows={3} maxLength={120}
                  className="w-full px-4 py-2.5 border-[1.5px] border-[var(--border)] rounded-lg outline-none focus:border-[var(--primary)] text-[0.92rem] bg-[var(--bg)] resize-none" />
              </div>
              <div>
                <label className="block text-[0.85rem] font-medium text-[var(--text)] mb-1.5">Cover Image</label>
                <div onClick={() => coverFileRef.current?.click()}
                  className="border-2 border-dashed border-[var(--border)] rounded-xl p-5 text-center cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary-pale)] transition-all">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--muted)" strokeWidth="1.8" className="mx-auto mb-2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  <span className="text-[0.88rem] text-[var(--text)] font-medium">{uploadingCover ? 'Uploading...' : 'Click to upload cover image'}</span>
                  <p className="text-[var(--muted)] text-xs mt-1">JPG, PNG, WEBP · Max 2MB</p>
                </div>
                <input ref={coverFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={async e => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const url = await uploadCover(f)
                    if (url) setEditingEbook(b => b ? {...b, cover_url: url} : b)
                  }} />
              </div>
              {editingEbook.type === 'free' && (
                <div>
                  <label className="block text-[0.85rem] font-medium text-[var(--text)] mb-1.5">Google Drive Link (PDF)</label>
                  <input type="text" value={editingEbook.drive_link ?? ''} onChange={e => setEditingEbook(b => b ? {...b, drive_link: e.target.value} : b)} placeholder="https://drive.google.com/..."
                    className="w-full px-4 py-2.5 border-[1.5px] border-[var(--border)] rounded-lg outline-none focus:border-[var(--primary)] text-[0.92rem] bg-[var(--bg)]" />
                </div>
              )}
              {editingEbook.type === 'paid' && (
                <div>
                  <label className="block text-[0.85rem] font-medium text-[var(--text)] mb-1.5">Price (₦)</label>
                  <input type="number" value={editingEbook.price ?? ''} onChange={e => setEditingEbook(b => b ? {...b, price: Number(e.target.value)} : b)} placeholder="e.g. 5000"
                    className="w-full px-4 py-2.5 border-[1.5px] border-[var(--border)] rounded-lg outline-none focus:border-[var(--primary)] text-[0.92rem] bg-[var(--bg)]" />
                </div>
              )}
              <button onClick={saveEbook} className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-bold hover:bg-[var(--primary-light)] transition-colors">
                {editingEbook.id ? 'Save Changes' : `Add ${editingEbook.type === 'free' ? 'Free' : 'Paid'} Ebook`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[var(--dark)] text-white px-5 py-3 rounded-xl text-[0.88rem] font-medium shadow-xl animate-fade-in z-[100]">{toast}</div>
      )}
    </div>
  )
}

function EbookList({ ebooks, onEdit, onDelete }: { ebooks: Ebook[], onEdit: (e: Ebook) => void, onDelete: (id: string) => void }) {
  if (!ebooks.length) return (
    <div className="text-center py-8 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] text-[0.88rem]">No ebooks added yet.</div>
  )
  return (
    <div className="space-y-2.5">
      {ebooks.map(e => (
        <div key={e.id} className="flex items-center gap-3 p-3.5 border border-[var(--border)] rounded-xl bg-[var(--bg)]">
          <div className="w-11 h-11 rounded-lg bg-[var(--primary-pale)] overflow-hidden flex items-center justify-center flex-shrink-0">
            {e.cover_url
              ? <img src={e.cover_url} alt={e.title} className="w-full h-full object-cover" />
              : <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            }
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[var(--dark)] text-[0.9rem]">{e.title}</div>
            <div className="text-[var(--muted)] text-[0.78rem]">
              {e.type === 'paid' ? `₦${Number(e.price).toLocaleString()}` : e.drive_link ? '✓ Link set' : '⚠ No link'}
              {e.cover_url ? ' · ✓ Cover' : ' · No cover'}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(e)} className="w-8 h-8 rounded-lg border border-[var(--border)] bg-white flex items-center justify-center hover:border-[var(--primary)] hover:bg-[var(--primary-pale)] transition-all">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onClick={() => onDelete(e.id)} className="w-8 h-8 rounded-lg border border-[var(--border)] bg-white flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition-all">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- YOUTUBE VIDEO MANAGER ----
function YoutubeVideoManager({ showToast }: { showToast: (msg: string) => void }) {
  const [videos, setVideos] = useState<any[]>([])
  const [url, setUrl] = useState('')
  const [desc, setDesc] = useState('')
  const [fetching, setFetching] = useState(false)
  const [preview, setPreview] = useState<any>(null)
  const [fetchError, setFetchError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/youtube-videos').then(r => r.json()).then(d => { if (d.data) setVideos(d.data) })
  }, [])

  async function fetchPreview() {
    if (!url.trim()) return
    setFetching(true)
    setFetchError('')
    setPreview(null)
    try {
      const res = await fetch(`/api/youtube?url=${encodeURIComponent(url.trim())}`)
      const data = await res.json()
      if (!res.ok || !data.success) { setFetchError(data.error ?? 'Could not fetch video info'); return }
      setPreview(data)
    } catch { setFetchError('Network error. Please try again.') }
    finally { setFetching(false) }
  }

  async function saveVideo() {
    if (!preview) return
    setSaving(true)
    try {
      const res = await fetch('/api/youtube-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          video_id: preview.videoId,
          title: preview.title,
          description: desc.trim() || null,
          thumbnail: preview.thumbnail,
          position: videos.length,
        }),
      })
      const data = await res.json()
      if (!res.ok) { showToast('❌ ' + (data.error ?? 'Failed to save')); return }
      setVideos(v => [...v, data.data])
      setUrl(''); setDesc(''); setPreview(null)
      showToast('✅ Video added!')
    } catch { showToast('❌ Network error') }
    finally { setSaving(false) }
  }

  async function deleteVideo(id: string) {
    if (!confirm('Remove this video?')) return
    const res = await fetch(`/api/youtube-videos?id=${id}`, { method: 'DELETE' })
    if (res.ok) { setVideos(v => v.filter(x => x.id !== id)); showToast('Video removed') }
    else showToast('❌ Failed to remove')
  }

  return (
    <div className="space-y-4">
      {/* Existing videos */}
      {videos.length > 0 && (
        <div className="space-y-2.5 mb-4">
          {videos.map((v, i) => (
            <div key={v.id} className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-xl bg-[var(--bg)]">
              <img src={v.thumbnail} alt={v.title} className="w-20 h-12 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[var(--dark)] text-[0.85rem] line-clamp-1">{v.title}</div>
                {v.description && <div className="text-[var(--muted)] text-[0.75rem] line-clamp-1">{v.description}</div>}
              </div>
              <span className="text-[var(--muted)] text-xs bg-[var(--border)] px-2 py-0.5 rounded-full">{i+1}/3</span>
              <button onClick={() => deleteVideo(v.id)} className="w-8 h-8 rounded-lg border border-[var(--border)] bg-white flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition-all flex-shrink-0">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new video */}
      {videos.length < 3 && (
        <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg)] space-y-3">
          <p className="text-[0.82rem] font-semibold text-[var(--text)]">Add Video ({videos.length}/3)</p>
          <div className="flex gap-2">
            <input
              type="text" value={url} onChange={e => { setUrl(e.target.value); setPreview(null); setFetchError('') }}
              placeholder="Paste YouTube video URL..."
              className="flex-1 px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-[0.85rem] outline-none focus:border-[var(--primary)] bg-white"
            />
            <button onClick={fetchPreview} disabled={!url.trim() || fetching}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-[0.82rem] font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50 transition-colors whitespace-nowrap">
              {fetching ? '...' : 'Fetch'}
            </button>
          </div>

          {fetchError && <p className="text-red-500 text-[0.8rem]">{fetchError}</p>}

          {/* Preview */}
          {preview && (
            <div className="border border-[var(--primary)] rounded-xl overflow-hidden bg-white">
              <div className="flex gap-3 p-3">
                <img src={preview.thumbnail} alt={preview.title} className="w-24 h-14 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--dark)] text-[0.82rem] line-clamp-2 mb-1">{preview.title}</p>
                  <p className="text-[0.72rem] text-[var(--success)] font-medium">✓ Video found</p>
                </div>
              </div>
              <div className="px-3 pb-3">
                <label className="block text-[0.75rem] font-medium text-[var(--muted)] mb-1">Short description <span className="font-normal">(optional — shown on card)</span></label>
                <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. How to manage diabetes with diet..."
                  maxLength={100}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-[0.82rem] outline-none focus:border-[var(--primary)] bg-[var(--bg)]" />
                <p className="text-[0.7rem] text-[var(--muted)] mt-0.5 text-right">{desc.length}/100</p>
              </div>
              <div className="px-3 pb-3">
                <button onClick={saveVideo} disabled={saving}
                  className="w-full bg-[var(--primary)] text-white py-2.5 rounded-lg text-[0.85rem] font-bold hover:bg-[var(--primary-light)] disabled:opacity-60 transition-colors">
                  {saving ? 'Saving...' : '+ Add Video to Site'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {videos.length === 3 && (
        <p className="text-center text-[var(--muted)] text-[0.82rem] bg-[var(--bg)] py-3 rounded-xl border border-[var(--border)]">
          Maximum 3 videos reached. Delete one to add another.
        </p>
      )}
    </div>
  )
}
