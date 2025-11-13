# SubtitleAI API Documentation

## Authentication
All API requests require authentication via Supabase JWT token.

```bash
Authorization: Bearer <jwt_token>
```

## Endpoints

### Upload Video
```http
POST /api/upload/video
Content-Type: multipart/form-data

{
  "file": <video_file>,
  "title": "My Video",
  "language": "hi"
}
```

Response:
```json
{
  "project_id": 123,
  "status": "processing",
  "message": "Video uploaded successfully"
}
```

### Get Project Status
```http
GET /api/projects/{project_id}
```

Response:
```json
{
  "id": 123,
  "title": "My Video",
  "status": "completed",
  "duration": 120.5,
  "language": "hi",
  "accuracy_score": 0.98,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get Subtitles
```http
GET /api/subtitles/{project_id}
```

Response:
```json
{
  "subtitles": [
    {
      "id": 1,
      "start_time": 0.0,
      "end_time": 2.5,
      "text": "नमस्ते दोस्तों",
      "speaker": "Speaker 1"
    },
    {
      "id": 2,
      "start_time": 2.5,
      "end_time": 5.0,
      "text": "आज हम बात करेंगे",
      "speaker": "Speaker 1"
    }
  ]
}
```

### Update Subtitle
```http
PUT /api/subtitles/{subtitle_id}
Content-Type: application/json

{
  "text": "Updated subtitle text",
  "start_time": 0.0,
  "end_time": 2.5
}
```

### Export Subtitles
```http
POST /api/export/{project_id}
Content-Type: application/json

{
  "format": "srt",  // srt, vtt, mp4
  "style": {
    "font": "Arial",
    "size": 24,
    "color": "#FFFFFF",
    "position": "bottom"
  }
}
```

Response:
```json
{
  "download_url": "https://r2.example.com/exports/project_123.srt",
  "expires_at": "2024-01-01T01:00:00Z"
}
```

### Translate Subtitles
```http
POST /api/subtitles/{project_id}/translate
Content-Type: application/json

{
  "target_language": "en"
}
```

## Error Responses
```json
{
  "error": "File too large",
  "code": "FILE_SIZE_EXCEEDED",
  "details": "Maximum file size is 2GB for free users"
}
```

## Rate Limits
- Free users: 10 requests/minute
- Pro users: 100 requests/minute
- Team users: 1000 requests/minute