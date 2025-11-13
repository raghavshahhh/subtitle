# SubtitleAI - Production Deployment Guide

## 🚀 Quick Deployment Checklist

### 1. Frontend (Vercel)
- ✅ Already deployed on Vercel
- ✅ Root Directory: `subtitleai/frontend`
- ✅ Framework: Next.js
- ⚠️ **Action Required**: Add environment variables in Vercel dashboard

#### Vercel Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Backend Deployment Options

#### Option A: Railway (Recommended - Easy)
1. Go to [Railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select `ragspro/subtitle` repository
4. Set Root Directory: `subtitleai/backend`
5. Add environment variables (see below)
6. Deploy!

#### Option B: Render
1. Go to [Render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Root Directory: `subtitleai/backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables

#### Option C: DigitalOcean App Platform
1. Create new app from GitHub
2. Select repository and branch
3. Set source directory: `subtitleai/backend`
4. Add environment variables
5. Deploy

### 3. Backend Environment Variables

**Critical - Must Set:**
```bash
# Database (Use PostgreSQL in production)
DATABASE_URL=postgresql://user:password@host:5432/subtitleai

# Redis (Required for Celery)
REDIS_URL=redis://your-redis-host:6379

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key

# Storage (Cloudflare R2)
R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET=subtitleai-production

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Security
SECRET_KEY=generate_secure_random_32_char_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Environment
DEBUG=False
ENVIRONMENT=production
LOG_LEVEL=INFO
```

### 4. Database Setup

#### PostgreSQL (Production)
```bash
# Create database
createdb subtitleai

# Run migrations
cd subtitleai/backend
alembic upgrade head
```

#### Supabase (Alternative)
- Already configured in code
- Just add SUPABASE_URL and SUPABASE_KEY
- Tables will auto-create

### 5. Redis Setup

**Option A: Railway Redis**
- Add Redis service in Railway
- Copy connection URL to REDIS_URL

**Option B: Upstash Redis (Free tier)**
1. Go to [Upstash.com](https://upstash.com)
2. Create Redis database
3. Copy connection URL

### 6. Storage Setup (Cloudflare R2)

1. Go to Cloudflare Dashboard → R2
2. Create bucket: `subtitleai-production`
3. Create API token with R2 permissions
4. Add credentials to environment variables

### 7. Post-Deployment Steps

1. **Update Frontend API URL**
   - In Vercel: Set `NEXT_PUBLIC_API_URL` to your backend URL
   - Redeploy frontend

2. **Update Backend CORS**
   - Set `ALLOWED_ORIGINS` to your frontend domain
   - Redeploy backend

3. **Test Health Check**
   ```bash
   curl https://your-backend-api.com/api/health
   ```

4. **Test Frontend**
   - Visit your domain
   - Try uploading a video
   - Check subtitle generation

### 8. Monitoring & Logs

**Backend Logs:**
- Railway: Built-in logs viewer
- Render: Logs tab in dashboard
- DigitalOcean: Runtime logs

**Frontend Logs:**
- Vercel: Deployments → View logs

### 9. Security Checklist

- ✅ HTTPS enabled (automatic on Vercel/Railway/Render)
- ✅ Security headers configured in next.config.js
- ✅ CORS properly configured
- ✅ Environment variables secured
- ✅ No secrets in code
- ⚠️ **TODO**: Set up rate limiting
- ⚠️ **TODO**: Configure CDN for static assets

### 10. Performance Optimization

**Already Configured:**
- ✅ Next.js standalone output
- ✅ SWC minification
- ✅ Compression enabled
- ✅ Security headers

**Recommended:**
- Add CDN (Cloudflare) for static assets
- Enable Redis caching
- Set up database connection pooling

### 11. Cost Estimate (Monthly)

**Free Tier Setup:**
- Vercel: Free (Hobby plan)
- Railway: $5 (with $5 free credit)
- Upstash Redis: Free tier
- Cloudflare R2: Free tier (10GB)
- **Total: ~$5/month**

**Production Setup:**
- Vercel: Free
- Railway: $20-50
- Redis: $10
- R2 Storage: $5-20
- **Total: ~$35-80/month**

### 12. Backup Strategy

1. **Database Backups**
   - Railway: Automatic daily backups
   - Manual: `pg_dump` weekly

2. **File Backups**
   - R2 has built-in versioning
   - Enable lifecycle policies

### 13. Troubleshooting

**Frontend not connecting to backend:**
- Check NEXT_PUBLIC_API_URL is correct
- Verify CORS settings in backend
- Check browser console for errors

**Backend errors:**
- Check logs in hosting platform
- Verify all environment variables are set
- Test database connection

**File upload fails:**
- Check R2 credentials
- Verify bucket permissions
- Check file size limits

### 14. Quick Commands

```bash
# Check backend health
curl https://your-api.com/api/health

# View backend logs (Railway)
railway logs

# Redeploy frontend
vercel --prod

# Run database migrations
alembic upgrade head
```

## 🎉 You're Production Ready!

Your SubtitleAI app is now ready for production. Monitor logs, set up alerts, and scale as needed!

**Support:** For issues, check logs first, then review this guide.
