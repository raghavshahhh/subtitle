# SubtitleAI API Documentation

## Base URL
- **Production**: `https://your-api-domain.com`
- **Development**: `http://localhost:8000`

## Interactive Documentation
- **Swagger UI**: `/api/docs`
- **ReDoc**: `/api/redoc`
- **OpenAPI JSON**: `/api/openapi.json`

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

### POST /api/auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

---

## Video Upload

### POST /api/upload/video
Upload a video file for subtitle generation.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file`: Video file (MP4, AVI, MOV, etc.)
- `language`: Language code (e.g., "en", "hi", "es")
- `title`: Project title (optional)

**Response (200):**
```json
{
  "project_id": "uuid",
  "status": "processing",
  "message": "Video uploaded successfully",
  "file_url": "https://storage.com/video.mp4"
}
```

**Rate Limit:** 10 uploads per hour

---

## Projects

### GET /api/projects/
Get all projects for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Number of records to return (default: 10)
- `status`: Filter by status (processing, completed, failed)

**Response (200):**
```json
{
  "projects": [
    {
      "id": "uuid",
      "title": "My Video",
      "status": "completed",
      "language": "en",
      "duration": 120.5,
      "created_at": "2024-01-01T00:00:00Z",
      "video_url": "https://storage.com/video.mp4"
    }
  ],
  "total": 1
}
```

### GET /api/projects/{project_id}
Get specific project details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "title": "My Video",
  "status": "completed",
  "language": "en",
  "duration": 120.5,
  "subtitles": [
    {
      "id": "uuid",
      "start_time": 0.0,
      "end_time": 2.5,
      "text": "Hello, welcome to the video"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### DELETE /api/projects/{project_id}
Delete a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

---

## Subtitles

### GET /api/projects/{project_id}/subtitles
Get subtitles for a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "subtitles": [
    {
      "id": "uuid",
      "start_time": 0.0,
      "end_time": 2.5,
      "text": "Hello, welcome to the video"
    }
  ]
}
```

### PUT /api/projects/{project_id}/subtitles/{subtitle_id}
Update a subtitle.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "Updated subtitle text",
  "start_time": 0.0,
  "end_time": 2.5
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "text": "Updated subtitle text",
  "start_time": 0.0,
  "end_time": 2.5
}
```

---

## Export

### GET /api/projects/{project_id}/export
Export subtitles in various formats.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `format`: Export format (srt, vtt, txt, json)

**Response (200):**
Returns file download with appropriate Content-Type:
- `text/plain` for SRT, VTT, TXT
- `application/json` for JSON

**Rate Limit:** 30 exports per hour

---

## Health & Monitoring

### GET /
API root endpoint.

**Response (200):**
```json
{
  "message": "SubtitleAI API is running 🔥",
  "version": "2.0.0",
  "environment": "production",
  "docs": "/api/docs"
}
```

### GET /api/health
Health check endpoint.

**Response (200):**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "environment": "production"
}
```

### GET /metrics
Prometheus metrics endpoint (for monitoring).

**Response (200):**
Returns Prometheus-formatted metrics.

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 429 Rate Limit Exceeded
```json
{
  "detail": "Rate limit exceeded. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limits

| Endpoint Type | Limit |
|--------------|-------|
| Authentication | 5 requests/minute |
| Video Upload | 10 requests/hour |
| General API | 60 requests/minute |
| Export | 30 requests/hour |

---

## Webhooks (Optional)

### POST /api/webhooks/subtitle-complete
Webhook called when subtitle generation is complete.

**Payload:**
```json
{
  "project_id": "uuid",
  "status": "completed",
  "subtitle_count": 150,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## SDKs & Examples

### cURL Example
```bash
# Login
curl -X POST https://api.subtitleai.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Upload Video
curl -X POST https://api.subtitleai.com/api/upload/video \
  -H "Authorization: Bearer <token>" \
  -F "file=@video.mp4" \
  -F "language=en" \
  -F "title=My Video"

# Get Projects
curl -X GET https://api.subtitleai.com/api/projects/ \
  -H "Authorization: Bearer <token>"
```

### Python Example
```python
import requests

# Login
response = requests.post(
    "https://api.subtitleai.com/api/auth/login",
    json={"email": "user@example.com", "password": "pass123"}
)
token = response.json()["access_token"]

# Upload Video
with open("video.mp4", "rb") as f:
    response = requests.post(
        "https://api.subtitleai.com/api/upload/video",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": f},
        data={"language": "en", "title": "My Video"}
    )
project_id = response.json()["project_id"]

# Get Subtitles
response = requests.get(
    f"https://api.subtitleai.com/api/projects/{project_id}",
    headers={"Authorization": f"Bearer {token}"}
)
subtitles = response.json()["subtitles"]
```

### JavaScript Example
```javascript
// Login
const loginResponse = await fetch('https://api.subtitleai.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'pass123' })
});
const { access_token } = await loginResponse.json();

// Upload Video
const formData = new FormData();
formData.append('file', videoFile);
formData.append('language', 'en');
formData.append('title', 'My Video');

const uploadResponse = await fetch('https://api.subtitleai.com/api/upload/video', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${access_token}` },
  body: formData
});
const { project_id } = await uploadResponse.json();

// Get Subtitles
const projectResponse = await fetch(
  `https://api.subtitleai.com/api/projects/${project_id}`,
  { headers: { 'Authorization': `Bearer ${access_token}` } }
);
const { subtitles } = await projectResponse.json();
```

---

## Support

For API support, contact: support@subtitleai.com

**API Status**: https://status.subtitleai.com
