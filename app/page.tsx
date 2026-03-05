import type { Metadata } from 'next'
import Hero from '@/components/customer/Hero'
import HowItWorks from '@/components/customer/HowItWorks'
import WhyNourishMom from '@/components/customer/WhyNourishMom'
import CTABanner from '@/components/customer/CTABanner'
import Footer from '@/components/customer/Footer'

export const metadata: Metadata = {
  title: 'Nourish Mom — Meals for New Moms',
  description:
    'Postpartum-friendly meal delivery designed for new mothers. Fresh, nourishing food delivered on your schedule.',
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <WhyNourishMom />
      <CTABanner />
      <Footer showNav />
    </main>
  )
}
