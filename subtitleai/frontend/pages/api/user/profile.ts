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

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

const sanitizeString = (str: string): string => {
  return str.replace(/[<>"'&]/g, '').trim().substring(0, 255)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID required' })
      }

      if (!validateUUID(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format' })
      }

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('User fetch error:', error)
        return res.status(500).json({ error: 'Failed to fetch user profile' })
      }

      res.status(200).json({
        success: true,
        user
      })

    } catch (error) {
      console.error('Profile API error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { userId, name, email } = req.body

      if (!userId || !name || !email) {
        return res.status(400).json({ error: 'All fields required' })
      }

      if (!validateUUID(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format' })
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
      }

      const sanitizedName = sanitizeString(name)
      const sanitizedEmail = sanitizeString(email)

      if (!sanitizedName || !sanitizedEmail) {
        return res.status(400).json({ error: 'Invalid input data' })
      }

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .update({
          name: sanitizedName,
          email: sanitizedEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('User update error:', error)
        return res.status(500).json({ error: 'Failed to update user profile' })
      }

      res.status(200).json({
        success: true,
        user,
        message: 'Profile updated successfully'
      })

    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}