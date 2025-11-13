import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - SubtitleAI</title>
        <meta name="description" content="SubtitleAI Terms of Service - Rules and guidelines for using our service." />
      </Head>

      <div className="min-h-screen bg-black mouse-glow">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#51080d]/30">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
            <Link href="/" className="text-xl sm:text-2xl font-black text-white">
              Subtitle<span className="text-[#FF4458]">AI</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </header>

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Terms of Service
              </h1>
              <p className="text-gray-300 text-lg">
                Last updated: January 15, 2025
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8 space-y-8"
            >
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
                <div className="text-gray-300 space-y-4">
                  <p>By accessing and using SubtitleAI, you accept and agree to be bound by the terms and provision of this agreement.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Use License</h2>
                <div className="text-gray-300 space-y-4">
                  <p>Permission is granted to temporarily use SubtitleAI for personal and commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose without proper licensing</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">User Content</h2>
                <div className="text-gray-300 space-y-4">
                  <p>You retain ownership of all content you upload to SubtitleAI. By uploading content, you grant us:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The right to process your videos for subtitle generation</li>
                    <li>Temporary storage rights for processing purposes</li>
                    <li>The right to use anonymized data for service improvement</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Prohibited Uses</h2>
                <div className="text-gray-300 space-y-4">
                  <p>You may not use SubtitleAI for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Illegal or unauthorized purposes</li>
                    <li>Uploading copyrighted content without permission</li>
                    <li>Generating subtitles for harmful or offensive content</li>
                    <li>Attempting to compromise the security of the service</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Payment Terms</h2>
                <div className="text-gray-300 space-y-4">
                  <p>For paid services:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All payments are processed securely through Razorpay</li>
                    <li>Subscriptions renew automatically unless cancelled</li>
                    <li>Refunds are available within 7 days of purchase</li>
                    <li>Credits do not expire but are non-transferable</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Service Availability</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We reserve the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Perform scheduled maintenance</li>
                    <li>Update or modify the service</li>
                    <li>Suspend accounts that violate these terms</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                <div className="text-gray-300 space-y-4">
                  <p>SubtitleAI and RagsPro shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                <div className="text-gray-300">
                  <p>If you have any questions about these Terms of Service, please contact us at:</p>
                  <p className="mt-2">
                    Email: <a href="mailto:raghav@ragspro.com" className="text-[#FF4458] hover:text-white transition-colors">raghav@ragspro.com</a>
                  </p>
                </div>
              </section>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}