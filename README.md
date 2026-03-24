# 🎬 SubtitleAI - AI-Powered Subtitle Generator

> Transform your videos with AI-generated subtitles in 20+ languages with viral templates

[![Status](https://img.shields.io/badge/status-100%25%20Working-success)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10+-blue)](https://python.org)
[![Node](https://img.shields.io/badge/node-18+-green)](https://nodejs.org)

## ✨ Features

- 🎥 **Video Upload** - Support for MP4, MOV, AVI, MKV
- 🤖 **AI Transcription** - Whisper AI + Google Gemini
- 🌍 **20+ Languages** - Hindi, English, Spanish, French, and more
- 🎨 **24+ Templates** - MrBeast, Netflix, Gaming, TikTok styles
- ✏️ **Advanced Editor** - Drag, drop, and customize subtitles
- 💾 **Auto-Save** - Real-time database sync
- 📤 **Export** - MP4 with burned subs, SRT, VTT
- 📱 **Mobile Ready** - Fully responsive design
- 💳 **Payments** - Razorpay integration
- ⚡ **Fast** - Redis caching + Celery tasks

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Redis
- FFmpeg

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/subtitleai.git
cd SubtitleAI

# Test setup
./TEST_SETUP.sh

# Start application
./START_APP.sh
```

That's it! Open http://localhost:3000

## 📖 Documentation

- **[Complete Guide](COMPLETE_GUIDE.md)** - Full setup and usage
- **[Fixes Completed](FIXES_COMPLETED.md)** - What was fixed
- **[API Docs](http://localhost:8000/api/docs)** - Interactive API documentation

## 🎯 Usage

### 1. Upload Video
```bash
# Via UI
1. Go to http://localhost:3000
2. Click "Upload Video"
3. Select file and language
4. Choose template
5. Click "Generate"

# Via API
curl -X POST http://localhost:8000/api/upload/video \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@video.mp4" \
  -F "title=My Video" \
  -F "language=hi"
```

### 2. Edit Subtitles
- Drag to reposition
- Double-click to edit text
- Customize font, size, color
- Apply templates
- Save changes

### 3. Export
- Click "Export" button
- Choose format (MP4, SRT, VTT)
- Download automatically

## 🏗️ Architecture

```
SubtitleAI/
├── subtitleai/
│   ├── backend/          # FastAPI + Celery
│   │   ├── app/
│   │   │   ├── api/      # REST endpoints
│   │   │   ├── models/   # Database models
│   │   │   ├── services/ # Business logic
│   │   │   └── tasks/    # Celery tasks
│   │   └── requirements.txt
│   └── frontend/         # Next.js + React
│       ├── pages/        # Routes
│       ├── components/   # UI components
│       └── lib/          # Utilities
├── START_APP.sh          # Start script
├── STOP_APP.sh           # Stop script
└── TEST_SETUP.sh         # Setup test
```

## 🔧 Configuration

### Backend (.env)
```env
DATABASE_URL=sqlite:///./subtitleai.db
REDIS_URL=redis://localhost:6379
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
R2_ENDPOINT=your_endpoint
R2_ACCESS_KEY=your_key
R2_SECRET_KEY=your_secret
GEMINI_API_KEY=your_key
RAZORPAY_KEY_ID=your_key
SECRET_KEY=your_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## 📊 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **Celery** - Background task processing
- **Redis** - Caching and message broker
- **Whisper AI** - Speech-to-text
- **Google Gemini** - AI transcription
- **FFmpeg** - Video processing
- **Cloudflare R2** - Object storage

### Frontend
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Supabase** - Authentication

## 🎨 Templates

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

## 🌍 Supported Languages

Hindi • English • Punjabi • Tamil • Telugu • Bengali • Gujarati • Marathi • Kannada • Malayalam • Odia • Urdu • Spanish • French • German • Japanese • Korean • Chinese • Arabic

## 📈 Performance

- **Upload**: ~5-10s for 100MB
- **Transcription**: ~1-2min for 10min video
- **Export**: ~2-3min for 10min video
- **API Response**: <100ms (cached)

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting (100 req/min)
- CORS protection
- SQL injection prevention
- XSS protection
- File validation
- Size limits (2GB max)

## 🐛 Troubleshooting

### Redis not running
```bash
redis-server
```

### FFmpeg not found
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

### Port already in use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

See [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) for more troubleshooting.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user info

### Upload
- `POST /api/upload/video` - Upload video

### Projects
- `GET /api/projects/` - List projects
- `GET /api/projects/{id}` - Get project
- `DELETE /api/projects/{id}` - Delete project

### Subtitles
- `GET /api/subtitles/{project_id}` - Get subtitles
- `PUT /api/subtitles/{subtitle_id}` - Update subtitle

### Export
- `POST /api/export/{project_id}` - Export video

See [API Docs](http://localhost:8000/api/docs) for interactive documentation.

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
npm run build && npm start

# Celery
celery -A celery_worker.celery_app worker -l info
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 👨‍💻 Author

**Raghav**
- Email: ragsproai@gmail.com
- Website: [ragspro.com](https://ragspro.com)

## 🙏 Acknowledgments

- OpenAI Whisper for speech recognition
- Google Gemini for AI transcription
- FFmpeg for video processing
- Supabase for authentication
- Cloudflare for R2 storage

## ⭐ Star History

If you find this project useful, please consider giving it a star!
