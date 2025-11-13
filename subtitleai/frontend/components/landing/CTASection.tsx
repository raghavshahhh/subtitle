'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#51080d]/20 via-black to-[#51080d]/20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#FF4458] rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 10 + i * 2,
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

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-r from-[#51080d] to-[#FF4458] rounded-full p-4"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Create Magic?
          </h2>
          
          <p className="text-2xl text-gray-300 mb-8 font-medium">
            Join 10,000+ creators making professional subtitles in seconds
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 px-4">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 68, 88, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-2xl hover:shadow-[0_0_50px_rgba(255,68,88,0.4)] transition-all duration-300"
              >
                Start Creating Free
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
            
            <p className="text-gray-400 text-sm">
              No credit card required - 60 minutes free
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-black text-[#FF4458] mb-2">10K+</div>
              <div className="text-gray-300">Happy Creators</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-black text-[#FF4458] mb-2">98%</div>
              <div className="text-gray-300">Accuracy Rate</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-black text-[#FF4458] mb-2">2 Min</div>
              <div className="text-gray-300">Processing Time</div>
            </motion.div>
          </div>

          {/* Floating laptop mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            animate={{ y: [0, -10, 0] }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-[#51080d]/30 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/50 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
              <div className="bg-black rounded-2xl p-6 border border-[#51080d]/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-gradient-to-r from-[#51080d] to-[#FF4458] rounded w-3/4"></div>
                  <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-700 rounded w-2/3"></div>
                  <div className="h-8 bg-gradient-to-r from-[#51080d] to-[#FF4458] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SubtitleAI Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}