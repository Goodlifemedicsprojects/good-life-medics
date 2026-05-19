import { supabaseAdmin } from '@/lib/supabase'
import { Ebook, SiteConfig } from '@/types'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import StatsBar from '@/components/StatsBar'
import AboutSection from '@/components/AboutSection'
import EbooksSection from '@/components/EbooksSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import WatchLearnSection from '@/components/WatchLearnSection'
import NewsletterSection from '@/components/NewsletterSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import WelcomePopup from '@/components/WelcomePopup'

async function getData() {
  const [ebooksRes, configRes] = await Promise.all([
    supabaseAdmin.from('ebooks').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('site_config').select('*').single(),
  ])
  return {
    ebooks: (ebooksRes.data ?? []) as Ebook[],
    config: (configRes.data ?? {}) as SiteConfig,
  }
}

export const revalidate = 60

export default async function HomePage() {
  const { ebooks, config } = await getData()
  const freeEbooks = ebooks.filter(e => e.type === 'free')
  const paidEbooks = ebooks.filter(e => e.type === 'paid')

  // Shared card classes
  const card = 'overflow-hidden shadow-sm sm:shadow-md sm:rounded-[24px] sm:mb-[1rem]'
  const divider = 'border-t border-[var(--border)] sm:border-0'

  return (
    <>
      <WelcomePopup freeEbooks={freeEbooks} />
      <div className="max-w-[1260px] mx-auto sm:mx-auto">
        <div className="sm:mx-[1.2rem]">

          {/* Nav — sticky, no radius on mobile */}
          <div className={`bg-white sticky top-0 z-50 sm:top-4 sm:rounded-[20px] sm:mb-[1rem] shadow-sm sm:shadow-lg`}>
            <Navbar />
          </div>

          <div className={`bg-white ${card}`}><Hero /></div>
          <div className={`bg-[var(--primary)] ${card} ${divider}`}><StatsBar /></div>
          <div className={`bg-white ${card} ${divider}`}><AboutSection config={config} /></div>
          <div className={`bg-[var(--primary-pale)] ${card} ${divider}`}><EbooksSection ebooks={freeEbooks} type="free" /></div>
          <div className={`bg-white ${card} ${divider}`}><EbooksSection ebooks={paidEbooks} type="paid" config={config} /></div>
          <div className={`bg-[var(--primary)] ${card} ${divider}`}><TestimonialsSection /></div>
          <div className={`bg-white ${card} ${divider}`}><WatchLearnSection /></div>
          <div className={`bg-white ${card} ${divider}`}><NewsletterSection /></div>
          <div className={`bg-[var(--primary-pale)] ${card} ${divider}`}><ContactSection config={config} /></div>
          <div className={`bg-[var(--dark)] ${card} ${divider}`}><Footer /></div>
        </div>
      </div>
    </>
  )
}
