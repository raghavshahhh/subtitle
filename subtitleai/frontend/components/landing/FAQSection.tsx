'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: "How accurate are the subtitles?",
    answer: "Our AI achieves 98% accuracy using Google Gemini. For Hindi and Indian languages, we've fine-tuned the model to understand cultural context, slang, and regional accents. You can always edit any mistakes in our visual editor."
  },
  {
    question: "How fast is the processing?",
    answer: "A 10-minute video typically processes in 2-3 minutes. Processing time depends on video length, audio quality, and language. Pro users get priority processing for even faster results."
  },
  {
    question: "Can I try before paying?",
    answer: "Yes! You get 60 minutes of free processing every month. No credit card required to start. You can test all features including Hindi, English, and Punjabi subtitles."
  },
  {
    question: "Which languages are supported?",
    answer: "We support 50+ languages including all major Indian languages: Hindi, English, Punjabi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and more. Auto-translation between languages is also available."
  },
  {
    question: "What export formats do you support?",
    answer: "You can export as SRT, VTT (WebVTT), or MP4 with burned-in subtitles. SRT works with YouTube, VTT for web players, and MP4 for social media platforms like Instagram and TikTok."
  },
  {
    question: "Can I edit the subtitles?",
    answer: "Absolutely! Our visual editor lets you edit text, adjust timing, change styling, and preview changes in real-time. You can also split, merge, or delete subtitle segments as needed."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use enterprise-grade security. Videos are encrypted during upload and processing. We automatically delete processed files after 30 days. Your data is never shared with third parties."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund, no questions asked."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#51080d]/10">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Got Questions?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about SubtitleAI
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto px-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-2xl p-6 text-left hover:border-[#FF4458]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white pr-4">
                    {faq.question}
                  </h3>
                  <div className="bg-gradient-to-r from-[#51080d] to-[#FF4458] rounded-full p-2 flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-black/30 backdrop-blur-sm border-2 border-[#51080d]/20 rounded-2xl p-6 mt-2 ml-4 mr-4">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-6">
            Still have questions? We're here to help!
          </p>
          <button className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300">
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  )
}