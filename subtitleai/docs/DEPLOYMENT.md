# Deployment Guide

## Free Tier Deployment Strategy

### Backend (Railway/Render)
```bash
# Railway deployment
railway login
railway new
railway add
railway deploy

# Environment variables to set:
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GEMINI_API_KEY=...
```

### Frontend (Vercel)
```bash
# Vercel deployment
npm i -g vercel
vercel login
vercel --prod

# Environment variables:
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Database (Supabase Free)
1. Create project at supabase.com
2. Get connection string
3. Run migrations:
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  plan VARCHAR DEFAULT 'free',
  credits INTEGER DEFAULT 60,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR NOT NULL,
  video_url VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'uploading',
  language VARCHAR DEFAULT 'hi',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subtitles table
CREATE TABLE subtitles (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL,
  text TEXT NOT NULL,
  speaker VARCHAR DEFAULT 'Speaker 1',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage (Cloudflare R2 Free)
1. Create R2 bucket
2. Generate API tokens
3. Configure CORS:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"]
  }
]
```

### Queue (Upstash Redis Free)
1. Create Redis database at upstash.com
2. Get connection URL
3. Configure Celery worker on Railway

## Scaling Plan (1000+ users)

### Performance Optimizations
- CDN for video files
- Database connection pooling
- Redis caching for API responses
- Horizontal scaling with load balancer

### Cost Management
- Implement usage-based billing
- Optimize Gemini API calls
- Compress video files
- Archive old projects

### Monitoring
- Sentry for error tracking
- PostHog for analytics
- Custom metrics dashboard