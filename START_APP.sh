#!/bin/bash

echo "🚀 Starting SubtitleAI Application..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Redis is running
echo -e "${BLUE}Checking Redis...${NC}"
if ! redis-cli ping > /dev/null 2>&1; then
    echo -e "${RED}❌ Redis is not running. Starting Redis...${NC}"
    redis-server --daemonize yes
    sleep 2
fi
echo -e "${GREEN}✅ Redis is running${NC}"
echo ""

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd subtitleai/backend
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install -q -r requirements.txt
uvicorn app.main:app --reload --port 8000 > ../../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started on http://localhost:8000 (PID: $BACKEND_PID)${NC}"
echo ""

# Start Celery Worker
echo -e "${BLUE}Starting Celery Worker...${NC}"
celery -A celery_worker.celery_app worker --loglevel=info > ../../celery.log 2>&1 &
CELERY_PID=$!
echo -e "${GREEN}✅ Celery worker started (PID: $CELERY_PID)${NC}"
echo ""

# Start Frontend
echo -e "${BLUE}Starting Frontend...${NC}"
cd ../frontend
npm install --silent
npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)${NC}"
echo ""

# Save PIDs
cd ../..
echo "$BACKEND_PID" > .backend.pid
echo "$CELERY_PID" > .celery.pid
echo "$FRONTEND_PID" > .frontend.pid

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 SubtitleAI is now running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "📱 Frontend:  ${BLUE}http://localhost:3000${NC}"
echo -e "🔧 Backend:   ${BLUE}http://localhost:8000${NC}"
echo -e "📚 API Docs:  ${BLUE}http://localhost:8000/api/docs${NC}"
echo ""
echo -e "📝 Logs:"
echo -e "   Backend:  tail -f backend.log"
echo -e "   Celery:   tail -f celery.log"
echo -e "   Frontend: tail -f frontend.log"
echo ""
echo -e "🛑 To stop: ./STOP_APP.sh"
echo ""
