export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[var(--primary-pale)] to-[var(--bg)] relative overflow-hidden">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-10 py-10 sm:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Content */}
        <div className="flex-1 max-w-[560px] text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[var(--accent-light)] text-[#7a5c20] border border-[#e8d4a8] px-3 py-1 rounded-full text-[0.75rem] font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
            Trusted Medical Education
          </div>
          <h1 className="font-serif text-[1.8rem] sm:text-[2.5rem] lg:text-[3.2rem] font-bold text-[var(--dark)] leading-tight mb-4">
            Evidence-Based Health Knowledge{' '}
            <em className="text-[var(--primary)] not-italic">At Your Fingertips</em>
          </h1>
          <p className="text-[0.9rem] sm:text-[1.05rem] text-[var(--muted)] leading-relaxed mb-6 max-w-[440px] mx-auto lg:mx-0">
            Get expert medical insights from a trusted YouTube health educator. Download free guides and access premium resources.
          </p>
          <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
            <a href="#free-ebooks" className="bg-[var(--primary)] text-white px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-[10px] font-semibold text-[0.88rem] sm:text-[0.95rem] hover:bg-[var(--primary-light)] transition-colors no-underline">
              Get Free Checklist ↓
            </a>
            <a href="#paid-ebooks" className="border-[1.5px] border-[var(--primary)] text-[var(--primary)] px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-[10px] font-semibold text-[0.88rem] sm:text-[0.95rem] hover:bg-[var(--primary-pale)] transition-colors no-underline">
              Premium Guides
            </a>
          </div>
        </div>

        {/* Stats Card — hidden on small mobile, shown from sm up */}
        <div className="hidden sm:flex flex-none w-full lg:w-[380px] items-center justify-center">
          <div className="bg-white rounded-[20px] p-6 border border-[var(--border)] w-full max-w-[360px] shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[48px] h-[48px] rounded-full bg-[var(--primary-pale)] border-[3px] border-[var(--primary)] flex items-center justify-center font-serif text-[1.2rem] text-[var(--primary)] font-bold">G</div>
              <div>
                <div className="font-semibold text-[var(--dark)] text-[0.9rem]">Good Life Medics</div>
                <div className="text-[0.75rem] text-[var(--muted)]">YouTube Health Educator</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[['10K+', 'Subscribers'], ['50+', 'Videos'], ['5K+', 'Lives Impacted'], ['100%', 'Free Content']].map(([num, label]) => (
                <div key={label} className="bg-[var(--bg)] rounded-xl p-3 text-center border border-[var(--border)]">
                  <div className="font-serif text-[1.4rem] font-bold text-[var(--primary)]">{num}</div>
                  <div className="text-[0.72rem] text-[var(--muted)] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
              <div className="text-[0.75rem] text-[var(--muted)]">Evidence-based, expertly reviewed content</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
