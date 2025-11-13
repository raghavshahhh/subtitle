import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI-Powered Subtitles",
    excerpt: "Discover how artificial intelligence is revolutionizing subtitle creation for content creators worldwide.",
    author: "Raghav Shah",
    date: "January 15, 2025",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Why Indian Language Support Matters",
    excerpt: "Breaking language barriers in content creation with native support for Hindi, Punjabi, Tamil and more.",
    author: "RagsPro Team",
    date: "January 10, 2025",
    readTime: "3 min read"
  },
  {
    id: 3,
    title: "Best Practices for Video Subtitles",
    excerpt: "Learn the dos and don'ts of subtitle creation to maximize engagement and accessibility.",
    author: "Raghav Shah",
    date: "January 5, 2025",
    readTime: "7 min read"
  }
]

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog - SubtitleAI</title>
        <meta name="description" content="Latest insights and updates from SubtitleAI team." />
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
                Blog
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Latest insights, updates, and tips from the SubtitleAI team
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#51080d]/20 to-black/50 backdrop-blur-xl border-2 border-[#51080d]/30 rounded-3xl p-8 hover:border-[#FF4458]/50 transition-all duration-300"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 hover:text-[#FF4458] transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mt-16"
            >
              <p className="text-gray-300 mb-6">
                More articles coming soon. Stay tuned for updates!
              </p>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
              >
                Back to Home
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}