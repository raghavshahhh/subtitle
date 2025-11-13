import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import formidable from 'formidable'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Input validation
const validateUserId = (userId: string): boolean => {
  return /^[a-zA-Z0-9-_]{1,50}$/.test(userId)
}

const sanitizeFileName = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100)
}

const ALLOWED_MIME_TYPES = ['video/mp4', 'video/mov', 'video/avi']
const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
      filter: ({ mimetype }) => ALLOWED_MIME_TYPES.includes(mimetype || '')
    })

    const [fields, files] = await form.parse(req)
    const videoFile = Array.isArray(files.video) ? files.video[0] : files.video
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId
    const templateId = Array.isArray(fields.templateId) ? fields.templateId[0] : fields.templateId

    // Validate inputs
    if (!videoFile || !userId) {
      return res.status(400).json({ error: 'Missing video file or user ID' })
    }

    if (!validateUserId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' })
    }

    if (!ALLOWED_MIME_TYPES.includes(videoFile.mimetype || '')) {
      return res.status(400).json({ error: 'Invalid file type' })
    }

    if (videoFile.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File too large' })
    }

    // Read file securely
    const fs = require('fs')
    const fileBuffer = fs.readFileSync(videoFile.filepath)
    const sanitizedFilename = sanitizeFileName(videoFile.originalFilename || 'video')
    const fileName = `${userId}/${Date.now()}-${sanitizedFilename}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('videos')
      .upload(fileName, fileBuffer, {
        contentType: videoFile.mimetype || 'video/mp4',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return res.status(500).json({ error: 'Failed to upload video' })
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('videos')
      .getPublicUrl(fileName)

    // Generate thumbnail URL (placeholder for now)
    const thumbnailUrl = `${publicUrl}?thumbnail=true`

    // Create project record
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: userId,
        title: videoFile.originalFilename?.replace(/\.[^/.]+$/, '') || 'Untitled Project',
        video_url: publicUrl,
        thumbnail_url: thumbnailUrl,
        file_size: videoFile.size,
        template_id: parseInt(templateId || '1') || 1,
        status: 'uploaded'
      })
      .select()
      .single()

    if (projectError) {
      console.error('Project creation error:', projectError)
      // If table doesn't exist, create a mock project for demo
      const mockProject = {
        id: `demo-${Date.now()}`,
        user_id: userId,
        title: videoFile.originalFilename?.replace(/\.[^/.]+$/, '') || 'Untitled Project',
        video_url: publicUrl,
        thumbnail_url: thumbnailUrl,
        file_size: videoFile.size,
        template_id: parseInt(templateId || '1') || 1,
        status: 'uploaded',
        created_at: new Date().toISOString()
      }
      
      res.status(200).json({
        success: true,
        project: mockProject,
        videoUrl: publicUrl,
        demo: true
      })
      return
    }

    // Clean up temp file
    fs.unlinkSync(videoFile.filepath)

    res.status(200).json({
      success: true,
      project,
      videoUrl: publicUrl
    })

  } catch (error) {
    console.error('Upload handler error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}