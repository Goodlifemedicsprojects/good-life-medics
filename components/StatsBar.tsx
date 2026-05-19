export default function StatsBar() {
  const stats = [
    ['10,000+', 'YouTube Subscribers'],
    ['5,000+', 'Ebooks Downloaded'],
    ['50+', 'Health Topics Covered'],
    ['100%', 'Free Core Content'],
  ]
  return (
    <div className="py-10">
      <div className="max-w-[1160px] mx-auto px-10 flex justify-center gap-16 flex-wrap">
        {stats.map(([num, label]) => (
          <div key={label} className="text-center">
            <div className="font-serif text-[2rem] font-bold text-white">{num}</div>
            <div className="text-[0.82rem] text-white/70 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
