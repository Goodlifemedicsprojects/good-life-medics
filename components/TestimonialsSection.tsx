const testimonials = [
  { initials: 'AN', name: 'Adaeze Nwosu', location: 'Lagos, Nigeria', text: 'The diabetes guide completely changed how I manage my condition. Written in such a clear, understandable way — no medical jargon!' },
  { initials: 'EO', name: 'Emeka Obi', location: 'Abuja, Nigeria', text: 'I downloaded the heart health guide and immediately shared it with my family. The practical tips are life-changing. Thank you Good Life Medics!' },
  { initials: 'FK', name: 'Fatima Kabir', location: 'Kano, Nigeria', text: 'Finally, a Nigerian medical educator I can trust! The content is scientifically accurate and so relevant to our local context and diet.' },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-8 sm:py-16">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-10">
        <div className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 px-3 py-1 rounded-full text-[0.72rem] font-semibold uppercase tracking-wide mb-2">Testimonials</div>
        <h2 className="font-serif text-[1.5rem] sm:text-[2.2rem] font-bold text-white mb-2">What Our Readers Say</h2>
        <p className="text-white/70 text-[0.85rem] sm:text-[1rem] max-w-lg mb-7">Thousands of people have transformed their health knowledge with our guides.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-6">
              <div className="text-[var(--accent)] text-[0.9rem] mb-2">★★★★★</div>
              <p className="text-white/85 text-[0.82rem] sm:text-[0.9rem] leading-relaxed italic mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-[0.72rem] font-semibold flex-shrink-0">{t.initials}</div>
                <div>
                  <div className="text-white font-semibold text-[0.82rem]">{t.name}</div>
                  <div className="text-white/60 text-[0.72rem]">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
