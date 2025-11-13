'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Type assertions for React 18 compatibility
const MotionDiv = motion.div as any
const AnimatePresenceComponent = AnimatePresence as any
const XIcon = X as any
const MailIcon = Mail as any
const LockIcon = Lock as any
const UserIcon = User as any

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, mode: initialMode }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Demo credentials
    const demoEmail = 'demo@subtitleai.com'
    const demoPassword = 'demo123'

    try {
      if (mode === 'signup') {
        // For demo, just show success message
        setError('Account created successfully! You can now login with demo@subtitleai.com / demo123')
      } else {
        // Check demo credentials
        if (email === demoEmail && password === demoPassword) {
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('userEmail', email)
          onClose()
          window.location.href = '/dashboard'
        } else {
          setError('Invalid credentials. Use demo@subtitleai.com / demo123')
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresenceComponent>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-black border-2 border-[#51080d]/50 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl backdrop-blur-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XIcon size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-300 mb-4">
                {mode === 'login' ? 'Sign in to your account' : 'Start creating amazing subtitles'}
              </p>
              {mode === 'login' && (
                <div className="bg-[#51080d]/20 border border-[#51080d]/50 rounded-lg p-3 text-sm">
                  <p className="text-[#FF4458] font-semibold mb-1">Demo Credentials:</p>
                  <p className="text-gray-300">Email: demo@subtitleai.com</p>
                  <p className="text-gray-300">Password: demo123</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div>
                  <label className="block text-white mb-2 font-semibold">Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#FF4458] focus:outline-none backdrop-blur-sm"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-white mb-2 font-semibold">Email</label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#FF4458] focus:outline-none backdrop-blur-sm"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Password</label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#FF4458] focus:outline-none backdrop-blur-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className={`text-sm text-center font-medium ${
                  error.includes('successfully') ? 'text-green-400' : 'text-[#FF4458]'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-gray-300 hover:text-[#FF4458] transition-colors font-medium"
              >
                {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresenceComponent>
  )
}