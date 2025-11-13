# SubtitleAI Setup Guide

## Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- Redis
- FFmpeg

## Backend Setup

1. **Create virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Environment variables**
```bash
cp .env.example .env
# Fill in your API keys and database URLs
```

4. **Database setup**
```bash
# Create PostgreSQL database
createdb subtitleai

# Run migrations (tables will be created automatically)
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

5. **Start services**
```bash
# Terminal 1: API server
uvicorn app.main:app --reload

# Terminal 2: Celery worker
celery -A app.tasks.transcription_tasks worker --loglevel=info

# Terminal 3: Redis (if not running as service)
redis-server
```

## Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Environment variables**
```bash
cp .env.example .env.local
# Add your Supabase and API URLs
```

3. **Start development server**
```bash
npm run dev
```

## API Keys Required

### Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get URL and anon key from Settings > API

### Google Gemini (Free tier available)
1. Go to [ai.google.dev](https://ai.google.dev)
2. Create API key
3. Add to backend .env

### Cloudflare R2 (Free 10GB)
1. Go to Cloudflare dashboard
2. Create R2 bucket
3. Generate API tokens
4. Add to backend .env

### Razorpay (Test mode free)
1. Go to [razorpay.com](https://razorpay.com)
2. Create account
3. Get test API keys
4. Add to backend .env

## Docker Setup (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Production Deployment

### Backend (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway new
railway add
railway deploy
```

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Troubleshooting

### Common Issues

1. **FFmpeg not found**
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

2. **Database connection error**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

3. **Celery worker not starting**
- Check Redis is running
- Verify REDIS_URL in .env
- Install celery dependencies

4. **Upload fails**
- Check file size limits
- Verify R2 credentials
- Check network connectivity

### Performance Tips

1. **For development**
- Use SQLite instead of PostgreSQL
- Reduce video quality for testing
- Use smaller test files

2. **For production**
- Enable Redis caching
- Use CDN for static files
- Optimize database queries
- Monitor memory usage

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Integration tests
npm run test:e2e
```