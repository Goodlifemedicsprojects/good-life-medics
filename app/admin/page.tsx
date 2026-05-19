'use client'
import { useState, useEffect, useRef } from 'react'
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

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
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
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#cfe0e0] flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] p-10 w-full max-w-[380px] shadow-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <h2 className="font-serif text-[1.3rem] text-[var(--dark)]">Admin Login</h2>
            <p className="text-[var(--muted)] text-[0.85rem] mt-1">Good Life Medics Dashboard</p>
          </div>
          {loginError && <div className="bg-red-50 text-red-600 text-[0.85rem] rounded-lg px-4 py-2.5 mb-4">{loginError}</div>}
          <form onSubmit={doLogin} className="space-y-4">
            <div>
              <label className="block text-[0.85rem] font-medium text-[var(--text)] mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password"
                className="w-full px-4 py-3 border-[1.5px] border-[var(--border)] rounded-[10px] outline-none focus:border-[var(--primary)] text-[0.92rem] bg-[var(--bg)]" />
            </div>
            <button type="submit" disabled={loginLoading}
              className="w-full bg-[var(--primary)] text-white py-3 rounded-[10px] font-bold hover:bg-[var(--primary-light)] disabled:opacity-60 transition-colors">
              {loginLoading ? 'Checking...' : 'Access Dashboard'}
            </button>
          </form>
          <a href="/" className="block text-center text-[var(--muted)] text-[0.85rem] mt-4 hover:text-[var(--primary)] no-underline">← Back to site</a>
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
          {[['Total Subscribers', subscribers.length, 'subscribers-section'], ['Free Ebooks', freeEbooks.length, 'free-section'], ['Paid Ebooks', paidEbooks.length, 'paid-section'], ['Newsletter', newsletter.length, 'newsletter-section']].map(([label, val, id]) => (
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

        {/* Free Ebooks */}
        <div id="free-section" className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-[var(--dark)]">Free Ebooks</h3>
              <p className="text-[var(--muted)] text-[0.82rem]">Manage free ebook listings</p>
            </div>
            <button onClick={() => { setEditingEbook({ type: 'free' }); setEbookModalOpen(true) }}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-[0.85rem] font-semibold hover:bg-[var(--primary-light)] transition-colors">+ Add Free Ebook</button>
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
              <p className="text-[var(--muted)] text-[0.82rem]">Users who downloaded a free ebook</p>
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
