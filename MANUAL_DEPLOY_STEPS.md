# 🚀 Manual Backend Deploy - SubtitleAI

## ⚡ Quick Deploy (5 Minutes):

### Step 1: Railway Login
```bash
cd /Users/raghavpratap/Desktop/SubtitleAI/subtitleai/backend
railway login
# This will open browser - login with GitHub
```

### Step 2: Deploy Backend
```bash
railway up
# Wait for deployment to complete
```

### Step 3: Get Railway URL
```bash
railway status
# Copy the URL (https://xxx.railway.app)
```

### Step 4: Update Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Update: `NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app`
5. Redeploy

## ✅ Test:
Visit your Vercel site and try uploading a video. Backend error should be gone!

## 🔧 Environment Variables for Railway:
```bash
DATABASE_URL=sqlite:///./subtitleai.db
SECRET_KEY=demo-secret-key-minimum-32-characters
ALLOWED_ORIGINS=*
```

**Just run these commands manually and your backend will be live!** 🎯