import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Instagram, Globe, Mail } from 'lucide-react'

export default function About() {
  return (
    <>
      <Head>
        <title>About - SubtitleAI</title>
        <meta name="description" content="Learn about SubtitleAI, created by RagsPro agency and founded by Raghav Shah." />
      </Head>

      <div className="min-h-screen bg-black mouse-glow">
        {/* Header */}
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
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
                About SubtitleAI
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Revolutionizing subtitle creation with AI-powered technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Our Story */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  SubtitleAI was born from a simple frustration: creating subtitles was too slow and expensive for content creators. 
                  We saw creators spending hours manually adding captions to their videos, taking time away from what they do best - creating content.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Our mission is to democratize professional subtitle creation, making it accessible to every creator, 
                  regardless of their budget or technical expertise.
                </p>
              </motion.div>

              {/* Technology */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Our Technology</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Powered by Google Gemini AI, SubtitleAI delivers 98% accuracy across 50+ languages. 
                  Our advanced algorithms understand context, cultural nuances, and speaker patterns.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  We specialize in Indian languages - Hindi, Punjabi, Tamil, Telugu, Bengali - 
                  ensuring creators can reach their audience in their native language.
                </p>
              </motion.div>
            </div>

            {/* Founder Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-12">Meet Our Founder</h2>
              
              <div className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8 max-w-2xl mx-auto">
                <div className="w-32 h-32 bg-gradient-to-r from-[#51080d] to-[#FF4458] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white font-black text-4xl">RS</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Raghav Shah</h3>
                <p className="text-[#FF4458] font-semibold mb-4">Founder & CEO</p>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  Raghav is a passionate entrepreneur and AI enthusiast who founded SubtitleAI under the RagsPro agency. 
                  With a vision to empower creators worldwide, he combines cutting-edge technology with user-centric design 
                  to solve real-world problems in content creation.
                </p>

                <div className="flex justify-center gap-4">
                  <a 
                    href="https://instagram.com/ragsproai" 
                    target="_blank"
                    className="bg-gradient-to-r from-[#51080d] to-[#FF4458] p-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a 
                    href="https://ragspro.com" 
                    target="_blank"
                    className="bg-gradient-to-r from-[#51080d] to-[#FF4458] p-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
                  >
                    <Globe className="w-6 h-6 text-white" />
                  </a>
                  <a 
                    href="mailto:raghav@ragspro.com"
                    className="bg-gradient-to-r from-[#51080d] to-[#FF4458] p-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
                  >
                    <Mail className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* RagsPro Agency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Powered by RagsPro</h2>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto">
                SubtitleAI is proudly developed under RagsPro, a cutting-edge digital agency specializing in 
                AI-powered solutions for content creators and businesses. We build tools that matter, 
                solving real problems with innovative technology.
              </p>
              
              <a 
                href="https://ragspro.com" 
                target="_blank"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
              >
                <Globe size={20} />
                Visit RagsPro
              </a>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}