'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'

const templates = [
  {
    id: 1,
    name: "MrBeast Style",
    description: "Bold yellow text with black outline",
    style: {
      background: "linear-gradient(45deg, #FFD700, #FFA500)",
      color: "#000000",
      fontWeight: "900",
      textShadow: "2px 2px 0px #000000",
      fontSize: "24px"
    },
    preview: "INSANE GIVEAWAY!"
  },
  {
    id: 2,
    name: "Viral TikTok",
    description: "White text with colorful background",
    style: {
      background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
      color: "#FFFFFF",
      fontWeight: "800",
      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
      fontSize: "22px"
    },
    preview: "This will blow your mind!"
  },
  {
    id: 3,
    name: "Netflix Style",
    description: "Clean white text on dark background",
    style: {
      background: "rgba(0,0,0,0.8)",
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: "20px",
      padding: "8px 16px",
      borderRadius: "4px"
    },
    preview: "Previously on Stranger Things..."
  },
  {
    id: 4,
    name: "Gaming Highlight",
    description: "Neon green with glow effect",
    style: {
      background: "rgba(0,0,0,0.7)",
      color: "#00FF41",
      fontWeight: "700",
      textShadow: "0 0 10px #00FF41",
      fontSize: "22px",
      border: "1px solid #00FF41"
    },
    preview: "HEADSHOT!"
  },
  {
    id: 5,
    name: "Instagram Reel",
    description: "Gradient text with shadow",
    style: {
      background: "linear-gradient(45deg, #833AB4, #FD1D1D, #FCB045)",
      color: "#FFFFFF",
      fontWeight: "800",
      textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
      fontSize: "24px"
    },
    preview: "Follow for more tips!"
  },
  {
    id: 6,
    name: "Podcast Style",
    description: "Simple and clean for long conversations",
    style: {
      background: "rgba(255,255,255,0.95)",
      color: "#333333",
      fontWeight: "500",
      fontSize: "18px",
      padding: "6px 12px",
      borderRadius: "20px"
    },
    preview: "So here's what happened..."
  }
]

export default function TemplatesSection() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-black to-[#51080d]/10">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
            All Your Favourite Templates
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Choose from viral subtitle styles used by top creators
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Template Selector */}
            <div className="lg:w-1/3">
              <h3 className="text-xl font-bold text-white mb-6">Choose Template</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedTemplate.id === template.id
                        ? 'border-[#FF4458] bg-[#FF4458]/20'
                        : 'border-[#51080d]/50 bg-black/30 hover:border-[#FF4458]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-5 h-5 text-[#FF4458]" />
                      <div className="font-bold text-white text-sm sm:text-base">
                        {template.name}
                      </div>
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm">
                      {template.description}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Video Preview */}
            <div className="lg:w-2/3">
              <motion.div
                key={selectedTemplate.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="aspect-video bg-gradient-to-br from-black to-[#51080d]/20 rounded-2xl flex items-center justify-center border border-[#51080d]/50 relative overflow-hidden">
                  {/* Background Video Mockup */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>
                  
                  {/* Play Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-gradient-to-r from-[#51080d] to-[#FF4458] p-6 sm:p-8 rounded-full cursor-pointer shadow-2xl z-20"
                  >
                    <Play size={48} className="text-white ml-2" />
                  </motion.div>
                  
                  {/* Dynamic Subtitle Preview */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-center z-10">
                    <div
                      style={selectedTemplate.style}
                      className="px-4 py-2 rounded-lg max-w-full text-center font-bold shadow-lg"
                    >
                      {selectedTemplate.preview}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {selectedTemplate.name}
                  </h4>
                  <p className="text-gray-300 mb-4">
                    {selectedTemplate.description}
                  </p>
                  
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
                    >
                      Use This Template
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-black text-[#FF4458] mb-2">50+</div>
              <div className="text-gray-300">Templates</div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#FF4458] mb-2">1M+</div>
              <div className="text-gray-300">Videos Created</div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#FF4458] mb-2">99%</div>
              <div className="text-gray-300">Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}