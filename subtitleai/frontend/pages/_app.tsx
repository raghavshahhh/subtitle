import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'
import MouseGlow from '@/components/MouseGlow'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setLoading(false)
    }
    
    checkInitialSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          // User signed in - redirect to dashboard
          if (router.pathname === '/login' || router.pathname === '/signup' || router.pathname === '/') {
            router.push('/dashboard')
          }
        } else if (event === 'SIGNED_OUT') {
          // User signed out - go to landing page only if not already there
          if (router.pathname !== '/') {
            window.location.href = '/'
          }
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red-accent"></div>
      </div>
    )
  }

  return (
    <>
      <MouseGlow />
      <Component {...pageProps} />
    </>
  )
}