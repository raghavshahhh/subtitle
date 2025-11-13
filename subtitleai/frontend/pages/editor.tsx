import React, { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Editor() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  
  const [videoUrl, setVideoUrl] = useState('')
  const [subtitles, setSubtitles] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSubIndex, setSelectedSubIndex] = useState(0)
  
  const [fontSize, setFontSize] = useState(65)
  const [posX, setPosX] = useState(50)
  const [posY, setPosY] = useState(20)
  const [textColor, setTextColor] = useState('#FF4444')
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fontWeight, setFontWeight] = useState('700')
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [lineSpacing, setLineSpacing] = useState(0)
  const [textAlign, setTextAlign] = useState('center')
  const [dropShadow, setDropShadow] = useState(false)
  const [textStroke, setTextStroke] = useState(true)
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showControls, setShowControls] = useState(false)
  const [activeTab, setActiveTab] = useState('Text')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [editingSubtitle, setEditingSubtitle] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    const data = sessionStorage.getItem('editorData')
    if (data) {
      const parsed = JSON.parse(data)
      setVideoUrl(parsed.videoUrl || '')
      setSubtitles(parsed.subtitles || [])
      setProjectId(parsed.projectId || null)
    } else {
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
      setSubtitles([
        { id: 1, start_time: 0, end_time: 3, text: '" Be Realistic"' },
        { id: 2, start_time: 3, end_time: 6, text: 'Sample Text 2' }
      ])
    }
  }, [])

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause()
          setIsPlaying(false)
        } else {
          await videoRef.current.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Playback error:', error)
        setIsPlaying(false)
      }
    }
  }

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5)
    }
  }

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5)
    }
  }

  const getCurrentSubtitle = () => {
    return subtitles.find(sub => 
      currentTime >= sub.start_time && currentTime <= sub.end_time
    )
  }

  const handleSubtitleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const rect = videoContainerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setDragOffset({ x: posX - x, y: posY - y })
    }
  }

  const handleSubtitleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const rect = videoContainerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setPosX(Math.max(0, Math.min(100, x + dragOffset.x)))
      setPosY(Math.max(0, Math.min(100, y + dragOffset.y)))
    }
  }

  const handleSubtitleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSubtitleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    const rect = videoContainerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = ((touch.clientX - rect.left) / rect.width) * 100
      const y = ((touch.clientY - rect.top) / rect.height) * 100
      setDragOffset({ x: posX - x, y: posY - y })
    }
  }

  const handleSubtitleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const rect = videoContainerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = ((touch.clientX - rect.left) / rect.width) * 100
      const y = ((touch.clientY - rect.top) / rect.height) * 100
      setPosX(Math.max(0, Math.min(100, x + dragOffset.x)))
      setPosY(Math.max(0, Math.min(100, y + dragOffset.y)))
    }
  }

  const handleSubtitleTouchEnd = () => {
    setIsDragging(false)
  }

  const currentSubtitle = getCurrentSubtitle()

  return (
    <>
      <Head>
        <title>Editor - SubtitleAI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div className="h-screen bg-black flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[#1a1a1a] px-3 py-2 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="text-white p-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="text-white p-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-white p-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
            <button 
              onClick={async () => {
                if (!projectId) {
                  sessionStorage.setItem('editorData', JSON.stringify({
                    videoUrl,
                    subtitles,
                    settings: { fontSize, posX, posY, textColor, fontFamily, fontWeight }
                  }))
                  alert('Project saved locally!')
                  return
                }

                setIsSaving(true)
                try {
                  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                  const { supabase } = await import('@/lib/supabase')
                  const { data: { session } } = await supabase.auth.getSession()

                  // Update each subtitle
                  for (const sub of subtitles) {
                    if (sub.id) {
                      await fetch(`${API_URL}/api/subtitles/${sub.id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          ...(session?.access_token && {
                            'Authorization': `Bearer ${session.access_token}`
                          })
                        },
                        body: JSON.stringify({
                          text: sub.text,
                          start_time: sub.start_time,
                          end_time: sub.end_time
                        })
                      })
                    }
                  }

                  alert('Project saved successfully!')
                } catch (error) {
                  console.error('Save error:', error)
                  alert('Failed to save project')
                } finally {
                  setIsSaving(false)
                }
              }}
              disabled={isSaving}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <svg className="w-5 h-5 inline animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
              ) : (
                <svg className="w-5 h-5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                </svg>
              )}
            </button>
            <button 
              onClick={async () => {
                if (!projectId) {
                  alert('Please save the project first')
                  return
                }

                setIsExporting(true)
                try {
                  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                  const { supabase } = await import('@/lib/supabase')
                  const { data: { session } } = await supabase.auth.getSession()

                  const response = await fetch(`${API_URL}/api/export/${projectId}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(session?.access_token && {
                        'Authorization': `Bearer ${session.access_token}`
                      })
                    },
                    body: JSON.stringify({
                      format: 'mp4',
                      style: {
                        font: fontFamily,
                        size: fontSize,
                        color: textColor,
                        position: posY < 50 ? 'top' : 'bottom'
                      }
                    })
                  })

                  const result = await response.json()

                  if (result.download_url) {
                    // Download the file
                    const link = document.createElement('a')
                    link.href = result.download_url
                    link.download = `subtitled_video_${projectId}.mp4`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    alert('Export started! Your video will download shortly.')
                  } else {
                    throw new Error('Export failed')
                  }
                } catch (error) {
                  console.error('Export error:', error)
                  alert('Failed to export video')
                } finally {
                  setIsExporting(false)
                }
              }}
              disabled={isExporting}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <svg className="w-5 h-5 inline animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
              ) : (
                <svg className="w-5 h-5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Video Preview */}
        <div className="flex-1 flex items-center justify-center bg-black p-2 md:p-4">
          <div 
            ref={videoContainerRef}
            className="relative w-full h-full max-w-3xl flex items-center justify-center"
            onMouseMove={handleSubtitleMouseMove}
            onMouseUp={handleSubtitleMouseUp}
            onMouseLeave={handleSubtitleMouseUp}
            onTouchMove={handleSubtitleTouchMove}
            onTouchEnd={handleSubtitleTouchEnd}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              className="max-w-full max-h-full object-contain bg-black rounded-lg"
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={(e) => console.error('Video error:', e)}
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
            />
            
            {currentSubtitle && (
              <div 
                className="absolute select-none" 
                style={{ 
                  left: `${posX}%`, 
                  top: `${posY}%`, 
                  transform: 'translate(-50%, -50%)',
                  fontFamily,
                  fontWeight,
                  fontSize: `${fontSize}px`,
                  color: textColor,
                  fontStyle: 'italic',
                  letterSpacing: `${letterSpacing}px`,
                  lineHeight: lineSpacing === 0 ? 'normal' : `${lineSpacing}`,
                  textAlign: textAlign as any,
                  textShadow: dropShadow ? '2px 2px 4px rgba(0,0,0,0.9)' : 'none',
                  WebkitTextStroke: textStroke ? `${strokeWidth}px ${strokeColor}` : 'none',
                  padding: '4px 12px',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  pointerEvents: 'auto'
                }}
                onMouseDown={handleSubtitleMouseDown}
                onTouchStart={handleSubtitleTouchStart}
              >
                {currentSubtitle.text}
              </div>
            )}

            <button className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Timeline & Controls */}
        <div className="bg-[#1a1a1a] border-t border-gray-800">
          {/* Playback Controls */}
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-white text-xs font-mono">
              {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
            </span>
            
            <div className="flex items-center gap-2">
              <button onClick={skipBackward} className="text-white p-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                </svg>
              </button>
              <button onClick={togglePlay} className="bg-white text-black rounded-full p-3">
                {isPlaying ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button onClick={skipForward} className="text-white p-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="text-white p-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </button>
              <button className="text-white p-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button className="text-white p-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="px-4 pb-3">
            <div className="relative h-16 bg-[#2a2a2a] rounded overflow-x-auto">
              <div className="absolute inset-0 flex items-center">
                {subtitles.map((sub, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedSubIndex(index)
                      if (videoRef.current) videoRef.current.currentTime = sub.start_time
                    }}
                    onDoubleClick={() => {
                      setEditingSubtitle(index)
                      setEditText(sub.text)
                    }}
                    className={`absolute h-10 rounded cursor-pointer flex items-center justify-center text-xs px-2 font-semibold ${
                      selectedSubIndex === index ? 'bg-teal-500' : 'bg-teal-600'
                    }`}
                    style={{ 
                      left: `${(sub.start_time / duration) * 100}%`, 
                      width: `${((sub.end_time - sub.start_time) / duration) * 100}%`,
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {editingSubtitle === index ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => {
                          const newSubtitles = [...subtitles]
                          newSubtitles[index].text = editText
                          setSubtitles(newSubtitles)
                          setEditingSubtitle(null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const newSubtitles = [...subtitles]
                            newSubtitles[index].text = editText
                            setSubtitles(newSubtitles)
                            setEditingSubtitle(null)
                          } else if (e.key === 'Escape') {
                            setEditingSubtitle(null)
                          }
                        }}
                        autoFocus
                        className="bg-teal-700 text-white px-2 py-1 rounded w-full text-xs"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <span className="text-white truncate">{sub.text}</span>
                        <span className="text-white text-[10px] ml-1">{(sub.end_time - sub.start_time).toFixed(1)}s</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Tools */}
          <div className="px-4 pb-3 grid grid-cols-4 gap-3 border-t border-gray-800 pt-3">
            <button 
              onClick={() => { setActiveTab('Text'); setShowControls(true); }}
              className={`flex flex-col items-center text-xs py-2 rounded ${activeTab === 'Text' && showControls ? 'text-[#FF4458] bg-[#FF4458]/10' : 'text-white'}`}
            >
              <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7V4h16v3M9 20h6M12 4v16" />
              </svg>
              Text
            </button>
            <button 
              onClick={() => { setActiveTab('Templates'); setShowControls(true); }}
              className={`flex flex-col items-center text-xs py-2 rounded ${activeTab === 'Templates' && showControls ? 'text-[#FF4458] bg-[#FF4458]/10' : 'text-white'}`}
            >
              <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              Templates
            </button>
            <button 
              onClick={() => { setActiveTab('Effects'); setShowControls(true); }}
              className={`flex flex-col items-center text-xs py-2 rounded ${activeTab === 'Effects' && showControls ? 'text-[#FF4458] bg-[#FF4458]/10' : 'text-white'}`}
            >
              <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Effects
            </button>
            <button 
              onClick={() => setShowControls(false)}
              className="flex flex-col items-center text-white text-xs py-2 rounded"
            >
              <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        {showControls && (
          <div className="fixed inset-x-0 bottom-0 md:right-0 md:top-0 md:bottom-0 md:left-auto bg-[#1a1a1a] w-full md:w-96 max-h-[70vh] md:max-h-none z-50 border-t md:border-t-0 md:border-l border-gray-800 overflow-y-auto rounded-t-2xl md:rounded-none">
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-gray-800 p-4 flex items-center justify-between">
              <h3 className="text-white font-semibold">{activeTab}</h3>
              <button onClick={() => setShowControls(false)} className="text-white">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

              <div className="p-4 space-y-4">
                {activeTab === 'Text' && (
                  <>
                    <div>
                      <label className="text-white text-xs mb-2 block">Font Size</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="20"
                          max="120"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          className="flex-1 accent-[#FF4458]"
                        />
                        <span className="text-white text-sm w-12">{fontSize}px</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-xs mb-2 block">Position</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-400 text-xs">X: {posX.toFixed(0)}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={posX}
                            onChange={(e) => setPosX(parseInt(e.target.value))}
                            className="w-full accent-[#FF4458]"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 text-xs">Y: {posY.toFixed(0)}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={posY}
                            onChange={(e) => setPosY(parseInt(e.target.value))}
                            className="w-full accent-[#FF4458]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-xs mb-2 block">Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-12 h-12 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-xs mb-2 block">Font</label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full bg-gray-800 text-white px-3 py-2 rounded"
                      >
                        <option>Arial</option>
                        <option>Impact</option>
                        <option>Helvetica</option>
                        <option>Times New Roman</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                      <label className="text-white text-xs">Text Stroke</label>
                      <button
                        onClick={() => setTextStroke(!textStroke)}
                        className={`relative w-12 h-6 rounded-full ${textStroke ? 'bg-[#FF4458]' : 'bg-gray-600'}`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${textStroke ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>
                  </>
                )}

                {activeTab === 'Templates' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setTextColor('#000000')
                        setFontSize(85)
                        setFontWeight('900')
                        setTextStroke(true)
                        setStrokeColor('#000000')
                        setStrokeWidth(3)
                      }}
                      className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-black shadow-lg"
                    >
                      MrBeast
                    </button>
                    <button
                      onClick={() => {
                        setTextColor('#FFFFFF')
                        setFontSize(65)
                        setFontWeight('600')
                        setTextStroke(false)
                        setDropShadow(true)
                      }}
                      className="p-4 bg-black text-white rounded-lg font-semibold"
                    >
                      Netflix
                    </button>
                    <button
                      onClick={() => {
                        setTextColor('#00FF41')
                        setFontSize(75)
                        setFontWeight('700')
                        setTextStroke(true)
                        setStrokeColor('#000000')
                        setDropShadow(true)
                      }}
                      className="p-4 bg-gray-900 text-green-400 rounded-lg font-bold"
                    >
                      Gaming
                    </button>
                    <button
                      onClick={() => {
                        setTextColor('#FFFFFF')
                        setFontSize(78)
                        setFontWeight('800')
                        setTextStroke(true)
                        setStrokeColor('#000000')
                        setStrokeWidth(2)
                      }}
                      className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-extrabold"
                    >
                      Instagram
                    </button>
                    <button
                      onClick={() => {
                        setTextColor('#FF6B6B')
                        setFontSize(80)
                        setFontWeight('800')
                        setTextStroke(true)
                        setStrokeColor('#FFFFFF')
                        setStrokeWidth(2)
                      }}
                      className="p-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-extrabold"
                    >
                      TikTok
                    </button>
                    <button
                      onClick={() => {
                        setTextColor('#FFD700')
                        setFontSize(70)
                        setFontWeight('900')
                        setTextStroke(true)
                        setStrokeColor('#000000')
                        setStrokeWidth(3)
                      }}
                      className="p-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg font-black"
                    >
                      Viral
                    </button>
                    <button
                      onClick={() => {
                        setTextColor('#FF0000')
                        setFontSize(72)
                        setFontWeight('700')
                        setTextStroke(false)
                        setDropShadow(true)
                      }}
                      className="p-4 bg-black text-red-600 rounded-lg font-bold"
                    >
                      Horror
                    </button>
                    <button
                      onClick={() => {
                        setTextColor('#FFFFFF')
                        setFontSize(68)
                        setFontWeight('500')
                        setTextStroke(false)
                        setDropShadow(false)
                      }}
                      className="p-4 bg-white text-gray-900 rounded-lg font-medium"
                    >
                      Minimal
                    </button>
                  </div>
                )}

                {activeTab === 'Effects' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setFontSize(65)
                        setPosX(50)
                        setPosY(20)
                        setTextColor('#FFFFFF')
                        setTextStroke(true)
                      }}
                      className="w-full p-3 bg-[#FF4458] text-white rounded font-semibold"
                    >
                      Reset All
                    </button>
                  </div>
                )}
              </div>
          </div>
        )}
      </div>
    </>
  )
}
