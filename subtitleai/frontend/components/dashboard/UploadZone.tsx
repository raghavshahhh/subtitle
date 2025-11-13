'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Film, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'

interface UploadZoneProps {
  onUploadSuccess: (projectId: number) => void
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file')
      return
    }

    if (file.size > 2 * 1024 * 1024 * 1024) {
      setError('File too large. Max 2GB for free users')
      return
    }

    setUploading(true)
    setError('')
    setProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const result = await api.uploadVideo(file, file.name.split('.')[0], 'hi')
      
      clearInterval(progressInterval)
      setProgress(100)
      
      if (result.project_id) {
        onUploadSuccess(result.project_id)
      } else {
        throw new Error(result.message || 'Upload failed')
      }
    } catch (error: any) {
      setError(error.message || 'Upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }, [onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 1,
    disabled: uploading
  })

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
        hover:scale-[1.02] active:scale-[0.98]
        ${isDragActive 
          ? 'border-primary-red-accent bg-primary-red/10' 
          : 'border-glass-border bg-glass-bg hover:border-primary-red-accent/50'
        }
        ${uploading ? 'pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {uploading ? (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary-red-accent/20 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-red-accent animate-bounce" />
          </div>
          <div>
            <p className="text-text-primary font-semibold">Uploading...</p>
            <div className="w-full bg-glass-bg rounded-full h-2 mt-2">
              <div 
                className="bg-primary-red-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-text-secondary text-sm mt-1">{progress}%</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary-red-accent/20 rounded-full flex items-center justify-center">
            <Film className="w-8 h-8 text-primary-red-accent" />
          </div>
          
          <div>
            <p className="text-xl font-semibold text-text-primary mb-2">
              {isDragActive ? 'Drop your video here' : 'Drop video or click to upload'}
            </p>
            <p className="text-text-secondary">
              Supports: MP4, MOV, AVI, MKV
            </p>
            <p className="text-text-secondary text-sm">
              Max: 2GB (Free) • 10GB (Pro)
            </p>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-primary-red-accent">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}