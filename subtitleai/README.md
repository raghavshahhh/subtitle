# SubtitleAI - Automated Subtitle Generation SaaS

AI-powered subtitle generation for creators. Generate 98% accurate subtitles in 2 minutes with custom styling.

## Tech Stack
- **Frontend**: Next.js + React + TailwindCSS
- **Backend**: FastAPI + Python
- **Database**: PostgreSQL (Supabase)
- **AI**: Google Gemini API
- **Storage**: Cloudflare R2
- **Queue**: Celery + Redis
- **Auth**: Supabase Auth
- **Payment**: Razorpay

## Features
- 50+ language support (Hindi, English, Punjabi focus)
- Real-time subtitle editor
- Custom styling & fonts
- Export: SRT, VTT, MP4 with burned subtitles
- Speaker identification
- Auto translation

## Quick Start
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Architecture
```
User Upload → Audio Extract → Gemini AI → Post-process → Editor → Export
```

Target: 100 users by month 2, 1000 by month 6