'use client'

import { motion } from 'framer-motion'
import { Zap, Globe, Palette, DollarSign, Mic, Target } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: "AI-Powered Accuracy",
    description: "98% accuracy with Gemini AI. Auto punctuation and grammar fix. Speaker detection included.",
    color: "from-[#51080d] to-[#FF4458]"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "10 min video equals 2 min processing. Real-time preview. Instant exports to any format.",
    color: "from-[#FF4458] to-[#51080d]"
  },
  {
    icon: Globe,
    title: "50+ Languages",
    description: "All Indian languages supported. Auto translation. Cultural context aware AI.",
    color: "from-[#51080d] to-[#FF4458]"
  },
  {
    icon: Palette,
    title: "Custom Styling",
    description: "20+ preset styles. Custom fonts and colors. Karaoke effects. Professional templates.",
    color: "from-[#FF4458] to-[#51080d]"
  },
  {
    icon: DollarSign,
    title: "Free to Start",
    description: "60 mins free credits. No credit card needed. Pay as you grow. Cancel anytime.",
    color: "from-[#51080d] to-[#FF4458]"
  },
  {
    icon: Mic,
    title: "Studio Audio",
    description: "AI noise removal. Voice enhancement. Crystal clear output. Multi-speaker support.",
    color: "from-[#FF4458] to-[#51080d]"
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
            Why Creators Love Us
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Everything you need to create professional subtitles in minutes, not hours
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-[#FF4458]/50 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">
                {feature.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}