# 🚀 Alternative: Deploy Backend to Render

## Option 1: Render (Easier - No CLI needed)

### Step 1: Go to Render
1. Visit [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 2: Connect Repository
1. Connect GitHub account
2. Select `ragspro/subtitle` repository
3. Set **Root Directory**: `subtitleai/backend`

### Step 3: Configure
```bash
Name: subtitleai-backend
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Step 4: Environment Variables
```bash
DATABASE_URL=sqlite:///./subtitleai.db
SECRET_KEY=demo-secret-key-minimum-32-characters-long
ALLOWED_ORIGINS=*
DEBUG=False
ENVIRONMENT=production
```

### Step 5: Deploy
Click "Create Web Service" - it will auto-deploy!

### Step 6: Update Vercel
Copy Render URL and update Vercel environment variable:
`NEXT_PUBLIC_API_URL=https://your-app.onrender.com`

## ✅ Result:
Backend deployed without CLI! Just browser-based setup.

**Render is easier than Railway for first-time deployment!** 🎯