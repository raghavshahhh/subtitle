import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { projectId, subtitles } = req.body

    if (!projectId || !Array.isArray(subtitles)) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Delete existing subtitles for this project
    await supabaseAdmin
      .from('subtitles')
      .delete()
      .eq('project_id', projectId)

    // Insert updated subtitles
    const subtitlesWithProjectId = subtitles.map((sub, index) => ({
      project_id: projectId,
      start_time: sub.start_time,
      end_time: sub.end_time,
      text: sub.text,
      original_text: sub.original_text || sub.text,
      confidence: sub.confidence || 1.0,
      sequence_number: index
    }))

    const { data, error } = await supabaseAdmin
      .from('subtitles')
      .insert(subtitlesWithProjectId)
      .select()

    if (error) {
      console.error('Update subtitles error:', error)
      return res.status(500).json({ error: 'Failed to update subtitles' })
    }

    res.status(200).json({
      success: true,
      subtitles: data,
      message: 'Subtitles updated successfully'
    })

  } catch (error) {
    console.error('Update subtitles handler error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}