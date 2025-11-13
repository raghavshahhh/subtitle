'use client'

import { motion } from 'framer-motion'
import { Star, Play, Instagram, Youtube } from 'lucide-react'

const testimonials = [
  {
    name: "Raj Kumar",
    role: "YouTuber",
    platform: "YouTube",
    subscribers: "50K subs",
    avatar: "RK",
    rating: 5,
    text: "Saved 5 hours per video! Hindi captions are perfect. My audience engagement increased by 40%.",
    icon: Youtube
  },
  {
    name: "Priya Sharma",
    role: "Content Creator",
    platform: "Instagram",
    subscribers: "25K followers",
    avatar: "PS",
    rating: 5,
    text: "Best subtitle tool for Indian creators. Punjabi support is amazing. Worth every rupee!",
    icon: Instagram
  },
  {
    name: "Arjun Singh",
    role: "Film Editor",
    platform: "Professional",
    subscribers: "10+ films",
    avatar: "AS",
    rating: 5,
    text: "Professional quality subtitles in minutes. Client loves the custom styling options.",
    icon: Play
  },
  {
    name: "Meera Patel",
    role: "Podcaster",
    platform: "Spotify",
    subscribers: "15K listeners",
    avatar: "MP",
    rating: 5,
    text: "Multi-speaker detection works perfectly. Saves hours of manual editing every episode.",
    icon: Play
  }
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Loved by 10,000+ Creators
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what creators are saying about SubtitleAI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8 hover:border-[#FF4458]/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-r from-[#51080d] to-[#FF4458] rounded-full w-12 h-12 flex items-center justify-center font-bold text-white">
                  {testimonial.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <div className="bg-[#51080d]/50 rounded-full p-1">
                      <testimonial.icon className="w-4 h-4 text-[#FF4458]" />
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{testimonial.role}</p>
                  <p className="text-[#FF4458] text-sm font-semibold">{testimonial.subscribers}</p>
                </div>

                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <blockquote className="text-gray-300 leading-relaxed">
                "{testimonial.text}"
              </blockquote>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="flex justify-center items-center gap-4 mb-6">
            <button className="w-3 h-3 bg-[#FF4458] rounded-full"></button>
            <button className="w-3 h-3 bg-[#51080d] rounded-full"></button>
            <button className="w-3 h-3 bg-[#51080d] rounded-full"></button>
          </div>
          
          <p className="text-gray-300">
            Join thousands of creators who trust SubtitleAI
          </p>
        </motion.div>
      </div>
    </section>
  )
}