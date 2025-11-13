import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Input validation
const validateUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { projectId, userId, format = 'mp4' } = req.query

    if (!projectId || !userId) {
      return res.status(400).json({ error: 'Project ID and User ID required' })
    }

    if (!validateUUID(projectId as string) || !validateUUID(userId as string)) {
      return res.status(400).json({ error: 'Invalid ID format' })
    }

    // Fetch project details
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        subtitles (*)
      `)
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (error || !project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    // Generate download URL (in production, this would create a processed video with subtitles)
    const downloadUrl = project.video_url
    
    // Log download activity
    console.log(`Download requested: ${project.title} by user ${userId}`)

    res.status(200).json({
      success: true,
      downloadUrl,
      filename: `${project.title}_subtitled.${format}`,
      project: {
        id: project.id,
        title: project.title,
        duration: project.duration,
        subtitles_count: project.subtitles?.length || 0
      }
    })

  } catch (error) {
    console.error('Download API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}