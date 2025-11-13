import { supabase } from './supabase'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Validate URL to prevent SSRF
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false
    }
    // Prevent localhost/internal IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsed.hostname
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}

class ApiClient {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && {
        'Authorization': `Bearer ${session.access_token}`
      })
    }
  }

  async uploadVideo(file: File, title: string, language: string = 'hi') {
    try {
      // Validate file size (2GB max)
      const MAX_SIZE = 2 * 1024 * 1024 * 1024
      if (file.size > MAX_SIZE) {
        throw new Error('File size exceeds 2GB limit')
      }

      // Validate file type
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only MP4, MOV, AVI, MKV, WEBM allowed')
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title.substring(0, 200)) // Limit title length
      formData.append('language', language)

      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`${API_URL}/api/upload/video`, {
        method: 'POST',
        headers: {
          ...(session?.access_token && {
            'Authorization': `Bearer ${session.access_token}`
          })
        },
        body: formData
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Upload failed' }))
        throw new Error(error.detail || 'Upload failed')
      }

      return response.json()
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  async getProjects() {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${API_URL}/api/projects/`, {
        headers
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      
      return response.json()
    } catch (error) {
      console.error('Get projects error:', error)
      throw error
    }
  }

  async getProject(projectId: number) {
    try {
      // Validate projectId
      if (!projectId || projectId < 0) {
        throw new Error('Invalid project ID')
      }
      
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        headers
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }
      
      return response.json()
    } catch (error) {
      console.error('Get project error:', error)
      throw error
    }
  }

  async getSubtitles(projectId: number) {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_URL}/api/subtitles/${projectId}`, {
      headers
    })
    return response.json()
  }

  async updateSubtitle(subtitleId: number, text: string, startTime?: number, endTime?: number) {
    try {
      // Validate inputs
      if (!subtitleId || subtitleId < 0) {
        throw new Error('Invalid subtitle ID')
      }
      if (!text || text.length > 1000) {
        throw new Error('Invalid subtitle text')
      }
      
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${API_URL}/api/subtitles/${subtitleId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          text: text.substring(0, 1000),
          start_time: startTime,
          end_time: endTime
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update subtitle')
      }
      
      return response.json()
    } catch (error) {
      console.error('Update subtitle error:', error)
      throw error
    }
  }

  async exportSubtitles(projectId: number, format: string, style?: any) {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${API_URL}/api/export/${projectId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ format, style })
    })
    return response.json()
  }

  async createPaymentOrder(plan: string) {
    try {
      const allowedPlans = ['free', 'pro', 'team', 'enterprise']
      if (!allowedPlans.includes(plan.toLowerCase())) {
        throw new Error('Invalid plan')
      }
      
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ plan })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create payment order')
      }
      
      return response.json()
    } catch (error) {
      console.error('Create payment order error:', error)
      throw error
    }
  }

  async verifyPayment(paymentData: any) {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${API_URL}/api/payment/verify-payment`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentData)
      })
      
      if (!response.ok) {
        throw new Error('Payment verification failed')
      }
      
      return response.json()
    } catch (error) {
      console.error('Verify payment error:', error)
      throw error
    }
  }
}

export const api = new ApiClient()