import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, MapPin, Phone, Instagram, Globe } from 'lucide-react'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact - SubtitleAI</title>
        <meta name="description" content="Get in touch with the SubtitleAI team." />
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
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-white mb-2 font-semibold">Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl px-4 py-3 text-white focus:border-[#FF4458] focus:outline-none backdrop-blur-sm"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2 font-semibold">Email</label>
                    <input
                      type="email"
                      className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl px-4 py-3 text-white focus:border-[#FF4458] focus:outline-none backdrop-blur-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2 font-semibold">Subject</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl px-4 py-3 text-white focus:border-[#FF4458] focus:outline-none backdrop-blur-sm"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2 font-semibold">Message</label>
                    <textarea
                      rows={5}
                      className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl px-4 py-3 text-white focus:border-[#FF4458] focus:outline-none backdrop-blur-sm resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Get in touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-[#51080d] to-[#FF4458] p-3 rounded-xl">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Email</p>
                        <p className="text-gray-300">raghav@ragspro.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-[#51080d] to-[#FF4458] p-3 rounded-xl">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Location</p>
                        <p className="text-gray-300">Mumbai, India</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-[#51080d] to-[#FF4458] p-3 rounded-xl">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Response Time</p>
                        <p className="text-gray-300">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Follow us</h3>
                  
                  <div className="flex gap-4">
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
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}