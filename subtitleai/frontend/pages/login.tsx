import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const MotionDiv = motion.div as any
const MailIcon = Mail as any
const LockIcon = Lock as any
const ArrowLeftIcon = ArrowLeft as any
const LinkComponent = Link as any

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Demo credentials fallback
    const demoEmail = 'demo@subtitleai.com'
    const demoPassword = 'demo123'

    try {
      if (email === demoEmail && password === demoPassword) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userEmail', email)
        router.push('/dashboard')
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      if (data.user) {
        router.push('/dashboard')
      }
    } catch (error: any) {
      setError(error.message || 'Invalid credentials. Try demo@subtitleai.com / demo123')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login - SubtitleAI</title>
        <meta name="description" content="Sign in to your SubtitleAI account" />
      </Head>

      <div className="min-h-screen bg-black mouse-glow flex items-center justify-center">
        <div className="w-full max-w-md mx-4">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8 shadow-2xl"
          >
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeftIcon size={20} />
              Back to Home
            </button>

            <div className="text-center mb-8">
              <div className="text-2xl font-black text-white mb-4">
                Subtitle<span className="text-[#FF4458]">AI</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-300 mb-6">
                Sign in to your account
              </p>
              
            </div>

            <div className="mb-6">
              <button 
                onClick={handleGoogleLogin}
                className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>
            
            <div className="bg-[#51080d]/20 border border-[#51080d]/50 rounded-lg p-3 text-sm mb-4">
              <p className="text-[#FF4458] font-semibold mb-1">Demo Login:</p>
              <p className="text-gray-300">Email: demo@subtitleai.com</p>
              <p className="text-gray-300">Password: demo123</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="text-[#FF4458] text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <LinkComponent href="/forgot-password" className="text-[#FF4458] hover:text-white transition-colors text-sm">
                Forgot your password?
              </LinkComponent>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <LinkComponent href="/signup" className="text-[#FF4458] hover:text-white transition-colors font-medium">
                  Sign up
                </LinkComponent>
              </p>
            </div>
          </MotionDiv>
        </div>
      </div>
    </>
  )
}