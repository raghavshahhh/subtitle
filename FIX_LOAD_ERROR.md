# 🔧 Fix "Load Failed" Error

## Problem
"Error generating subtitles: Load failed" - Backend se connection nahi ho pa raha

## Quick Fix (3 Steps)

### Step 1: Check Backend is Running
```bash
# Check if backend is running
curl http://localhost:8000/health

# Should return: {"status":"healthy",...}
```

### Step 2: Start Backend (if not running)
```bash
cd /Users/raghavpratap/Desktop/SubtitleAI/subtitleai/backend

# Activate virtual environment
source venv/bin/activate

# Start backend
uvicorn app.main:app --reload --port 8000
```

### Step 3: Start Celery Worker
```bash
# New terminal
cd /Users/raghavpratap/Desktop/SubtitleAI/subtitleai/backend
source venv/bin/activate

# Start celery
celery -A celery_worker.celery_app worker --loglevel=info
```

### Step 4: Check Redis
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG

# If not running, start it:
redis-server --daemonize yes
```

## OR Use Start Script

```bash
cd /Users/raghavpratap/Desktop/SubtitleAI
./START_APP.sh
```

## Test Backend

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test API docs
open http://localhost:8000/api/docs
```

## Common Issues

### Issue 1: Port 8000 already in use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Then restart backend
```

### Issue 2: Redis not running
```bash
# Start Redis
redis-server --daemonize yes

# Verify
redis-cli ping
```

### Issue 3: Missing dependencies
```bash
cd subtitleai/backend
source venv/bin/activate
pip install -r requirements.txt
```

### Issue 4: Database not created
```bash
cd subtitleai/backend
source venv/bin/activate
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

### Issue 5: CORS error
Check `subtitleai/backend/.env`:
```env
DEBUG=True
```

## Verify Everything is Working

1. **Backend**: http://localhost:8000/health
2. **API Docs**: http://localhost:8000/api/docs
3. **Frontend**: http://localhost:3000
4. **Redis**: `redis-cli ping`

## Still Not Working?

### Check Logs

```bash
# Backend logs
tail -f backend.log

# Celery logs
tail -f celery.log

# Frontend logs
tail -f frontend.log
```

### Manual Test Upload

```bash
# Test upload endpoint
curl -X POST http://localhost:8000/api/upload/video \
  -F "file=@test.mp4" \
  -F "title=Test" \
  -F "language=hi"
```

## Environment Variables

Make sure `subtitleai/frontend/.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Make sure `subtitleai/backend/.env` has:
```env
DATABASE_URL=sqlite:///./subtitleai.db
REDIS_URL=redis://localhost:6379
DEBUG=True
```

## Complete Restart

```bash
# Stop everything
./STOP_APP.sh

# Wait 5 seconds
sleep 5

# Start everything
./START_APP.sh

# Wait for services to start (30 seconds)
sleep 30

# Test
curl http://localhost:8000/health
```

## Success Checklist

- [ ] Backend running on port 8000
- [ ] Celery worker running
- [ ] Redis running
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:8000/health
- [ ] Can access http://localhost:8000/api/docs
- [ ] Can access http://localhost:3000

If all checked, try uploading video again!

---

**Need more help?** Check `COMPLETE_GUIDE.md` or email raghav@ragspro.com
