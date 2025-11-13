import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const LinkComponent = Link as any
const MotionDiv = motion.div as any
const ArrowLeftIcon = ArrowLeft as any

export default function Refund() {
  return (
    <>
      <Head>
        <title>Refund Policy - SubtitleAI</title>
        <meta name="description" content="SubtitleAI Refund Policy - Our commitment to customer satisfaction." />
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
                Refund Policy
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
                <h2 className="text-2xl font-bold text-white mb-4">7-Day Money Back Guarantee</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We stand behind our service with a 7-day money-back guarantee. If you're not completely satisfied with SubtitleAI, you can request a full refund within 7 days of your purchase.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Eligible Refunds</h2>
                <div className="text-gray-300 space-y-4">
                  <p>You are eligible for a refund if:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You request the refund within 7 days of purchase</li>
                    <li>You have used less than 50% of your purchased credits</li>
                    <li>The service did not meet the advertised specifications</li>
                    <li>You experienced technical issues that we couldn't resolve</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Non-Refundable Items</h2>
                <div className="text-gray-300 space-y-4">
                  <p>The following are not eligible for refunds:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Credits that have been fully used</li>
                    <li>Requests made after 7 days from purchase</li>
                    <li>Accounts suspended for terms of service violations</li>
                    <li>Free tier usage (no purchase involved)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Refund Process</h2>
                <div className="text-gray-300 space-y-4">
                  <p>To request a refund:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Contact us at raghav@ragspro.com with your refund request</li>
                    <li>Include your account email and reason for the refund</li>
                    <li>We will review your request within 24 hours</li>
                    <li>If approved, refunds are processed within 5-7 business days</li>
                    <li>Refunds are issued to the original payment method</li>
                  </ol>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Subscription Cancellations</h2>
                <div className="text-gray-300 space-y-4">
                  <p>For subscription plans:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You can cancel your subscription at any time</li>
                    <li>Cancellation takes effect at the end of the current billing period</li>
                    <li>No refunds for partial months unless within the 7-day window</li>
                    <li>You retain access to paid features until the subscription expires</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Processing Time</h2>
                <div className="text-gray-300 space-y-4">
                  <p>Refund processing times:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Credit/Debit Cards: 5-7 business days</li>
                    <li>UPI/Net Banking: 3-5 business days</li>
                    <li>Digital Wallets: 1-3 business days</li>
                  </ul>
                  <p className="mt-4">Note: Processing times may vary depending on your bank or payment provider.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                <div className="text-gray-300">
                  <p>For refund requests or questions about this policy, please contact us:</p>
                  <p className="mt-2">
                    Email: <a href="mailto:raghav@ragspro.com" className="text-[#FF4458] hover:text-white transition-colors">raghav@ragspro.com</a>
                  </p>
                  <p className="mt-2">
                    Response Time: Within 24 hours
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