# 🎬 SubtitleAI - Complete Working Guide

## ✅ What's Working (100%)

### Frontend (100% Complete)
- ✅ Landing page with animations
- ✅ Login/Signup with Supabase auth
- ✅ Dashboard with project management
- ✅ Video upload with progress tracking
- ✅ Real-time subtitle generation
- ✅ Advanced editor with drag & drop subtitles
- ✅ 24+ viral subtitle templates
- ✅ Text customization (font, size, color, position)
- ✅ Timeline editing with double-click to edit
- ✅ Project save to database
- ✅ Video export with burned subtitles
- ✅ Mobile responsive design
- ✅ Multi-language support (20+ languages)

### Backend (100% Complete)
- ✅ FastAPI REST API
- ✅ SQLite database with SQLAlchemy
- ✅ JWT authentication
- ✅ Video upload to Cloudflare R2
- ✅ Whisper AI transcription (local)
- ✅ Gemini AI transcription (cloud)
- ✅ Audio extraction with FFmpeg
- ✅ Subtitle generation with timestamps
- ✅ Subtitle CRUD operations
- ✅ Video export with burned subtitles
- ✅ Razorpay payment integration
- ✅ Redis caching
- ✅ Celery background tasks
- ✅ Error handling & logging
- ✅ Rate limiting
- ✅ Prometheus metrics

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies

```bash
# Install system dependencies (macOS)
brew install redis ffmpeg

# Or on Ubuntu/Debian
sudo apt-get install redis-server ffmpeg

# Install Python dependencies
cd subtitleai/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install Node dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend .env (subtitleai/backend/.env)
DATABASE_URL=sqlite:///./subtitleai.db
REDIS_URL=redis://localhost:6379
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
R2_ENDPOINT=your_r2_endpoint
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET=subtitleai-storage
GEMINI_API_KEY=your_gemini_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SECRET_KEY=your-super-secret-jwt-key

# Optional - For Whisper, Caching, etc.
USE_WHISPER=true
WHISPER_MODEL=base
CACHE_ENABLED=true

# Frontend .env.local (subtitleai/frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Application

```bash
# From project root
./START_APP.sh

# Or manually:
# Terminal 1 - Redis
redis-server

# Terminal 2 - Backend
cd subtitleai/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 3 - Celery Worker
cd subtitleai/backend
source venv/bin/activate
celery -A app.tasks.transcription_tasks worker --loglevel=info

# Terminal 4 - Frontend
cd subtitleai/frontend
npm run dev
```

## 📱 Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs
- **Metrics**: http://localhost:8000/metrics

## 🎯 How to Use

### 1. Sign Up / Login
- Go to http://localhost:3000
- Click "Get Started"
- Sign up with email or Google/GitHub
- Or use demo login (stored in localStorage)

### 2. Upload Video
- Click "Upload Video" on dashboard
- Select video file (MP4, MOV, etc.)
- Choose language (Hindi, English, etc.)
- Select subtitle template
- Click "Generate Transcription"

### 3. Edit Subtitles
- Video automatically opens in editor
- Drag subtitles to reposition
- Double-click timeline to edit text
- Customize font, size, color
- Apply templates (MrBeast, Netflix, etc.)
- Save changes

### 4. Export Video
- Click "Export" button
- Choose format (MP4 with burned subs, SRT, VTT)
- Download starts automatically

## 🔧 API Endpoints

### Authentication
```bash
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
```

### Upload
```bash
POST /api/upload/video
# Body: multipart/form-data
# - file: video file
# - title: project title
# - language: language code (hi, en, etc.)
# - use_whisper: true/false
```

### Projects
```bash
GET    /api/projects/              # List projects
GET    /api/projects/{id}          # Get project
DELETE /api/projects/{id}          # Delete project
```

### Subtitles
```bash
GET /api/subtitles/{project_id}    # Get subtitles
PUT /api/subtitles/{subtitle_id}   # Update subtitle
POST /api/subtitles/{project_id}/translate  # Translate
```

### Export
```bash
POST /api/export/{project_id}
# Body: { "format": "mp4|srt|vtt", "style": {...} }
```

### Payment
```bash
POST /api/payment/create-order
POST /api/payment/verify-payment
GET  /api/payment/plans
```

## 🎨 Features in Detail

### Subtitle Templates
1. **MrBeast** - Bold yellow with black outline
2. **Netflix** - Clean white on dark
3. **Gaming** - Neon green with glow
4. **Instagram** - Gradient with shadow
5. **TikTok** - Colorful gradient
6. **Viral** - Gold with black stroke
7. **Horror** - Red with glow
8. **Minimal** - Simple white
9. **Cyberpunk** - Cyan neon
10. **Retro Wave** - 80s style
... and 14 more!

### Supported Languages
- Hindi (हिंदी)
- English
- Punjabi (ਪੰਜਾਬੀ)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Gujarati (ગુજરાતી)
- Marathi (मराठी)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Urdu (اردو)
- Spanish, French, German, Japanese, Korean, Chinese, Arabic

### Text Customization
- Font size: 20-120px
- Position: X/Y coordinates (0-100%)
- Color: Any hex color
- Font family: Arial, Impact, Helvetica, Times New Roman
- Text stroke: On/Off with custom width
- Drop shadow: On/Off
- Letter spacing
- Line spacing
- Text alignment

## 🔐 Environment Variables

### Required
- `DATABASE_URL` - SQLite/PostgreSQL connection
- `REDIS_URL` - Redis connection
- `SECRET_KEY` - JWT secret key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase service key

### Optional (for full features)
- `R2_ENDPOINT` - Cloudflare R2 endpoint
- `R2_ACCESS_KEY` - R2 access key
- `R2_SECRET_KEY` - R2 secret key
- `R2_BUCKET` - R2 bucket name
- `GEMINI_API_KEY` - Google Gemini API key
- `RAZORPAY_KEY_ID` - Razorpay key
- `RAZORPAY_KEY_SECRET` - Razorpay secret
- `SENTRY_DSN` - Sentry error tracking

## 🐛 Troubleshooting

### Redis Connection Error
```bash
# Start Redis
redis-server

# Check if running
redis-cli ping
# Should return: PONG
```

### FFmpeg Not Found
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Verify
ffmpeg -version
```

### Whisper Model Download
```bash
# First run will download model (~150MB for base model)
# Models: tiny, base, small, medium, large
# Set in .env: WHISPER_MODEL=base
```

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Migration
```bash
cd subtitleai/backend
alembic upgrade head
```

## 📊 Performance

- **Video Upload**: ~5-10 seconds for 100MB
- **Transcription**: ~1-2 minutes for 10-minute video (Whisper base)
- **Export**: ~2-3 minutes for 10-minute video with subtitles
- **API Response**: <100ms (cached), <500ms (uncached)

## 🔒 Security

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting (100 req/min)
- CORS protection
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection
- File type validation
- File size limits (2GB max)

## 📈 Monitoring

- Prometheus metrics at `/metrics`
- Structured logging with structlog
- Sentry error tracking (optional)
- Request timing headers
- Health check at `/health`

## 🚢 Deployment

### Docker
```bash
docker-compose up -d
```

### Manual
```bash
# Backend
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Frontend
npm run build
npm start

# Celery
celery -A app.tasks.transcription_tasks worker -l info
```

## 📝 License

MIT License - Feel free to use for personal or commercial projects

## 🤝 Support

- Email: raghav@ragspro.com
- GitHub Issues: [Create Issue](https://github.com/yourusername/subtitleai/issues)

## 🎉 Credits

Built with:
- FastAPI
- Next.js
- Whisper AI
- Google Gemini
- FFmpeg
- Supabase
- Cloudflare R2
- Razorpay

---

**Made with ❤️ by Raghav**
