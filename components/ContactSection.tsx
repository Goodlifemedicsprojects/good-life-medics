import { SiteConfig } from '@/types'

export default function ContactSection({ config }: { config: SiteConfig }) {
  const wa = config?.whatsapp_number
  const email = config?.creator_email
  const waMsg = encodeURIComponent('Hi! I have a question about Good Life Medics.')

  return (
    <section id="contact-section" className="py-16">
      <div className="max-w-[1160px] mx-auto px-10">
        <span className="inline-flex items-center gap-1.5 bg-[var(--primary-pale)] text-[var(--primary)] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3">Get In Touch</span>
        <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-bold text-[var(--dark)] mb-2">Contact &amp; Connect</h2>
        <p className="text-[var(--muted)] max-w-lg mb-10">Have a question, want to collaborate, or just want to say hi? Reach out through any of the channels below.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* YouTube — full width */}
          <div className="md:col-span-2 bg-gradient-to-r from-[var(--primary)] to-[#0d7a7a] rounded-[20px] p-7">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-[52px] h-[52px] bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" width="30" height="30"><path fill="#FF0000" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </div>
              <div>
                <div className="text-white/60 text-xs font-bold uppercase tracking-wide mb-0.5">YouTube Channel</div>
                <div className="text-white font-semibold">@chinonyeremeuphemia8308</div>
                <div className="text-white/70 text-[0.83rem]">Watch free medical videos every week. Subscribe and never miss a video!</div>
              </div>
            </div>
            <a href="https://www.youtube.com/@chinonyeremeuphemia8308" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[var(--primary)] px-5 py-2.5 rounded-xl text-[0.83rem] font-semibold no-underline hover:bg-[var(--primary-pale)] transition-colors">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
              Visit YouTube Channel
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-white border border-[var(--border)] rounded-[20px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[52px] h-[52px] bg-[#e8f9ef] rounded-[14px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#1aad19" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              </div>
              <div>
                <div className="text-[var(--muted)] text-xs font-bold uppercase tracking-wide">WhatsApp</div>
                <div className="font-semibold text-[var(--dark)]">{wa ?? 'Not configured yet'}</div>
                <div className="text-[var(--muted)] text-[0.83rem]">For ebook purchases or direct enquiries.</div>
              </div>
            </div>
            {wa ? (
              <a href={`https://wa.me/${wa.replace(/[^0-9]/g,'')}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1aad19] text-white px-4 py-2 rounded-xl text-[0.83rem] font-semibold no-underline hover:bg-[#148a13] transition-colors">
                Chat on WhatsApp
              </a>
            ) : (
              <span className="text-[0.8rem] text-[var(--muted)] bg-[var(--bg)] border border-dashed border-[var(--border)] px-3 py-1.5 rounded-lg inline-block">WhatsApp number will appear once configured</span>
            )}
          </div>

          {/* Email */}
          <div className="bg-white border border-[var(--border)] rounded-[20px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[52px] h-[52px] bg-[var(--primary-pale)] rounded-[14px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--primary)" strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <div className="text-[var(--muted)] text-xs font-bold uppercase tracking-wide">Email</div>
                <div className="font-semibold text-[var(--dark)]">{email ?? 'Not configured yet'}</div>
                <div className="text-[var(--muted)] text-[0.83rem]">For collaborations or general questions.</div>
              </div>
            </div>
            {email ? (
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-[0.83rem] font-semibold no-underline hover:bg-[var(--primary-light)] transition-colors">
                Send an Email
              </a>
            ) : (
              <span className="text-[0.8rem] text-[var(--muted)] bg-[var(--bg)] border border-dashed border-[var(--border)] px-3 py-1.5 rounded-lg inline-block">Email will appear once configured</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
