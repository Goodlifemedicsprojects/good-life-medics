import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-12 px-10">
      <div className="max-w-[1160px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-[34px] h-[34px] bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/></svg>
              </div>
              <span className="font-serif text-[1.1rem] text-white font-bold">Good Life Medics</span>
            </div>
            <p className="text-white/60 text-[0.85rem] leading-relaxed max-w-[240px]">Evidence-based health education for everyone. Making medicine simple, accessible, and actionable.</p>
            <div className="flex gap-2.5 mt-4">
              {[
                { href: 'https://www.youtube.com/@chinonyeremeuphemia8308', icon: <><path fill="#FF0000" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></>, fill: true },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-[34px] h-[34px] rounded-lg bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors no-underline">
                  <svg viewBox="0 0 24 24" width="16" height="16">{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-[0.9rem]">Quick Links</h4>
            {[['About Us', '#about'], ['Free Guides', '#free-ebooks'], ['Premium Guides', '#paid-ebooks'], ['Contact', '#contact-section']].map(([label, href]) => (
              <a key={label} href={href} className="block text-white/60 text-[0.85rem] mb-2 no-underline hover:text-white transition-colors">{label}</a>
            ))}
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-[0.9rem]">Resources</h4>
            {[['Privacy Policy', '#'], ['Terms of Use', '#'], ['YouTube Channel', 'https://www.youtube.com/@chinonyeremeuphemia8308'], ['Contact Us', '#contact-section']].map(([label, href]) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block text-white/60 text-[0.85rem] mb-2 no-underline hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex items-center justify-between flex-wrap gap-3">
          <span className="text-white/50 text-[0.82rem]">© {new Date().getFullYear()} Good Life Medics. All rights reserved.</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 px-4 py-2 rounded-full text-[0.82rem] font-medium cursor-pointer hover:bg-white/20 transition-colors">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
            Back to Top
          </button>
          <Link href="/admin" className="text-white/30 text-[0.82rem] no-underline hover:text-white/60 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
