'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Perfect for trying out",
    features: [
      "60 minutes/month",
      "720p quality",
      "Basic styles",
      "SRT/VTT export",
      "Hindi, English, Punjabi",
      "Email support"
    ],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "₹299",
    period: "/month",
    description: "Best for creators",
    features: [
      "500 minutes/month",
      "4K quality",
      "All 20+ styles",
      "Priority processing",
      "50+ languages",
      "API access",
      "Custom branding",
      "Priority support"
    ],
    buttonText: "Start Pro",
    popular: true
  },
  {
    name: "Team",
    price: "₹999",
    period: "/month",
    description: "For agencies & teams",
    features: [
      "Unlimited minutes",
      "4K quality",
      "White-label solution",
      "Team collaboration",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee"
    ],
    buttonText: "Contact Sales",
    popular: false
  }
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-20 bg-gradient-to-b from-[#51080d]/10 to-black">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Simple Pricing, No Surprises
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Start free, upgrade when you need more. Cancel anytime.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-gray-300">Monthly</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="w-12 h-6 bg-[#51080d] rounded-full cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform translate-x-0.5 translate-y-0.5"></div>
              </div>
            </div>
            <span className="text-white font-semibold">Yearly <span className="text-[#FF4458]">(Save 20%)</span></span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 rounded-3xl p-8 ${
                plan.popular 
                  ? 'border-[#FF4458] scale-105 shadow-2xl shadow-[#FF4458]/20' 
                  : 'border-[#51080d]/30 hover:border-[#FF4458]/50'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-300 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#51080d] to-[#FF4458] rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white hover:shadow-[0_0_30px_rgba(255,68,88,0.4)]'
                    : 'border-2 border-[#51080d] text-white hover:bg-[#51080d]/20 hover:border-[#FF4458]'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-4">All plans include:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <span>✓ Unlimited projects</span>
            <span>✓ Cloud storage</span>
            <span>✓ Mobile app access</span>
            <span>✓ 7-day money back</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}