# Production Deployment Guide - subtitleai.ragspro.com

## Pre-Deployment Checklist

### 1. Environment Variables
```bash
# Backend (.env)
DEBUG=False
ENVIRONMENT=production
DATABASE_URL=<supabase-postgres-url>
REDIS_URL=<upstash-redis-url>
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
R2_ENDPOINT=<cloudflare-r2-endpoint>
R2_ACCESS_KEY=<r2-access-key>
R2_SECRET_KEY=<r2-secret-key>
R2_BUCKET=subtitleai-prod
GEMINI_API_KEY=<gemini-key>
RAZORPAY_KEY_ID=<razorpay-key>
RAZORPAY_KEY_SECRET=<razorpay-secret>
SECRET_KEY=<generate-strong-key>
SENTRY_DSN=<sentry-dsn>
```

### 2. Database Setup (Supabase)
```sql
-- Run migrations
cd backend
alembic upgrade head

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtitles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id::text);
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id::text);
```

### 3. Deploy Backend (Railway/Render)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway link
railway up

# Set environment variables in Railway dashboard
```

### 4. Deploy Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Value: https://api.subtitleai.ragspro.com
```

### 5. Domain Setup
```
# DNS Records
A     subtitleai.ragspro.com     -> Vercel IP
CNAME api.subtitleai.ragspro.com -> Railway/Render URL
```

### 6. SSL/TLS
- Vercel: Auto SSL
- Railway: Auto SSL
- Cloudflare: Enable Full (strict) SSL

### 7. Monitoring Setup
```bash
# Sentry
- Create project at sentry.io
- Add DSN to backend .env
- Test: python -c "import sentry_sdk; sentry_sdk.init('DSN'); 1/0"

# Uptime monitoring
- UptimeRobot: Monitor /health endpoint
- Frequency: 5 minutes
```

### 8. Performance
```bash
# Backend
- Workers: 4 (Railway: 1GB RAM)
- Connection pool: 20
- Redis cache: Enabled

# Frontend
- CDN: Vercel Edge Network
- Image optimization: Next.js Image
- Code splitting: Automatic
```

### 9. Backup Strategy
```bash
# Database: Supabase auto-backup (daily)
# Files: R2 versioning enabled
# Code: GitHub (main branch protected)
```

### 10. Testing
```bash
# Run tests before deploy
cd backend && pytest
cd frontend && npm run build

# Load testing
artillery quick --count 100 --num 10 https://subtitleai.ragspro.com
```

## Post-Deployment

### Health Checks
```bash
curl https://api.subtitleai.ragspro.com/health
curl https://subtitleai.ragspro.com
```

### Monitoring Dashboard
- Sentry: Errors & Performance
- Railway: Logs & Metrics
- Vercel: Analytics & Web Vitals

### Rollback Plan
```bash
# Railway
railway rollback

# Vercel
vercel rollback
```

## Scaling (1000+ users)
- Backend: Scale to 2GB RAM, 2 instances
- Database: Upgrade Supabase plan
- Redis: Upgrade Upstash plan
- CDN: Enable Cloudflare in front

## Cost Estimate (1000 users)
- Railway: $20/month
- Vercel: Free
- Supabase: $25/month
- Upstash: $10/month
- R2: $5/month
- Total: ~$60/month
