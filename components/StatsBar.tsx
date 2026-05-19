export default function StatsBar() {
  const stats = [
    ['10,000+', 'YouTube Subscribers'],
    ['5,000+', 'Ebooks Downloaded'],
    ['50+', 'Health Topics'],
    ['100%', 'Free Content'],
  ]
  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-10 grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-16">
        {stats.map(([num, label]) => (
          <div key={label} className="text-center">
            <div className="font-serif text-[1.5rem] sm:text-[2rem] font-bold text-white">{num}</div>
            <div className="text-[0.72rem] sm:text-[0.82rem] text-white/70 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
