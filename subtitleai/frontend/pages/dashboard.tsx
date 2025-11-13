import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Upload, Play, Download, Settings, LogOut, Plus, Clock, CheckCircle, Home, FileText, HelpCircle, User, Sparkles, X, Mail, Loader2, Share2, Edit3 } from 'lucide-react'

// Type assertions for components to fix React 18 compatibility
const MotionDiv = motion.div as any
const MotionButton = motion.button as any
const HomeIcon = Home as any
const FileTextIcon = FileText as any
const LogOutIcon = LogOut as any
const UserIcon = User as any
const SettingsIcon = Settings as any
const HelpCircleIcon = HelpCircle as any
const UploadIcon = Upload as any
const CheckCircleIcon = CheckCircle as any
const Loader2Icon = Loader2 as any
const PlayIcon = Play as any
const Edit3Icon = Edit3 as any
const DownloadIcon = Download as any
const Share2Icon = Share2 as any
const SparklesIcon = Sparkles as any
const MailIcon = Mail as any
const XIcon = X as any
const ClockIcon = Clock as any
import { supabase } from '@/lib/supabase'
import SubtitleEditor from '@/components/SubtitleEditor'

interface Language {
  id: string
  name: string
  flag: string
  description: string
}

interface Template {
  id: number
  name: string
  description: string
  style: React.CSSProperties
  preview: string
}

interface User {
  id?: string
  name: string
  email: string
  plan: string
  avatar?: string
}

interface UploadedVideo {
  name: string
  size: string
  type: string
  file: File
  url: string
}

interface GeneratedVideo {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl?: string
  subtitles?: any[]
  template: Template
  language: Language
  duration: string
}

interface Project {
  id: string
  title: string
  video_url: string
  thumbnail_url?: string
  subtitles?: any[]
  status: string
  created_at: string
  duration?: number
}

const languages: Language[] = [
  {
    id: 'auto',
    name: 'Auto Detect',
    flag: '🌐',
    description: 'Automatically detect language'
  },
  {
    id: 'hi',
    name: 'Hindi',
    flag: '🇮🇳',
    description: 'हिंदी भाषा'
  },
  {
    id: 'en',
    name: 'English',
    flag: '🇺🇸',
    description: 'English language'
  },
  {
    id: 'pa',
    name: 'Punjabi',
    flag: '🇮🇳',
    description: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ'
  },
  {
    id: 'ta',
    name: 'Tamil',
    flag: '🇮🇳',
    description: 'தமிழ் மொழி'
  },
  {
    id: 'te',
    name: 'Telugu',
    flag: '🇮🇳',
    description: 'తెలుగు భాష'
  },
  {
    id: 'bn',
    name: 'Bengali',
    flag: '🇮🇳',
    description: 'বাংলা ভাষা'
  },
  {
    id: 'gu',
    name: 'Gujarati',
    flag: '🇮🇳',
    description: 'ગુજરાતી ભાષા'
  },
  {
    id: 'mr',
    name: 'Marathi',
    flag: '🇮🇳',
    description: 'मराठी भाषा'
  },
  {
    id: 'kn',
    name: 'Kannada',
    flag: '🇮🇳',
    description: 'ಕನ್ನಡ ಭಾಷೆ'
  },
  {
    id: 'ml',
    name: 'Malayalam',
    flag: '🇮🇳',
    description: 'മലയാളം ഭാഷ'
  },
  {
    id: 'or',
    name: 'Odia',
    flag: '🇮🇳',
    description: 'ଓଡ଼ିଆ ଭାଷା'
  },
  {
    id: 'ur',
    name: 'Urdu',
    flag: '🇵🇰',
    description: 'اردو زبان'
  },
  {
    id: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    description: 'Idioma español'
  },
  {
    id: 'fr',
    name: 'French',
    flag: '🇫🇷',
    description: 'Langue française'
  },
  {
    id: 'de',
    name: 'German',
    flag: '🇩🇪',
    description: 'Deutsche Sprache'
  },
  {
    id: 'ja',
    name: 'Japanese',
    flag: '🇯🇵',
    description: '日本語'
  },
  {
    id: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
    description: '한국어'
  },
  {
    id: 'zh',
    name: 'Chinese',
    flag: '🇨🇳',
    description: '中文'
  },
  {
    id: 'ar',
    name: 'Arabic',
    flag: '🇸🇦',
    description: 'اللغة العربية'
  }
]

const getTemplatePreview = (template: Template, language: Language): string => {
  const previews: Record<string, Record<number, string>> = {
    hi: {
      1: "शानदार गिवअवे!",
      2: "यह आपका दिमाग उड़ा देगा!",
      3: "पहले स्ट्रेंजर थिंग्स में...",
      4: "हेडशॉट!",
      5: "और टिप्स के लिए फॉलो करें!",
      6: "तो यहाँ क्या हुआ..."
    },
    pa: {
      1: "ਸ਼ਾਨਦਾਰ ਗਿਵਅਵੇ!",
      2: "ਇਹ ਤੁਹਾਡਾ ਦਿਮਾਗ ਉਡਾ ਦੇਵੇਗਾ!",
      3: "ਪਹਿਲਾਂ ਸਟ੍ਰੇਂਜਰ ਥਿੰਗਜ਼ ਵਿੱਚ...",
      4: "ਹੈੱਡਸ਼ਾਟ!",
      5: "ਹੋਰ ਟਿਪਸ ਲਈ ਫਾਲੋ ਕਰੋ!",
      6: "ਤਾਂ ਇੱਥੇ ਕੀ ਹੋਇਆ..."
    },
    ta: {
      1: "அற்புதமான கிவ்அவே!",
      2: "இது உங்கள் மனதை வியக்க வைக்கும்!",
      3: "முன்பு ஸ்ட்ரேஞ்சர் திங்ஸில்...",
      4: "ஹெட்ஷாட்!",
      5: "மேலும் டிப்ஸுக்கு பின்தொடருங்கள்!",
      6: "அப்போ என்ன நடந்தது..."
    },
    te: {
      1: "అద్భుతమైన గివ్అవే!",
      2: "ఇది మీ మనసును ఆశ్చర్యపరుస్తుంది!",
      3: "మునుపు స్ట్రేంజర్ థింగ్స్‌లో...",
      4: "హెడ్‌షాట్!",
      5: "మరిన్ని టిప్స్ కోసం ఫాలో చేయండి!",
      6: "అప్పుడు ఏమి జరిగింది..."
    },
    bn: {
      1: "দুর্দান্ত গিভঅ্যাওয়ে!",
      2: "এটি আপনার মন উড়িয়ে দেবে!",
      3: "আগে স্ট্রেঞ্জার থিংসে...",
      4: "হেডশট!",
      5: "আরো টিপসের জন্য ফলো করুন!",
      6: "তাহলে এখানে কী হয়েছিল..."
    }
  }

  return previews[language.id]?.[template.id] || template.preview
}

const templates: Template[] = [
  {
    id: 1,
    name: "MrBeast Style",
    description: "Bold yellow with black outline",
    style: {
      background: "linear-gradient(45deg, #FFD700, #FFA500)",
      color: "#000000",
      fontWeight: "900",
      textShadow: "2px 2px 0px #000000",
      fontSize: "18px"
    },
    preview: "INSANE GIVEAWAY!"
  },
  {
    id: 2,
    name: "Viral TikTok",
    description: "Colorful gradient background",
    style: {
      background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
      color: "#FFFFFF",
      fontWeight: "800",
      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
      fontSize: "18px"
    },
    preview: "This will blow your mind!"
  },
  {
    id: 3,
    name: "Netflix Style",
    description: "Clean white on dark",
    style: {
      background: "rgba(0,0,0,0.8)",
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: "16px",
      padding: "6px 12px",
      borderRadius: "4px"
    },
    preview: "Previously on Stranger Things..."
  },
  {
    id: 4,
    name: "Gaming Highlight",
    description: "Neon green with glow",
    style: {
      background: "rgba(0,0,0,0.7)",
      color: "#00FF41",
      fontWeight: "700",
      textShadow: "0 0 10px #00FF41",
      fontSize: "18px",
      border: "1px solid #00FF41"
    },
    preview: "HEADSHOT!"
  },
  {
    id: 5,
    name: "Instagram Reel",
    description: "Gradient text with shadow",
    style: {
      background: "linear-gradient(45deg, #833AB4, #FD1D1D, #FCB045)",
      color: "#FFFFFF",
      fontWeight: "800",
      textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
      fontSize: "18px"
    },
    preview: "Follow for more tips!"
  },
  {
    id: 6,
    name: "Podcast Style",
    description: "Simple and clean",
    style: {
      background: "rgba(255,255,255,0.95)",
      color: "#333333",
      fontWeight: "500",
      fontSize: "16px",
      padding: "6px 12px",
      borderRadius: "20px"
    },
    preview: "So here's what happened..."
  },
  {
    id: 7,
    name: "Anime Style",
    description: "Bold with anime vibes",
    style: {
      background: "linear-gradient(45deg, #FF1744, #FF6B35)",
      color: "#FFFFFF",
      fontWeight: "900",
      textShadow: "3px 3px 0px #000000",
      fontSize: "20px",
      border: "2px solid #FFFFFF"
    },
    preview: "NANI?!"
  },
  {
    id: 8,
    name: "Minimalist",
    description: "Clean and simple",
    style: {
      background: "rgba(255,255,255,0.9)",
      color: "#2C2C2C",
      fontWeight: "400",
      fontSize: "16px",
      padding: "8px 16px",
      borderRadius: "8px"
    },
    preview: "Simple and elegant"
  },
  {
    id: 9,
    name: "Cyberpunk",
    description: "Futuristic neon style",
    style: {
      background: "rgba(0,0,0,0.8)",
      color: "#00FFFF",
      fontWeight: "700",
      textShadow: "0 0 15px #00FFFF",
      fontSize: "18px",
      border: "1px solid #00FFFF"
    },
    preview: "SYSTEM ONLINE"
  },
  {
    id: 10,
    name: "Retro Wave",
    description: "80s retro aesthetic",
    style: {
      background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
      color: "#FFFFFF",
      fontWeight: "800",
      textShadow: "2px 2px 0px #000000",
      fontSize: "18px"
    },
    preview: "TOTALLY RADICAL!"
  },
  {
    id: 11,
    name: "Horror Movie",
    description: "Spooky red text",
    style: {
      background: "rgba(0,0,0,0.9)",
      color: "#FF0000",
      fontWeight: "700",
      textShadow: "0 0 10px #FF0000",
      fontSize: "18px"
    },
    preview: "Don't look behind you..."
  },
  {
    id: 12,
    name: "Comedy Special",
    description: "Fun and playful",
    style: {
      background: "linear-gradient(45deg, #FFD700, #FF69B4)",
      color: "#000000",
      fontWeight: "800",
      textShadow: "1px 1px 0px #FFFFFF",
      fontSize: "18px"
    },
    preview: "That's what she said!"
  },
  {
    id: 13,
    name: "Documentary",
    description: "Professional and clean",
    style: {
      background: "rgba(0,0,0,0.7)",
      color: "#FFFFFF",
      fontWeight: "500",
      fontSize: "16px",
      padding: "8px 16px",
      borderRadius: "4px"
    },
    preview: "In the year 2023..."
  },
  {
    id: 14,
    name: "Sports Highlight",
    description: "Bold and energetic",
    style: {
      background: "linear-gradient(45deg, #FF4500, #FFD700)",
      color: "#FFFFFF",
      fontWeight: "900",
      textShadow: "2px 2px 0px #000000",
      fontSize: "20px"
    },
    preview: "GOAL!"
  },
  {
    id: 15,
    name: "Tech Review",
    description: "Modern tech style",
    style: {
      background: "rgba(0,0,0,0.8)",
      color: "#00FF00",
      fontWeight: "600",
      fontSize: "16px",
      padding: "6px 12px",
      borderRadius: "8px",
      border: "1px solid #00FF00"
    },
    preview: "Specs: 128GB RAM"
  },
  {
    id: 16,
    name: "Music Video",
    description: "Colorful and vibrant",
    style: {
      background: "linear-gradient(45deg, #FF1493, #00CED1, #FFD700)",
      color: "#FFFFFF",
      fontWeight: "800",
      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
      fontSize: "18px"
    },
    preview: "Drop the beat!"
  },
  {
    id: 17,
    name: "News Report",
    description: "Professional news style",
    style: {
      background: "rgba(0,0,139,0.9)",
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: "16px",
      padding: "8px 16px",
      borderRadius: "4px"
    },
    preview: "Breaking News:"
  },
  {
    id: 18,
    name: "Cooking Show",
    description: "Warm and inviting",
    style: {
      background: "linear-gradient(45deg, #FF6347, #FFD700)",
      color: "#FFFFFF",
      fontWeight: "700",
      textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
      fontSize: "18px"
    },
    preview: "Add a pinch of salt"
  },
  {
    id: 19,
    name: "Travel Vlog",
    description: "Adventure themed",
    style: {
      background: "linear-gradient(45deg, #32CD32, #87CEEB)",
      color: "#FFFFFF",
      fontWeight: "700",
      textShadow: "2px 2px 0px #000000",
      fontSize: "18px"
    },
    preview: "Next stop: Paris!"
  },
  {
    id: 20,
    name: "Educational",
    description: "Clear and readable",
    style: {
      background: "rgba(25,25,112,0.9)",
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: "16px",
      padding: "8px 16px",
      borderRadius: "8px"
    },
    preview: "Did you know that..."
  },
  {
    id: 21,
    name: "Fitness motivation",
    description: "Bold and motivating",
    style: {
      background: "linear-gradient(45deg, #FF4500, #FF1493)",
      color: "#FFFFFF",
      fontWeight: "900",
      textShadow: "2px 2px 0px #000000",
      fontSize: "20px"
    },
    preview: "NO PAIN, NO GAIN!"
  },
  {
    id: 22,
    name: "ASMR Style",
    description: "Soft and calming",
    style: {
      background: "rgba(221,160,221,0.8)",
      color: "#4B0082",
      fontWeight: "400",
      fontSize: "14px",
      padding: "6px 12px",
      borderRadius: "12px"
    },
    preview: "*whispers softly*"
  },
  {
    id: 23,
    name: "Meme Style",
    description: "Internet meme format",
    style: {
      background: "rgba(255,255,255,0.95)",
      color: "#000000",
      fontWeight: "900",
      fontSize: "24px",
      textTransform: "uppercase" as const
    },
    preview: "STONKS"
  },
  {
    id: 24,
    name: "Luxury Brand",
    description: "Elegant and premium",
    style: {
      background: "rgba(0,0,0,0.9)",
      color: "#FFD700",
      fontWeight: "300",
      fontSize: "16px",
      padding: "10px 20px",
      borderRadius: "4px",
      border: "1px solid #FFD700"
    },
    preview: "Exclusively yours"
  }
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User>({ name: 'Demo User', email: 'demo@subtitleai.com', plan: 'Plan - Free' })
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(null)
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('home')
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false)
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null)
  const [processingStep, setProcessingStep] = useState<string>('')
  const [processingProgress, setProcessingProgress] = useState<number>(0)
  const [showSubtitleEditor, setShowSubtitleEditor] = useState<boolean>(false)
  const [editingVideo, setEditingVideo] = useState<GeneratedVideo | null>(null)
  const [showPrepareModal, setShowPrepareModal] = useState<boolean>(false)
  const [audioEnhancement, setAudioEnhancement] = useState<boolean>(false)
  const [writingSystem, setWritingSystem] = useState<string>('default')

  // Memoized values for performance
  const popularLanguages = useMemo(() => languages.slice(0, 6), [])
  const templatePreview = useMemo(() =>
    getTemplatePreview(selectedTemplate, selectedLanguage),
    [selectedTemplate, selectedLanguage]
  )

  // Filter templates by language
  const languageFilteredTemplates = useMemo(() => {
    if (selectedLanguage.id === 'auto' || selectedLanguage.id === 'en') {
      return templates
    }
    // For non-English languages, show templates that have localized previews
    return templates
  }, [selectedLanguage])

  // Optimized handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredTemplates(templates)
    } else {
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.description.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredTemplates(filtered)
    }
  }, [])

  const handleTemplateSelect = useCallback((template: Template) => {
    setSelectedTemplate(template)
  }, [])

  const handleLanguageSelect = useCallback((language: Language) => {
    setSelectedLanguage(language)
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userEmail')
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
      window.location.href = '/'
    }
  }

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      video.preload = 'metadata'
      video.muted = true
      video.crossOrigin = 'anonymous'

      const cleanup = () => {
        if (video.src) {
          URL.revokeObjectURL(video.src)
        }
      }

      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error('Thumbnail generation timeout'))
      }, 10000)

      video.addEventListener('loadedmetadata', () => {
        try {
          canvas.width = Math.min(video.videoWidth || 640, 640)
          canvas.height = Math.min(video.videoHeight || 360, 360)
          video.currentTime = Math.min(1, video.duration * 0.1 || 1)
        } catch (error) {
          clearTimeout(timeout)
          cleanup()
          reject(error)
        }
      })

      video.addEventListener('seeked', () => {
        try {
          if (canvas.width > 0 && canvas.height > 0) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
            clearTimeout(timeout)
            cleanup()
            resolve(thumbnail)
          } else {
            throw new Error('Invalid canvas dimensions')
          }
        } catch (error) {
          clearTimeout(timeout)
          cleanup()
          reject(error)
        }
      })

      video.addEventListener('error', (e) => {
        clearTimeout(timeout)
        cleanup()
        reject(new Error('Failed to load video: ' + (e.message || 'Unknown error')))
      })

      try {
        video.src = URL.createObjectURL(file)
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Immediately set video for preview
      const videoUrl = URL.createObjectURL(file)
      setUploadedVideo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
        file: file,
        url: videoUrl
      })

      setIsUploading(true)
      setUploadProgress(0)

      // Fast upload progress simulation
      const progressSteps = [20, 50, 80, 95]
      let stepIndex = 0

      const progressInterval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
          setUploadProgress(progressSteps[stepIndex])
          stepIndex++
        } else {
          clearInterval(progressInterval)
        }
      }, 150)

      try {
        // Generate thumbnail
        const thumbnail = await generateVideoThumbnail(file)
        setVideoThumbnail(thumbnail)
        setUploadProgress(100)

        // Complete upload animation and show prepare modal
        setTimeout(() => {
          setIsUploading(false)
          setUploadProgress(0)
          setShowPrepareModal(true)
        }, 300)

      } catch (error) {
        console.error('Error generating thumbnail:', error)
        // Thumbnail generation failed, but video is already set - continue without thumbnail
        setVideoThumbnail(null)
        setUploadProgress(100)
        setTimeout(() => {
          setIsUploading(false)
          setUploadProgress(0)
          setShowPrepareModal(true)
        }, 300)
      }
    }
  }

  const handleGenerateSubtitles = async () => {
    if (!uploadedVideo) return

    try {
      setLoading(true)
      setProcessingProgress(0)
      setProcessingStep('Connecting to backend...')

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      console.log('🔗 Using API URL:', API_URL)
      
      // Test backend connection first
      try {
        const testRes = await fetch(`${API_URL}/api/health`, { 
          method: 'GET',
          mode: 'cors',
          credentials: 'omit'
        })
        if (!testRes.ok) throw new Error('Backend not responding')
        console.log('✅ Backend connected')
      } catch (err) {
        console.error('❌ Backend test failed:', err)
        throw new Error('Cannot connect to backend on port 8000. Run: ./RUN_NOW.sh')
      }

      setProcessingStep('Uploading video...')

      // Upload video to backend
      const formData = new FormData()
      formData.append('file', uploadedVideo.file)
      formData.append('title', uploadedVideo.name.replace(/\.[^/.]+$/, ''))
      formData.append('language', selectedLanguage.id === 'auto' ? 'hi' : selectedLanguage.id)
      formData.append('use_whisper', 'true')

      setProcessingProgress(20)
      setProcessingStep('Uploading to server...')
      
      const uploadResponse = await fetch(`${API_URL}/api/upload/video`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: formData
      }).catch(err => {
        console.error('Upload network error:', err)
        throw new Error('Upload failed: ' + err.message)
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error('❌ Upload failed:', uploadResponse.status, errorText)
        throw new Error(`Upload failed: ${uploadResponse.status}`)
      }

      const uploadResult = await uploadResponse.json()
      console.log('✅ Upload response:', uploadResult)
      
      const projectId = uploadResult.project_id
      
      if (!projectId) {
        console.error('❌ Invalid response:', uploadResult)
        throw new Error('No project ID received')
      }

      console.log('✅ Project created:', projectId)
      setProcessingProgress(40)
      setProcessingStep('Extracting audio...')

      // Poll for project status
      let attempts = 0
      const maxAttempts = 60
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const statusResponse = await fetch(`${API_URL}/api/projects/${projectId}?include_subtitles=true`, {
          mode: 'cors',
          credentials: 'omit'
        })

        if (!statusResponse.ok) {
          console.error('❌ Status check failed:', statusResponse.status)
          attempts++
          continue
        }

        const projectData = await statusResponse.json()
        console.log(`⏳ Status check ${attempts + 1}:`, projectData.status)
        
        if (projectData.status === 'completed') {
          setProcessingProgress(100)
          setProcessingStep('Complete!')

          // Store in sessionStorage for editor page
          const editorData = {
            projectId: projectData.id,
            videoUrl: projectData.video_url,
            subtitles: projectData.subtitles || [],
            template: selectedTemplate,
            language: selectedLanguage,
            thumbnailUrl: videoThumbnail || projectData.thumbnail_url || ''
          }
          
          sessionStorage.setItem('editorData', JSON.stringify(editorData))
          
          // Small delay to show completion
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Redirect to editor
          router.push('/editor')
          
          // Refresh projects
          await fetchProjects()
          break
        } else if (projectData.status === 'failed') {
          throw new Error('Processing failed')
        } else {
          // Update progress based on status
          const progress = 40 + (attempts / maxAttempts) * 50
          setProcessingProgress(Math.min(95, progress))
          setProcessingStep('Generating subtitles...')
        }
        
        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new Error('Processing timeout')
      }

    } catch (error) {
      console.error('Error:', error)
      alert('Error generating subtitles: ' + (error as Error).message)
    } finally {
      setLoading(false)
      setTimeout(() => {
        setProcessingProgress(0)
        setProcessingStep('')
      }, 1000)
    }
  }

  const fetchProjects = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/projects?userId=${user.id}`)
      const data = await response.json()

      if (data.success && data.projects) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleDownload = async (video: GeneratedVideo, event?: React.MouseEvent<HTMLButtonElement>) => {
    // Show loading state
    const target = event?.target as HTMLButtonElement
    let originalText = target?.textContent
    if (target) {
      target.textContent = 'Preparing...'
      target.disabled = true
    }
    
    try {

      // Get download URL from API
      const response = await fetch(`/api/download-video?projectId=${video.id}&userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        // Create download link
        const link = document.createElement('a')
        link.href = data.downloadUrl
        link.download = data.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        window.alert('Download started! Your video with subtitles is being downloaded.')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Download error:', error)
      window.alert('Download failed. Please try again.')
    } finally {
      // Reset button state
      const target = event?.target as HTMLButtonElement
      if (target) {
        target.textContent = originalText || 'Download'
        target.disabled = false
      }
    }
  }

  const handleShare = async (video: GeneratedVideo) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: `Check out my video with AI-generated subtitles!`,
          url: video.videoUrl
        })
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(video.videoUrl)
        window.alert('Video link copied to clipboard!')
      }
    } catch (error) {
      console.error('Share error:', error)
      // Fallback: Show share modal with sanitized URL
      const sanitizedUrl = encodeURIComponent(video.videoUrl)
      const shareText = `Check out my video: ${decodeURIComponent(sanitizedUrl)}`
      prompt('Copy this link to share:', shareText)
    }
  }


  useEffect(() => {
    const checkUser = async () => {
      // Check localStorage first for demo login
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const userEmail = localStorage.getItem('userEmail')

      if (isLoggedIn && userEmail) {
        setUser({
          id: 'demo-user',
          name: 'Demo User',
          email: userEmail,
          plan: 'Plan - Free'
        })
        return
      }

      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // Only redirect if not already authenticated
        setTimeout(() => {
          window.location.href = '/'
        }, 100)
      } else {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          plan: 'Plan - Free',
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
        })
        fetchProjects()
      }
    }

    // Small delay to allow auth state to settle
    const timer = setTimeout(checkUser, 100)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        if (!isLoggedIn) {
          window.location.href = '/'
        }
      } else if (event === 'SIGNED_IN' && session) {
        // User just signed in - update user state
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          plan: 'Plan - Free',
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
        })
        fetchProjects()
      }
    })

    return () => {
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <Head>
        <title>Dashboard - SubtitleAI</title>
        <meta name="description" content="Manage your subtitle projects" />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-56 bg-[#141414] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col">
          <div className="p-4 md:p-6">
            <div className="text-xl md:text-2xl font-black text-white mb-4 md:mb-8 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/')}>
              Subtitle<span className="text-[#FF4458]">AI</span>
            </div>

            <nav className="flex md:flex-col gap-2 md:space-y-1 overflow-x-auto md:overflow-x-visible">
              <div
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'home' ? 'bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white' : 'text-gray-400 hover:text-white hover:bg-[#51080d]/20'
                  }`}
              >
                <HomeIcon size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-sm">Home</span>
              </div>
              <div
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'projects' ? 'bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white' : 'text-gray-400 hover:text-white hover:bg-[#51080d]/20'
                  }`}
              >
                <ClockIcon size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-sm">Projects</span>
              </div>
              <div
                onClick={() => setActiveTab('help')}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'help' ? 'bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white' : 'text-gray-400 hover:text-white hover:bg-[#51080d]/20'
                  }`}
              >
                <HelpCircleIcon size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-sm">Help</span>
              </div>
            </nav>
          </div>

          <div className="hidden md:block mt-auto p-6">
            <div className="mb-6">
              <div className="text-white font-semibold mb-4 text-sm">Plan - Free</div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Storage</span>
                    <span className="text-[#FF4458]">0 GB / 5.0 GB Used</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Transcription Time</span>
                    <span className="text-[#FF4458]">10 mins remaining</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Audio Credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-[#51080d] to-[#FF4458] h-1.5 rounded-full" style={{width: '33%'}}></div>
                    </div>
                    <span className="text-gray-400">1 / 3 Used</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPricingModal(true)}
              className="w-full bg-gradient-to-r from-[#51080d] to-[#FF4458] hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] text-white py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              Upgrade
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-[#0a0a0a] border-b border-gray-800 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4 flex-1">
                <div className="relative flex-1 max-w-md hidden sm:block">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by title.."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm w-full focus:outline-none focus:border-gray-700 transition-colors"
                  />
                  <kbd className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-gray-500 bg-gray-800 rounded border border-gray-700">⌘K</kbd>
                </div>
              </div>

              <div className="relative">
                <div
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden cursor-pointer border-2 border-[#51080d] hover:border-[#FF4458] transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-[#51080d] to-[#FF4458] flex items-center justify-center text-white font-bold">${user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>`
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#51080d] to-[#FF4458] flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                {showProfileDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileDropdown(false)}
                    ></div>
                    <div className="absolute right-0 top-12 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-64 z-50">
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt="Profile"
                              className="w-10 h-10 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent) {
                                  parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#51080d] to-[#FF4458] flex items-center justify-center text-white font-bold">${user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>`
                                }
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#51080d] to-[#FF4458] flex items-center justify-center text-white font-bold">
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div>
                            <div className="text-white font-semibold">{user?.name || 'User'}</div>
                            <div className="text-gray-400 text-sm">{user?.email || 'user@example.com'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <div
                          onClick={() => setActiveTab('profile')}
                          className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                        >
                          <UserIcon size={16} />
                          Profile
                        </div>
                        <div
                          onClick={() => setActiveTab('settings')}
                          className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                        >
                          <SettingsIcon size={16} />
                          Settings
                        </div>
                        <div
                          onClick={() => setActiveTab('help')}
                          className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                        >
                          <HelpCircleIcon size={16} />
                          Help & Support
                        </div>
                        <div
                          onClick={handleLogout}
                          className="px-3 py-2 text-red-400 hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                        >
                          <LogOutIcon size={16} />
                          Log out
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-3 md:p-6 overflow-hidden">
            {activeTab === 'home' && (
              <>
                {/* Upload Section */}
                <div className="max-w-4xl mx-auto h-full overflow-y-auto px-2 md:px-0">
                  <div className="bg-[#141414] border-2 border-dashed border-gray-700 rounded-xl p-6 md:p-16 text-center hover:border-gray-600 transition-all">
                    {!uploadedVideo ? (
                      <>
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-600">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <h3 className="text-base md:text-lg font-medium text-white mb-2">Drop your video here or click to upload</h3>
                        <p className="text-xs md:text-sm text-gray-500 mb-1">Max: 2:00 minutes, 1GB</p>
                        <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">Supports: MP4, MOV</p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="inline-block bg-gradient-to-r from-[#51080d] to-[#FF4458] hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium cursor-pointer transition-all duration-300 text-xs md:text-sm"
                        >
                          Choose File
                        </label>
                      </>
                    ) : null}

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-center mb-3">
                          <Loader2Icon className="w-5 h-5 text-[#FF4458] animate-spin mr-2" />
                          <span className="text-white font-medium text-sm">Processing...</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#51080d] to-[#FF4458] h-1.5 rounded-full transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>



                    {/* Processing Animation */}
                    {loading && (
                      <div className="bg-gray-800/30 rounded-2xl p-6 border-2 border-[#FF4458]/30">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-4">
                            <Loader2Icon className="w-8 h-8 text-[#FF4458] animate-spin mr-3" />
                            <span className="text-white font-bold text-lg">Generating Subtitles</span>
                          </div>

                          <div className="mb-4">
                            <div className="text-sm text-gray-300 mb-2">{processingStep}</div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-[#51080d] to-[#FF4458] h-3 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,68,88,0.5)]"
                                style={{ width: `${processingProgress}%` }}
                              />
                            </div>
                            <div className="text-xs text-[#FF4458] font-semibold mt-1">{processingProgress}%</div>
                          </div>

                          <div className="text-xs text-gray-400">
                            Using {selectedLanguage?.name || 'selected'} language with {selectedTemplate?.name || 'selected'} template
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Generated Video Result */}
                    {generatedVideo && (
                      <div className="bg-gray-800/30 rounded-2xl p-6 border-2 border-[#FF4458]/50">
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircleIcon className="w-5 h-5 text-[#FF4458]" />
                          <h3 className="text-lg font-bold text-white">Video Ready!</h3>
                        </div>

                        <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden mb-4">
                          <video
                            src={generatedVideo?.videoUrl}
                            poster={generatedVideo?.thumbnailUrl}
                            className="w-full h-full object-cover"
                            controls
                            playsInline
                            preload="metadata"
                          />

                          {/* Sample subtitle overlay */}
                          <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
                            <div
                              style={generatedVideo?.template?.style || {}}
                              className="px-4 py-2 rounded-lg max-w-full text-center font-bold shadow-lg"
                            >
                              {generatedVideo?.template?.preview || 'Preview'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-white font-semibold">{generatedVideo?.title || 'Generated Video'}</div>
                            <div className="text-sm text-gray-400">
                              {generatedVideo?.language?.flag} {generatedVideo?.language?.name} •
                              {generatedVideo?.template?.name} •
                              {generatedVideo?.subtitles?.length || 0} subtitles
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">{generatedVideo?.duration || '0:00'}</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                          <button
                            onClick={() => {
                              setEditingVideo(generatedVideo)
                              setShowSubtitleEditor(true)
                            }}
                            className="flex items-center justify-center gap-2 border-2 border-[#FF4458] text-[#FF4458] py-3 px-4 rounded-lg font-semibold hover:bg-[#FF4458] hover:text-white transition-all duration-300"
                          >
                            <Edit3Icon size={18} />
                            Edit Subtitles
                          </button>
                          <button
                            onClick={(e) => handleDownload(generatedVideo, e)}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
                          >
                            <DownloadIcon size={18} />
                            Download
                          </button>
                          <button
                            onClick={() => handleShare(generatedVideo)}
                            className="flex items-center justify-center gap-2 border-2 border-[#FF4458] text-[#FF4458] py-3 px-4 rounded-lg font-semibold hover:bg-[#FF4458] hover:text-white transition-all duration-300"
                          >
                            <Share2Icon size={18} />
                            Share
                          </button>
                        </div>
                      </div>
                    )}
                  </div>



                {/* Recent Videos */}
                <div className="mt-4 md:mt-6">
                  <h2 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6">Recent Videos</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                    {projects.length === 0 ? (
                      <div className="col-span-full text-center py-20">
                        <div className="w-32 h-32 mx-auto mb-4 text-gray-700">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No Recent Media</h3>
                        <p className="text-sm text-gray-500">Upload a video or audio file to get started with your<br/>editing journey</p>
                      </div>
                    ) : (
                      projects.map((project: Project) => (
                        <div key={project.id} className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
                          <div className="aspect-video bg-gray-900 rounded-lg mb-3 relative overflow-hidden group">
                            {project.thumbnail_url ? (
                              <>
                                <img
                                  src={project.thumbnail_url || ''}
                                  alt={project.title || 'Project thumbnail'}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <PlayIcon className="w-8 h-8 text-white" />
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <PlayIcon className="w-8 h-8 text-white/50" />
                              </div>
                            )}
                            <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                              {project.duration ? `${project.duration}s` : '0:00'}
                            </div>
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${project.status === 'completed' ? 'bg-green-500 text-white' :
                              project.status === 'processing' ? 'bg-yellow-500 text-black' :
                                'bg-gray-500 text-white'
                              }`}>
                              {project.status}
                            </div>
                          </div>

                          <h3 className="text-white font-semibold mb-1">{project.title || 'Untitled Project'}</h3>
                          <p className="text-gray-400 text-sm">
                            {new Date(project.created_at).toLocaleDateString()} •
                            {project.subtitles?.length || 0} subtitles
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'projects' && (
              <div className="h-full overflow-y-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Recent Projects</h1>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">No projects yet</div>
                    <p className="text-gray-500">Upload a video to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project: Project) => (
                      <div key={project.id} className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-colors">
                        <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative overflow-hidden group">
                          {project.thumbnail_url ? (
                            <>
                              <img
                                src={project.thumbnail_url}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <PlayIcon className="w-12 h-12 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PlayIcon className="w-12 h-12 text-white/50" />
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                            {project.duration ? `${project.duration}s` : '0:00'}
                          </div>
                        </div>

                        <h3 className="text-white font-bold mb-2">{project.title || 'Untitled Project'}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircleIcon className="w-4 h-4 text-[#FF4458]" />
                          <span className="text-[#FF4458] text-sm capitalize">{project.status}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                          {new Date(project.created_at).toLocaleDateString()} •
                          {project.subtitles?.length || 0} subtitles
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setEditingVideo({
                                id: project.id,
                                title: project.title,
                                videoUrl: project.video_url,
                                thumbnailUrl: project.thumbnail_url,
                                subtitles: project.subtitles || [],
                                template: selectedTemplate,
                                language: selectedLanguage,
                                duration: project.duration?.toString() || '0:00'
                              })
                              setShowSubtitleEditor(true)
                            }}
                            className="flex items-center justify-center gap-1 border-2 border-[#FF4458] text-[#FF4458] py-2 rounded-lg text-sm hover:bg-[#FF4458] hover:text-white transition-all duration-300"
                          >
                            <Edit3Icon size={14} />
                            Edit
                          </button>
                          <button className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white py-2 rounded-lg font-semibold hover:shadow-[0_0_15px_rgba(255,68,88,0.3)] transition-all duration-300 text-sm">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="h-full overflow-y-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white mb-2 font-semibold">Name</label>
                        <input
                          type="text"
                          value={user?.name || ''}
                          className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl px-4 py-3 text-white focus:border-[#FF4458] focus:outline-none"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-white mb-2 font-semibold">Email</label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl px-4 py-3 text-white focus:border-[#FF4458] focus:outline-none"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Account Stats</h2>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Current Plan</span>
                        <span className="text-[#FF4458] font-semibold">{user?.plan || 'Free Plan'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Videos Created</span>
                        <span className="text-white">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Minutes</span>
                        <span className="text-white">0 mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Member Since</span>
                        <span className="text-white">Jan 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="h-full overflow-y-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Preferences</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2 font-semibold">Default Language</label>
                      <select className="w-full bg-black/50 border-2 border-[#51080d]/50 rounded-xl px-4 py-3 text-white focus:border-[#FF4458] focus:outline-none">
                        <option>Hindi</option>
                        <option>English</option>
                        <option>Punjabi</option>
                        <option>Tamil</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="h-full overflow-y-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Help & Support</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Getting Started</h2>
                    <div className="space-y-3 text-gray-300">
                      <p>• Upload your video file (MP4, MOV supported)</p>
                      <p>• Choose from our viral subtitle templates</p>
                      <p>• Generate AI-powered subtitles in seconds</p>
                      <p>• Download in SRT, VTT, or MP4 format</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Contact Support</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MailIcon className="w-5 h-5 text-[#FF4458]" />
                        <span className="text-gray-300">raghav@ragspro.com</span>
                      </div>
                      <div className="text-gray-300">
                        <p>Response time: Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Prepare Your Media Modal */}
        {showPrepareModal && uploadedVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 md:p-4">
            <div
              className="bg-[#1a1a1a] rounded-lg md:rounded-xl p-3 md:p-4 max-w-3xl w-full h-[90vh] flex flex-col border border-gray-800 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base md:text-lg font-semibold text-white">Prepare Your Media</h2>
                <button
                  onClick={() => setShowPrepareModal(false)}
                  className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded transition-colors cursor-pointer"
                >
                  <XIcon size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-2">Select a language to transcribe your media.</p>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#FF4458] scrollbar-track-gray-800" style={{cursor: 'auto'}}>
              {/* Video Preview */}
              <div className="bg-black rounded-lg mb-3 relative overflow-hidden max-h-40 md:max-h-48">
                {videoThumbnail ? (
                  <img
                    src={videoThumbnail}
                    alt="Video preview"
                    className="w-full h-full object-cover"
                  />
                ) : uploadedVideo?.url ? (
                  <video
                    src={uploadedVideo.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-black/60 rounded-full p-2">
                    <PlayIcon className="w-6 h-6 text-white" fill="white" />
                  </div>
                </div>
                {/* Template Preview Overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-center pointer-events-none">
                  <div
                    style={{...selectedTemplate.style, fontSize: '10px', padding: '4px 8px'}}
                    className="rounded max-w-full text-center font-bold shadow-lg"
                  >
                    {getTemplatePreview(selectedTemplate, selectedLanguage)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <div className="w-2 h-2 bg-[#FF4458] rounded-full animate-pulse"></div>
                <span>Ready for processing</span>
              </div>

              {/* Language Settings */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#FF4458]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <h3 className="text-sm font-semibold text-white">Language Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Language spoken</label>
                    <select
                      value={selectedLanguage.id}
                      onChange={(e) => {
                        const lang = languages.find(l => l.id === e.target.value)
                        if (lang) setSelectedLanguage(lang)
                      }}
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 cursor-pointer"
                    >
                      {languages.map((language: Language) => (
                        <option key={language.id} value={language.id}>
                          {language.flag} {language.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Writing system</label>
                    <select
                      value={writingSystem}
                      onChange={(e) => setWritingSystem(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 cursor-pointer"
                    >
                      <option value="default">Choose writing script</option>
                      <option value="latin">Latin</option>
                      <option value="devanagari">Devanagari</option>
                      <option value="arabic">Arabic</option>
                      <option value="chinese">Chinese</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Templates Section */}
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-white mb-2">Choose Template</h3>
                <div className="max-h-[150px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#FF4458] scrollbar-track-gray-800" style={{cursor: 'auto'}}>
                  <div className="grid grid-cols-1 gap-2">
                    {languageFilteredTemplates.map((template: Template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-1.5 md:p-2 rounded border cursor-pointer transition-all ${
                          selectedTemplate.id === template.id
                            ? 'border-[#FF4458] bg-[#FF4458]/10'
                            : 'border-gray-700 bg-gray-800/30 hover:border-[#FF4458]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold text-[10px] md:text-xs mb-0.5">{template.name}</div>
                            <div className="bg-gray-900 rounded p-1 inline-block">
                              <div style={{...template.style, fontSize: '8px', padding: '2px 4px'}} className="font-bold whitespace-nowrap">
                                {getTemplatePreview(template, selectedLanguage).slice(0, 15)}
                              </div>
                            </div>
                          </div>
                          {selectedTemplate.id === template.id && (
                            <CheckCircleIcon className="w-4 h-4 text-[#FF4458] flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audio Enhancement */}
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-2 md:p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FF4458]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-[#FF4458]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-white">Audio Enhancement</div>
                      <div className="text-[10px] text-gray-400">Clean up audio quality</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAudioEnhancement(!audioEnhancement)}
                    className={`relative w-10 h-5 md:w-11 md:h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${audioEnhancement ? 'bg-[#FF4458]' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full transition-transform ${audioEnhancement ? 'translate-x-5' : ''}`}></div>
                  </button>
                </div>
              </div>

              </div>

              {/* Generate Button */}
              <button
                onClick={() => {
                  setShowPrepareModal(false)
                  handleGenerateSubtitles()
                }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#51080d] to-[#FF4458] hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] text-white py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm mt-3"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Generate Transcription
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Language Selection Modal */}
        {showLanguageModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={() => setShowLanguageModal(false)}>
            <div
              className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-[#51080d]/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Select Subtitle Language</h2>
                <button
                  onClick={() => setShowLanguageModal(false)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XIcon size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {languages.map((language: Language) => (
                  <div
                    key={language.id}
                    onClick={() => {
                      setSelectedLanguage(language)
                      setShowLanguageModal(false)
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${selectedLanguage.id === language.id
                      ? 'border-[#FF4458] bg-[#FF4458]/10'
                      : 'border-gray-700 bg-gray-800/30 hover:border-[#FF4458]/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{language.flag}</span>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{language.name}</div>
                        <div className="text-gray-400 text-sm">{language.description}</div>
                      </div>
                      {selectedLanguage.id === language.id && (
                        <CheckCircleIcon className="w-5 h-5 text-[#FF4458]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowLanguageModal(false)}
                  className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subtitle Editor */}
        {showSubtitleEditor && editingVideo && (
          <SubtitleEditor
            videoUrl={editingVideo.videoUrl}
            subtitles={editingVideo.subtitles || []}
            template={editingVideo.template || selectedTemplate}
            projectId={editingVideo.id}
            onSave={(updatedSubtitles) => {
              // Update the video with new subtitles
              if (generatedVideo && generatedVideo.id === editingVideo.id) {
                setGeneratedVideo({
                  ...generatedVideo,
                  subtitles: updatedSubtitles
                })
              }
              setShowSubtitleEditor(false)
              setEditingVideo(null)
              window.alert('Subtitles saved successfully!')
            }}
            onClose={() => {
              setShowSubtitleEditor(false)
              setEditingVideo(null)
            }}
          />
        )}

        {/* Pricing Modal */}
        {showPricingModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 md:p-4">
            <div
              className="bg-gray-900 rounded-xl md:rounded-2xl p-3 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#51080d]/50"
            >
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <h2 className="text-xl md:text-3xl font-bold text-white">Choose Your Plan</h2>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XIcon size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:gap-6">
                {[
                  {
                    name: 'Pro',
                    price: '₹299',
                    period: '/month',
                    features: ['500 minutes/month', '4K quality', 'All templates', 'Priority processing']
                  },
                  {
                    name: 'Team',
                    price: '₹999',
                    period: '/month',
                    features: ['Unlimited minutes', '4K quality', 'Team collaboration', 'Advanced analytics'],
                    popular: true
                  },
                  {
                    name: 'Enterprise',
                    price: '₹2999',
                    period: '/month',
                    features: ['Unlimited everything', 'Custom AI training', 'Dedicated support', 'SLA guarantee']
                  }
                ].map((plan, index) => (
                  <div key={index} className={`relative bg-gray-800/50 rounded-lg md:rounded-xl p-4 md:p-6 border-2 ${plan.popular ? 'border-[#FF4458]' : 'border-gray-700'
                    }`}>
                    {plan.popular && (
                      <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-3 md:px-4 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-bold">
                          MOST POPULAR
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center">
                        <span className="text-2xl md:text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-gray-400 ml-1 md:ml-2 text-sm md:text-base">{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-xs md:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-2 md:py-3 rounded-lg font-bold transition-all duration-300 text-sm md:text-base ${plan.popular
                        ? 'bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white hover:shadow-[0_0_20px_rgba(255,68,88,0.3)]'
                        : 'border-2 border-[#51080d] text-white hover:bg-[#51080d]/20'
                        }`}
                    >
                      Choose {plan.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}