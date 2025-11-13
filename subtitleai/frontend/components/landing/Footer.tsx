'use client'

import { motion } from 'framer-motion'
import { Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'API', href: '/api' },
    { name: 'Integrations', href: '/integrations' }
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refund' }
  ]
}

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/subtitleai', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/subtitleai', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/subtitleai', label: 'YouTube' }
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#51080d]/30">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-black text-white mb-4">
              Subtitle<span className="text-[#FF4458]">AI</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Make subtitles sexy again. AI-powered subtitle generation for creators worldwide.
            </p>
            
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="bg-gradient-to-r from-[#51080d] to-[#FF4458] p-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
                >
                  <social.icon className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>raghav@ragspro.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={category}>
              <h3 className="text-white font-bold text-lg mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-[#FF4458] transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#51080d]/30 pt-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 SubtitleAI by <a href="https://ragspro.com" target="_blank" className="text-[#FF4458] hover:text-white transition-colors">RagsPro</a> - Made with love in India
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>SSL Secured</span>
              <span>99.9% Uptime</span>
              <span>Global CDN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}