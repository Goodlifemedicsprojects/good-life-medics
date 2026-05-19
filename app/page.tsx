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

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const { ebooks, config } = await getData()
  const freeEbooks = ebooks.filter(e => e.type === 'free')
  const paidEbooks = ebooks.filter(e => e.type === 'paid')

  return (
    <>
      <WelcomePopup freeEbooks={freeEbooks} />
      <div className="max-w-[1260px] mx-auto">
        <div className="mx-[1.2rem]">
          {/* Sticky Nav Card */}
          <div className="bg-white/97 rounded-[20px] shadow-lg sticky top-4 z-50 mb-[1.2rem]">
            <Navbar />
          </div>

          {/* Hero */}
          <div className="bg-white rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <Hero />
          </div>

          {/* Stats */}
          <div className="bg-[var(--primary)] rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <StatsBar />
          </div>

          {/* About */}
          <div className="bg-white rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <AboutSection config={config} />
          </div>

          {/* Free Ebooks */}
          <div className="bg-[var(--primary-pale)] rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <EbooksSection ebooks={freeEbooks} type="free" />
          </div>

          {/* Paid Ebooks */}
          <div className="bg-white rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <EbooksSection ebooks={paidEbooks} type="paid" config={config} />
          </div>

          {/* Testimonials */}
          <div className="bg-[var(--primary)] rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <TestimonialsSection />
          </div>

          {/* Watch & Learn */}
          <div className="bg-white rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <WatchLearnSection />
          </div>

          {/* Newsletter */}
          <div className="bg-white rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <NewsletterSection />
          </div>

          {/* Contact */}
          <div className="bg-[var(--primary-pale)] rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <ContactSection config={config} />
          </div>

          {/* Footer */}
          <div className="bg-[var(--dark)] rounded-[24px] shadow-md overflow-hidden mb-[1.2rem]">
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}
