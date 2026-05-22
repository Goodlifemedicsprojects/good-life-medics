import { SiteConfig } from '@/types'

export default function ContactSection({ config }: { config: SiteConfig }) {
  const wa = config?.whatsapp_number
  const email = config?.creator_email
  const waMsg = encodeURIComponent('Hi! I have a question about Good Life Medics.')

  return (
    <section id="contact-section" className="py-8 sm:py-16">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-10">
        <span className="inline-flex items-center gap-1.5 bg-[var(--primary-pale)] text-[var(--primary)] px-3 py-1 rounded-full text-[0.72rem] font-semibold uppercase tracking-wide mb-2">Get In Touch</span>
        <h2 className="font-serif text-[1.5rem] sm:text-[2.2rem] font-bold text-[var(--dark)] mb-2">Contact &amp; Connect</h2>
        <p className="text-[var(--muted)] text-[0.82rem] sm:text-[1rem] max-w-lg mb-7">Have a question, want to collaborate, or just want to say hi?</p>

        <div className="space-y-4">
          {/* YouTube — featured */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[#0d7a7a] rounded-[20px] p-5 sm:p-7">
            <div className="flex items-start sm:items-center gap-4 mb-4">
              <div className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" width="26" height="26">
                  <path fill="#FF0000" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                  <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </div>
              <div>
                <div className="text-white/60 text-[0.68rem] font-bold uppercase tracking-wide mb-0.5">YouTube Channel</div>
                <div className="text-white font-semibold text-[0.88rem] sm:text-[1rem]">@chinonyeremeuphemia8308</div>
                <div className="text-white/70 text-[0.78rem] mt-0.5">Free medical videos every week — subscribe!</div>
              </div>
            </div>
            <a href="https://www.youtube.com/@chinonyeremeuphemia8308" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[var(--primary)] px-4 py-2 rounded-xl text-[0.78rem] sm:text-[0.83rem] font-semibold no-underline hover:bg-[var(--primary-pale)] transition-colors">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
              Visit YouTube Channel
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div className="bg-white border border-[var(--border)] rounded-[20px] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-[44px] h-[44px] bg-[#e8f9ef] rounded-[12px] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1aad19" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                </div>
                <div>
                  <div className="text-[var(--muted)] text-[0.68rem] font-bold uppercase tracking-wide">WhatsApp</div>
                  <div className="font-semibold text-[var(--dark)] text-[0.85rem]">{wa ?? 'Not configured yet'}</div>
                </div>
              </div>
              {wa ? (
                <a href={`https://wa.me/${wa.replace(/[^0-9]/g,'')}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1aad19] text-white px-4 py-2 rounded-xl text-[0.78rem] font-semibold no-underline hover:bg-[#148a13] transition-colors">
                  Chat on WhatsApp
                </a>
              ) : (
                <span className="text-[0.75rem] text-[var(--muted)] bg-[var(--bg)] border border-dashed border-[var(--border)] px-3 py-1.5 rounded-lg inline-block">Will appear once configured</span>
              )}
            </div>

            {/* Email */}
            <div className="bg-white border border-[var(--border)] rounded-[20px] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-[44px] h-[44px] bg-[var(--primary-pale)] rounded-[12px] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--primary)" strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <div className="text-[var(--muted)] text-[0.68rem] font-bold uppercase tracking-wide">Email</div>
                  <div className="font-semibold text-[var(--dark)] text-[0.85rem] truncate max-w-[160px]">{email ?? 'Not configured yet'}</div>
                </div>
              </div>
              {email ? (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-[0.78rem] font-semibold no-underline hover:bg-[var(--primary-light)] transition-colors">
                  Send an Email
                </a>
              ) : (
                <span className="text-[0.75rem] text-[var(--muted)] bg-[var(--bg)] border border-dashed border-[var(--border)] px-3 py-1.5 rounded-lg inline-block">Will appear once configured</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
