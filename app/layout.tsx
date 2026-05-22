import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Good Life Medics — Evidence-Based Health Education',
  description: 'Get expert medical insights from a trusted YouTube health educator. Download free checklists and access premium resources to take charge of your health.',
  keywords: 'health education, medical guides, free checklists, Nigeria health, Good Life Medics',
  openGraph: {
    title: 'Good Life Medics',
    description: 'Evidence-Based Health Knowledge At Your Fingertips',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans bg-[#cfe0e0]`}>
        {children}
      </body>
    </html>
  )
}
