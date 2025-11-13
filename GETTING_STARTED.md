# 🚀 Getting Started with SubtitleAI

## 📋 Pre-Installation Checklist

Before starting, make sure you have:

- [ ] macOS, Linux, or Windows with WSL
- [ ] Python 3.10 or higher
- [ ] Node.js 18 or higher
- [ ] Git installed
- [ ] Terminal/Command Line access
- [ ] At least 2GB free disk space

## 🔧 Step-by-Step Setup

### Step 1: Install System Dependencies

#### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install python@3.10 node redis ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y python3.10 python3-pip nodejs npm redis-server ffmpeg
```

#### Windows (WSL)
```bash
# Install WSL first, then follow Ubuntu instructions
wsl --install
```

### Step 2: Clone Repository

```bash
cd ~/Desktop
git clone https://github.com/yourusername/subtitleai.git
cd SubtitleAI
```

### Step 3: Test Your Setup

```bash
chmod +x TEST_SETUP.sh
./TEST_SETUP.sh
```

If you see any ❌ errors, install the missing dependencies.

### Step 4: Setup Backend

```bash
cd subtitleai/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Install Python packages
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use any text editor
```

#### Required Environment Variables

Edit `subtitleai/backend/.env`:

```env
# Database (SQLite - no setup needed)
DATABASE_URL=sqlite:///./subtitleai.db

# Redis (local)
REDIS_URL=redis://localhost:6379

# Supabase (get from https://supabase.com)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# Cloudflare R2 (get from https://dash.cloudflare.com)
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_ACCESS_KEY=your-access-key
R2_SECRET_KEY=your-secret-key
R2_BUCKET=subtitleai-storage

# Google Gemini (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key

# Razorpay (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your-secret

# JWT Secret (generate random string)
SECRET_KEY=your-super-secret-jwt-key-change-this
```

### Step 5: Setup Frontend

```bash
cd ../frontend

# Install Node packages
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Edit `subtitleai/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 6: Start Redis

```bash
# macOS/Linux
redis-server --daemonize yes

# Check if running
redis-cli ping
# Should return: PONG
```

### Step 7: Start Application

```bash
# Go back to project root
cd ../..

# Make scripts executable
chmod +x START_APP.sh STOP_APP.sh

# Start everything
./START_APP.sh
```

You should see:
```
🎉 SubtitleAI is now running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 Frontend:  http://localhost:3000
🔧 Backend:   http://localhost:8000
📚 API Docs:  http://localhost:8000/api/docs
```

### Step 8: Test the Application

1. **Open Frontend**
   ```bash
   open http://localhost:3000
   ```

2. **Sign Up**
   - Click "Get Started"
   - Enter email and password
   - Or use Google/GitHub login

3. **Upload Video**
   - Click "Upload Video"
   - Select a video file (MP4, MOV)
   - Choose language (e.g., Hindi)
   - Select template (e.g., MrBeast)
   - Click "Generate Transcription"

4. **Wait for Processing**
   - First time will download Whisper model (~150MB)
   - Processing takes 1-2 minutes for 10-minute video
   - You'll see progress: Uploading → Extracting → Generating

5. **Edit Subtitles**
   - Video opens in editor automatically
   - Drag subtitles to reposition
   - Double-click timeline to edit text
   - Change font, size, color
   - Apply different templates
   - Click "Save"

6. **Export Video**
   - Click "Export" button
   - Choose format (MP4 with subs, SRT, VTT)
   - Download starts automatically

## 🎯 Quick Commands

### Start Application
```bash
./START_APP.sh
```

### Stop Application
```bash
./STOP_APP.sh
```

### View Logs
```bash
# Backend logs
tail -f backend.log

# Celery logs
tail -f celery.log

# Frontend logs
tail -f frontend.log
```

### Restart Services
```bash
./STOP_APP.sh
./START_APP.sh
```

## 🐛 Common Issues

### Issue: Redis connection error
```bash
# Solution: Start Redis
redis-server --daemonize yes
```

### Issue: Port 8000 already in use
```bash
# Solution: Kill process
lsof -ti:8000 | xargs kill -9
```

### Issue: Port 3000 already in use
```bash
# Solution: Kill process
lsof -ti:3000 | xargs kill -9
```

### Issue: FFmpeg not found
```bash
# Solution: Install FFmpeg
brew install ffmpeg  # macOS
sudo apt-get install ffmpeg  # Ubuntu
```

### Issue: Python module not found
```bash
# Solution: Reinstall dependencies
cd subtitleai/backend
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Node modules error
```bash
# Solution: Reinstall dependencies
cd subtitleai/frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database error
```bash
# Solution: Reset database
cd subtitleai/backend
rm subtitleai.db
# Restart backend - database will be recreated
```

### Issue: Whisper model download fails
```bash
# Solution: Download manually
cd subtitleai/backend
source venv/bin/activate
python -c "import whisper; whisper.load_model('base')"
```

## 📚 Next Steps

1. **Read Documentation**
   - [Complete Guide](COMPLETE_GUIDE.md) - Full features and API
   - [Fixes Completed](FIXES_COMPLETED.md) - What was fixed
   - [API Docs](http://localhost:8000/api/docs) - Interactive API

2. **Customize**
   - Add your own templates
   - Modify subtitle styles
   - Add new languages
   - Customize UI theme

3. **Deploy**
   - Setup production environment
   - Configure domain
   - Setup SSL certificate
   - Deploy to cloud

4. **Integrate**
   - Use API in your app
   - Automate video processing
   - Build custom workflows

## 🎓 Learning Resources

### Video Tutorials
- [How to Upload Video](#)
- [How to Edit Subtitles](#)
- [How to Export Video](#)
- [API Integration Guide](#)

### Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Whisper AI Docs](https://github.com/openai/whisper)
- [FFmpeg Docs](https://ffmpeg.org/documentation.html)

## 💡 Tips & Tricks

1. **Faster Processing**
   - Use smaller Whisper model (tiny, base)
   - Enable audio enhancement for better accuracy
   - Process shorter videos first

2. **Better Subtitles**
   - Choose correct language
   - Use audio enhancement
   - Edit timing manually if needed
   - Apply appropriate template

3. **Optimize Performance**
   - Enable Redis caching
   - Use Celery for background tasks
   - Compress videos before upload
   - Use CDN for video delivery

4. **Save Time**
   - Use keyboard shortcuts
   - Save templates as presets
   - Batch process multiple videos
   - Use API for automation

## 🆘 Getting Help

### Documentation
- [Complete Guide](COMPLETE_GUIDE.md)
- [API Documentation](http://localhost:8000/api/docs)
- [Troubleshooting Guide](COMPLETE_GUIDE.md#troubleshooting)

### Support
- Email: raghav@ragspro.com
- GitHub Issues: [Create Issue](https://github.com/yourusername/subtitleai/issues)

### Community
- Discord: [Join Server](#)
- Twitter: [@subtitleai](#)
- YouTube: [SubtitleAI Channel](#)

## ✅ Success Checklist

After setup, you should be able to:

- [ ] Access frontend at http://localhost:3000
- [ ] Access backend at http://localhost:8000
- [ ] View API docs at http://localhost:8000/api/docs
- [ ] Sign up / Login
- [ ] Upload video
- [ ] Generate subtitles
- [ ] Edit subtitles in editor
- [ ] Save project
- [ ] Export video with subtitles
- [ ] View project list
- [ ] Delete project

If all checkboxes are ✅, congratulations! You're ready to use SubtitleAI! 🎉

---

**Need help? Check [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) or email raghav@ragspro.com**
