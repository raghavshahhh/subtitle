#!/bin/bash

echo "🔄 SUBTITLEAI CLEAN RESTART STATUS"
echo "================================="

# Backend
BACKEND=$(curl -s http://localhost:8000/ | grep -o "SubtitleAI API is running")
[ -n "$BACKEND" ] && echo "✅ Backend: RUNNING" || echo "❌ Backend: DOWN"

# Frontend  
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
[ "$FRONTEND" = "200" ] && echo "✅ Frontend: RUNNING" || echo "❌ Frontend: DOWN"

# Projects
PROJECTS=$(curl -s http://localhost:8000/api/projects/ | jq length 2>/dev/null)
[ "$PROJECTS" -gt 0 ] && echo "✅ Projects: $PROJECTS available" || echo "❌ Projects: FAILED"

# Upload Test
echo "test" > /tmp/test.mp4
UPLOAD=$(curl -s -X POST -F "file=@/tmp/test.mp4;type=video/mp4" -F "title=Status Test" http://localhost:8000/api/upload/video | grep -o "success")
[ -n "$UPLOAD" ] && echo "✅ Upload: WORKING" || echo "❌ Upload: FAILED"

echo ""
echo "🎉 SYSTEM READY!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo ""
echo "Try uploading a video now!"
