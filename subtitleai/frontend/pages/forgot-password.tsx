import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      
      setSent(true)
    } catch (error: any) {
      console.error('Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Forgot Password - SubtitleAI</title>
        <meta name="description" content="Reset your SubtitleAI password" />
      </Head>

      <div className="min-h-screen bg-black mouse-glow flex items-center justify-center">
        <div className="w-full max-w-md mx-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8 shadow-2xl"
          >
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              Back to Login
            </Link>

            <div className="text-center mb-8">
              <div className="text-2xl font-black text-white mb-4">
                Subtitle<span className="text-[#FF4458]">AI</span>
              </div>
              
              {!sent ? (
                <>
                  <h1 className="text-3xl font-black text-white mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-gray-300">
                    Enter your email and we'll send you a reset link
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h1 className="text-3xl font-black text-white mb-2">
                    Check Your Email
                  </h1>
                  <p className="text-gray-300">
                    We've sent a password reset link to {email}
                  </p>
                </>
              )}
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-semibold">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm text-center">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="w-full border-2 border-[#51080d] text-white py-3 rounded-xl font-bold hover:bg-[#51080d]/20 transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Remember your password?{' '}
                <Link href="/login" className="text-[#FF4458] hover:text-white transition-colors font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}