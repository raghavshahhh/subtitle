# 🚀 Backend Deploy - Automated

## ⚡ One Command Deploy:

```bash
cd /Users/raghavpratap/Desktop/SubtitleAI
./DEPLOY_BACKEND.sh
```

## 🔧 Manual Deploy (Alternative):

```bash
# 1. Go to backend directory
cd subtitleai/backend

# 2. Login to Railway
railway login

# 3. Deploy
railway up

# 4. Get URL
railway status
```

## 📝 After Deploy:

1. **Copy Railway URL** (something like: https://xxx.railway.app)

2. **Update Vercel Environment**:
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Update: `NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app`
   - Redeploy

3. **Test**: Visit your Vercel site and try uploading video

## ✅ Expected Result:

- ✅ Backend deployed on Railway
- ✅ Frontend connects to Railway backend
- ✅ Video upload works
- ✅ Subtitle generation works

**Run the script and it'll handle everything automatically!** 🎯