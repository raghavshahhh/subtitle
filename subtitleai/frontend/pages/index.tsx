import { useState } from 'react'
import Link from 'next/link'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import TemplatesSection from '@/components/landing/TemplatesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import PricingSection from '@/components/landing/PricingSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import FAQSection from '@/components/landing/FAQSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'
import AuthModal from '@/components/auth/AuthModal'
import Head from 'next/head'

export default function Home() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({ isOpen: false, mode: 'login' })

  return (
    <>
      <Head>
        <title>SubtitleAI - Generate Studio-Grade Subtitles in Seconds</title>
        <meta name="description" content="AI-powered subtitle generation for creators. 98% accuracy in Hindi, English, Punjabi & 50+ languages." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#51080d]/30">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-black text-white">
            Subtitle<span className="text-[#FF4458]">AI</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors font-medium">Pricing</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors font-medium">Testimonials</a>
            <a href="/about" className="text-gray-300 hover:text-white transition-colors font-medium">About</a>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors font-semibold text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300 text-sm sm:text-base inline-block text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      
      <main className="bg-black mouse-glow">
        <HeroSection />
        <FeaturesSection />
        <TemplatesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
      />
    </>
  )
}