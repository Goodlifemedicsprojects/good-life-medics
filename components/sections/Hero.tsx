import Image from 'next/image'

export default function Hero() {
  return (
    <section className="min-h-[90vh] bg-gradient-to-br from-[var(--primary-pale)] to-[var(--bg)] relative overflow-hidden">
      <div className="absolute right-[-100px] top-[-100px] w-[600px] h-[600px] rounded-full bg-[var(--primary)]/5" />
      <div className="max-w-[1160px] mx-auto px-10 py-20 flex items-center gap-16 min-h-[90vh]">
        {/* Content */}
        <div className="flex-1 max-w-[560px]">
          <div className="inline-flex items-center gap-1.5 bg-[var(--accent-light)] text-[#7a5c20] border border-[#e8d4a8] px-3.5 py-1 rounded-full text-[0.8rem] font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
            Trusted Medical Education
          </div>
          <h1 className="font-serif text-[clamp(2.2rem,4vw,3.2rem)] font-bold text-[var(--dark)] leading-tight mb-5">
            Evidence-Based Health Knowledge{' '}
            <em className="text-[var(--primary)] not-italic">At Your Fingertips</em>
          </h1>
          <p className="text-[1.05rem] text-[var(--muted)] leading-relaxed mb-8 max-w-[440px]">
            Get expert medical insights from a trusted YouTube health educator. Download free guides and access premium resources to take charge of your health.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="#free-ebooks" className="bg-[var(--primary)] text-white px-7 py-3.5 rounded-[10px] font-semibold text-[0.95rem] hover:bg-[var(--primary-light)] hover:-translate-y-0.5 transition-all no-underline">
              Get Free Ebook ↓
            </a>
            <a href="#paid-ebooks" className="border-[1.5px] border-[var(--primary)] text-[var(--primary)] px-7 py-3.5 rounded-[10px] font-semibold text-[0.95rem] hover:bg-[var(--primary-pale)] transition-all no-underline">
              Premium Guides
            </a>
          </div>
        </div>

        {/* Card */}
        <div className="flex-none w-[420px] hidden lg:flex items-center justify-center">
          <div className="bg-white rounded-[20px] p-8 border border-[var(--border)] w-full max-w-[360px] shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[52px] h-[52px] rounded-full bg-[var(--primary-pale)] border-[3px] border-[var(--primary)] flex items-center justify-center font-serif text-[1.3rem] text-[var(--primary)] font-bold">G</div>
              <div>
                <div className="font-semibold text-[var(--dark)] text-[0.95rem]">Good Life Medics</div>
                <div className="text-[0.8rem] text-[var(--muted)]">YouTube Health Educator</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['10K+', 'Subscribers'], ['50+', 'Videos'], ['5K+', 'Lives Impacted'], ['100%', 'Free Content']].map(([num, label]) => (
                <div key={label} className="bg-[var(--bg)] rounded-xl p-4 text-center border border-[var(--border)]">
                  <div className="font-serif text-[1.6rem] font-bold text-[var(--primary)]">{num}</div>
                  <div className="text-[0.75rem] text-[var(--muted)] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5 pt-5 border-t border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
              <div className="text-[0.8rem] text-[var(--muted)]">Evidence-based, expertly reviewed content</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
