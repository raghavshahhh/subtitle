'use client'

import { motion } from 'framer-motion'
import { Upload, Cpu, Download } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drag & drop video",
    details: "Supports MP4, MOV, AVI. Max 2GB free, 10GB pro"
  },
  {
    icon: Cpu,
    title: "AI Magic",
    description: "Gemini generates perfect subtitles",
    details: "Audio extraction → Noise removal → Transcription"
  },
  {
    icon: Download,
    title: "Download",
    description: "Export as SRT, VTT or MP4",
    details: "Edit, style, and export in your preferred format"
  }
]

export default function HowItWorksSection() {
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
            From Upload to Export in 3 Steps
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional subtitles in minutes, not hours
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-[#51080d] to-[#FF4458] rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-sm">
                  <div className="bg-black/20 rounded-2xl p-6 mb-6">
                    <step.icon className="w-12 h-12 text-white mx-auto" />
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-black/30 rounded-full px-4 py-1 text-white font-bold text-sm mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/90 font-semibold mb-2">
                      {step.description}
                    </p>
                    <p className="text-white/70 text-sm">
                      {step.details}
                    </p>
                  </div>
                </div>
              </motion.div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                    className="w-16 h-1 bg-gradient-to-r from-[#51080d] to-[#FF4458] mx-4"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(255,68,88,0.4)] transition-all duration-300">
            Try it Free →
          </button>
        </motion.div>
      </div>
    </section>
  )
}