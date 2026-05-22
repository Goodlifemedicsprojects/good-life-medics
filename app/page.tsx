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

  const card = 'overflow-hidden sm:rounded-[22px] sm:shadow-md sm:mb-3'

  return (
    <>
      <WelcomePopup freeEbooks={freeEbooks} />
      {/* Fixed smart navbar */}
      <Navbar />

      {/* Content — padded top to account for fixed navbar */}
      <div className="pt-[58px] sm:pt-[80px] max-w-[1260px] mx-auto">
        <div className="sm:mx-5">
          <div className="divide-y divide-[var(--border)] sm:divide-y-0 sm:space-y-3">

            <div className={`bg-white ${card}`}><Hero /></div>
            <div className={`bg-[var(--primary)] ${card}`}><StatsBar /></div>
            <div className={`bg-white ${card}`}><AboutSection config={config} /></div>
            <div className={`bg-[var(--primary-pale)] ${card}`}><EbooksSection ebooks={freeEbooks} type="free" /></div>
            <div className={`bg-white ${card}`}><EbooksSection ebooks={paidEbooks} type="paid" config={config} /></div>
            <div className={`bg-[var(--primary)] ${card}`}><TestimonialsSection /></div>
            <div className={`bg-white ${card}`}><WatchLearnSection /></div>
            <div className={`bg-white ${card}`}><NewsletterSection /></div>
            <div className={`bg-[var(--primary-pale)] ${card}`}><ContactSection config={config} /></div>
            <div className={`bg-[var(--dark)] sm:rounded-[22px] sm:shadow-md sm:mb-3`}><Footer /></div>

          </div>
        </div>
      </div>
    </>
  )
}
