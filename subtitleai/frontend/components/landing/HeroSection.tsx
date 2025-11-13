'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Upload } from 'lucide-react'

export default function HeroSection() {
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'hi',
    name: 'Hindi',
    text: 'नमस्ते दोस्तों, आज हम बात करेंगे...'
  })

  return (
    <section className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#51080d] rounded-full opacity-30"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 text-center relative z-10 pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight px-4">
            Generate Studio-Grade
            <br className="hidden sm:block" />
            <span className="text-[#FF4458] bg-gradient-to-r from-[#51080d] to-[#FF4458] bg-clip-text text-transparent"> Subtitles </span>
            in Seconds
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto font-medium leading-relaxed px-4">
            Auto captions for Hindi, English, Punjabi & 50+ languages.
            <br className="hidden sm:block" />
            <span className="text-[#FF4458] font-semibold"> 98% accuracy</span> with AI-powered transcription.
          </p>

          <div className="flex justify-center mb-20 px-4">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 68, 88, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl hover:shadow-[0_0_50px_rgba(255,68,88,0.4)] transition-all duration-300 min-w-[250px]"
              >
                <Upload size={28} />
                Upload Video →
              </motion.button>
            </Link>
          </div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl mx-4"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Language Selector */}
              <div className="lg:w-1/3">
                <h3 className="text-xl font-bold text-white mb-4">Select Your Language</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { code: 'hi', name: 'Hindi', text: 'नमस्ते दोस्तों, आज हम बात करेंगे...' },
                    { code: 'en', name: 'English', text: 'Hello friends, today we will talk about...' },
                    { code: 'pa', name: 'Punjabi', text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਅੱਜ ਅਸੀਂ ਗੱਲ ਕਰਾਂਗੇ...' },
                    { code: 'ta', name: 'Tamil', text: 'வணக்கம் நண்பர்கள், இன்று நாம் பேசுவோம்...' },
                    { code: 'te', name: 'Telugu', text: 'నమస్కారం స్నేహితులు, ఈ రోజు మనం మాట్లాడుతాం...' },
                    { code: 'bn', name: 'Bengali', text: 'নমস্কার বন্ধুরা, আজ আমরা কথা বলব...' }
                  ].map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedLanguage.code === lang.code
                          ? 'border-[#FF4458] bg-[#FF4458]/20 text-white'
                          : 'border-[#51080d]/50 bg-black/30 text-gray-300 hover:border-[#FF4458]/50'
                      }`}
                    >
                      <div className="font-semibold text-sm">{lang.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Video Demo */}
              <div className="lg:w-2/3">
                <div className="aspect-video bg-gradient-to-br from-black to-[#51080d]/20 rounded-2xl flex items-center justify-center border border-[#51080d]/50 relative overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-gradient-to-r from-[#51080d] to-[#FF4458] p-6 sm:p-8 rounded-full cursor-pointer shadow-2xl z-10"
                  >
                    <Play size={48} className="text-white ml-2" />
                  </motion.div>
                  
                  {/* Dynamic Subtitle */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-[#51080d]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#FF4458] rounded-full animate-pulse"></div>
                      <span className="text-white font-medium text-sm sm:text-base">
                        {selectedLanguage.text}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mt-6 text-lg font-medium text-center">
                  See live subtitle generation in action
                </p>
              </div>
            </div>
          </motion.div>


        </motion.div>
      </div>
    </section>
  )
}