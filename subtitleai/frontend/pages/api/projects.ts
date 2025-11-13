import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // Forward request to backend
      const response = await fetch(`${API_URL}/api/projects/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Return demo data if backend fails
        return res.status(200).json([
          {
            id: '1',
            title: 'Sample Video Project',
            video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail_url: 'https://via.placeholder.com/640x360/1a1a1a/ffffff?text=Sample+Video',
            status: 'completed',
            language: 'hi',
            duration: 30.0,
            created_at: new Date().toISOString()
          },
          {
            id: '2', 
            title: 'Demo Subtitle Video',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnail_url: 'https://via.placeholder.com/640x360/1a1a1a/ffffff?text=Demo+Video',
            status: 'completed',
            language: 'en',
            duration: 60.0,
            created_at: new Date().toISOString()
          }
        ])
      }

      const data = await response.json()
      return res.status(200).json(data)
    } catch (error) {
      console.error('Projects fetch error:', error)
      // Return demo data on error
      return res.status(200).json([
        {
          id: '1',
          title: 'Sample Video Project',
          video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnail_url: 'https://via.placeholder.com/640x360/1a1a1a/ffffff?text=Sample+Video',
          status: 'completed',
          language: 'hi',
          duration: 30.0,
          created_at: new Date().toISOString()
        }
      ])
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
