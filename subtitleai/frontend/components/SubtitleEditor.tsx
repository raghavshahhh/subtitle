import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Edit3, Save, X, Plus, Trash2, SkipBack, SkipForward } from 'lucide-react'

// Type assertions for components to fix React 18 compatibility
const PlayIcon = Play as any
const PauseIcon = Pause as any
const Edit3Icon = Edit3 as any
const SaveIcon = Save as any
const XIcon = X as any
const PlusIcon = Plus as any
const Trash2Icon = Trash2 as any
const SkipBackIcon = SkipBack as any
const SkipForwardIcon = SkipForward as any

interface Subtitle {
  id?: string
  start_time: number
  end_time: number
  text: string
  original_text?: string
  confidence?: number
}

interface SubtitleEditorProps {
  videoUrl: string
  subtitles: Subtitle[]
  onSave: (subtitles: Subtitle[]) => void
  onClose: () => void
  template: any
  projectId?: string
}

export default function SubtitleEditor({ videoUrl, subtitles, onSave, onClose, template, projectId }: SubtitleEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [editedSubtitles, setEditedSubtitles] = useState<Subtitle[]>(subtitles)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('play', () => setIsPlaying(true))
    video.addEventListener('pause', () => setIsPlaying(false))

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('play', () => setIsPlaying(true))
      video.removeEventListener('pause', () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const seekTo = (time: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = time
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentSubtitle = () => {
    return editedSubtitles.find(sub => 
      currentTime >= sub.start_time && currentTime <= sub.end_time
    )
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditText(editedSubtitles[index].text)
  }

  const saveEdit = () => {
    if (editingIndex === null) return
    
    const updated = [...editedSubtitles]
    updated[editingIndex].text = editText
    setEditedSubtitles(updated)
    setEditingIndex(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditText('')
  }

  const addSubtitle = () => {
    const newSubtitle: Subtitle = {
      start_time: currentTime,
      end_time: currentTime + 3,
      text: 'New subtitle text',
      confidence: 1.0
    }
    setEditedSubtitles([...editedSubtitles, newSubtitle].sort((a, b) => a.start_time - b.start_time))
  }

  const deleteSubtitle = (index: number) => {
    const updated = editedSubtitles.filter((_, i) => i !== index)
    setEditedSubtitles(updated)
  }

  const updateTiming = (index: number, field: 'start_time' | 'end_time', value: number) => {
    const updated = [...editedSubtitles]
    updated[index][field] = Math.max(0, Math.min(duration, value))
    setEditedSubtitles(updated)
  }

  const currentSubtitle = getCurrentSubtitle()

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl border border-[#51080d]/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Subtitle Editor</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                setSaving(true)
                try {
                  if (projectId) {
                    const response = await fetch('/api/update-subtitles', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        projectId,
                        subtitles: editedSubtitles
                      })
                    })
                    
                    if (!response.ok) {
                      throw new Error('Failed to save subtitles')
                    }
                  }
                  onSave(editedSubtitles)
                } catch (error) {
                  console.error('Save error:', error)
                  alert('Failed to save subtitles. Please try again.')
                } finally {
                  setSaving(false)
                }
              }}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-[#51080d] to-[#FF4458] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(255,68,88,0.3)] transition-all duration-300 disabled:opacity-50"
            >
              <SaveIcon size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <XIcon size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 p-6">
          {/* Video Player */}
          <div className="flex-1 space-y-4">
            <div className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              />
              
              {/* Current Subtitle Overlay */}
              {currentSubtitle && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
                  <div
                    style={template.style}
                    className="px-4 py-2 rounded-lg max-w-full text-center font-bold shadow-lg"
                  >
                    {currentSubtitle.text}
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => seekTo(Math.max(0, currentTime - 10))}
                  className="text-white hover:text-[#FF4458] transition-colors"
                >
                  <SkipBackIcon size={20} />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="bg-[#FF4458] text-white p-3 rounded-full hover:bg-[#FF4458]/80 transition-colors"
                >
                  {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                </button>
                
                <button
                  onClick={() => seekTo(Math.min(duration, currentTime + 10))}
                  className="text-white hover:text-[#FF4458] transition-colors"
                >
                  <SkipForwardIcon size={20} />
                </button>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Timeline */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                
                {/* Subtitle markers */}
                {editedSubtitles.map((sub, index) => (
                  <div
                    key={index}
                    className="absolute top-0 h-2 bg-[#FF4458]/60 rounded"
                    style={{
                      left: `${(sub.start_time / duration) * 100}%`,
                      width: `${((sub.end_time - sub.start_time) / duration) * 100}%`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Subtitle List */}
          <div className="w-96 bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Subtitles</h3>
              <button
                onClick={addSubtitle}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                <PlusIcon size={16} />
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {editedSubtitles.map((subtitle, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-colors ${
                    currentTime >= subtitle.start_time && currentTime <= subtitle.end_time
                      ? 'border-[#FF4458] bg-[#FF4458]/10'
                      : 'border-gray-600 bg-gray-700/50'
                  }`}
                >
                  {/* Timing Controls */}
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <input
                      type="number"
                      value={subtitle.start_time.toFixed(1)}
                      onChange={(e) => updateTiming(index, 'start_time', parseFloat(e.target.value))}
                      className="w-16 bg-gray-600 text-white px-2 py-1 rounded text-xs"
                      step="0.1"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={subtitle.end_time.toFixed(1)}
                      onChange={(e) => updateTiming(index, 'end_time', parseFloat(e.target.value))}
                      className="w-16 bg-gray-600 text-white px-2 py-1 rounded text-xs"
                      step="0.1"
                    />
                    <button
                      onClick={() => seekTo(subtitle.start_time)}
                      className="text-[#FF4458] hover:text-white transition-colors ml-auto"
                    >
                      <PlayIcon size={14} />
                    </button>
                  </div>

                  {/* Text Editing */}
                  {editingIndex === index ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-gray-600 text-white p-2 rounded text-sm resize-none"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          <SaveIcon size={12} />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                        >
                          <XIcon size={12} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <p className="text-white text-sm flex-1">{subtitle.text}</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(index)}
                          className="text-blue-400 hover:text-white transition-colors"
                        >
                          <Edit3Icon size={14} />
                        </button>
                        <button
                          onClick={() => deleteSubtitle(index)}
                          className="text-red-400 hover:text-white transition-colors"
                        >
                          <Trash2Icon size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}