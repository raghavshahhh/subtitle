#!/bin/bash

echo "🔍 Checking Backend Status..."
echo ""

# Check if backend is running
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend is running on port 8000"
    echo ""
    
    # Get backend info
    echo "📊 Backend Info:"
    curl -s http://localhost:8000/ | python3 -m json.tool
    echo ""
    
    # Check upload endpoint
    echo "🔧 Testing Upload Endpoint:"
    curl -s -X POST http://localhost:8000/api/upload/video 2>&1 | head -3
    echo ""
    
    # Check CORS
    echo "🌐 Testing CORS:"
    curl -s -X OPTIONS http://localhost:8000/api/upload/video \
      -H "Origin: http://localhost:3000" \
      -H "Access-Control-Request-Method: POST" \
      -i 2>&1 | grep -i "access-control"
    echo ""
    
    echo "✅ Backend is working properly!"
    echo ""
    echo "If you still get connection error in browser:"
    echo "1. Clear browser cache (Cmd+Shift+R)"
    echo "2. Check browser console for errors"
    echo "3. Make sure you're on http://localhost:3000 (not https)"
    
else
    echo "❌ Backend is NOT running!"
    echo ""
    echo "Start backend with:"
    echo "  cd subtitleai/backend"
    echo "  source venv/bin/activate"
    echo "  uvicorn app.main:app --reload --port 8000"
fi
