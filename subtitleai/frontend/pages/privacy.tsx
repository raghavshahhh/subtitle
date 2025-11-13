import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const LinkComponent = Link as any
const MotionDiv = motion.div as any
const ArrowLeftIcon = ArrowLeft as any

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - SubtitleAI</title>
        <meta name="description" content="SubtitleAI Privacy Policy - How we collect, use, and protect your data." />
      </Head>

      <div className="min-h-screen bg-black mouse-glow">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#51080d]/30">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
            <LinkComponent href="/" className="text-xl sm:text-2xl font-black text-white">
              Subtitle<span className="text-[#FF4458]">AI</span>
            </LinkComponent>
            <LinkComponent href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeftIcon size={20} />
              Back to Home
            </LinkComponent>
          </div>
        </header>

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Privacy Policy
              </h1>
              <p className="text-gray-300 text-lg">
                Last updated: January 15, 2025
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8 space-y-8"
            >
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We collect information you provide directly to us, such as when you create an account, upload videos, or contact us for support.</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Account information (email, name)</li>
                    <li>Video files and generated subtitles</li>
                    <li>Payment information (processed securely by Razorpay)</li>
                    <li>Usage data and analytics</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide and improve our subtitle generation services</li>
                    <li>Process payments and manage your account</li>
                    <li>Send you updates and support communications</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We implement appropriate security measures to protect your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All data is encrypted in transit and at rest</li>
                    <li>Video files are automatically deleted after 30 days</li>
                    <li>Access to personal data is restricted to authorized personnel</li>
                    <li>Regular security audits and updates</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Data Sharing</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>With your explicit consent</li>
                    <li>To trusted service providers who assist in our operations</li>
                    <li>When required by law or to protect our rights</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                <div className="text-gray-300 space-y-4">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access and update your personal information</li>
                    <li>Delete your account and associated data</li>
                    <li>Export your data in a portable format</li>
                    <li>Opt out of marketing communications</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                <div className="text-gray-300">
                  <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                  <p className="mt-2">
                    Email: <a href="mailto:raghav@ragspro.com" className="text-[#FF4458] hover:text-white transition-colors">raghav@ragspro.com</a>
                  </p>
                </div>
              </section>
            </MotionDiv>
          </div>
        </main>
      </div>
    </>
  )
}