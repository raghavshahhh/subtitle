#!/bin/bash

echo "🚀 SubtitleAI - Complete Setup & Start"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd /Users/raghavpratap/Desktop/SubtitleAI

# 1. Check Redis
echo -e "${BLUE}[1/6] Checking Redis...${NC}"
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is running${NC}"
else
    echo -e "${YELLOW}⚠️  Starting Redis...${NC}"
    redis-server --daemonize yes
    sleep 2
    if redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis started${NC}"
    else
        echo -e "${RED}❌ Failed to start Redis${NC}"
        exit 1
    fi
fi
echo ""

# 2. Stop existing processes
echo -e "${BLUE}[2/6] Stopping existing processes...${NC}"
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
pkill -f celery 2>/dev/null
echo -e "${GREEN}✅ Cleaned up${NC}"
echo ""

# 3. Setup Backend
echo -e "${BLUE}[3/6] Setting up Backend...${NC}"
cd subtitleai/backend

if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

# Create database if not exists
if [ ! -f "subtitleai.db" ]; then
    echo -e "${YELLOW}Creating database...${NC}"
    python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
fi

echo -e "${GREEN}✅ Backend setup complete${NC}"
echo ""

# 4. Start Backend
echo -e "${BLUE}[4/6] Starting Backend...${NC}"
uvicorn app.main:app --reload --port 8000 > ../../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../../.backend.pid
sleep 3

# Check if backend started
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend running on http://localhost:8000${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check backend.log${NC}"
    exit 1
fi
echo ""

# 5. Start Celery
echo -e "${BLUE}[5/6] Starting Celery Worker...${NC}"
celery -A celery_worker.celery_app worker --loglevel=info > ../../celery.log 2>&1 &
CELERY_PID=$!
echo $CELERY_PID > ../../.celery.pid
sleep 2
echo -e "${GREEN}✅ Celery worker started${NC}"
echo ""

# 6. Start Frontend
echo -e "${BLUE}[6/6] Starting Frontend...${NC}"
cd ../frontend
npm install --silent 2>/dev/null
npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../../.frontend.pid
sleep 5

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend running on http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend starting... (may take 10-15 seconds)${NC}"
fi
echo ""

# Final Status
cd ../..
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 SubtitleAI is READY!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 Frontend:${NC}  http://localhost:3000"
echo -e "${BLUE}🔧 Backend:${NC}   http://localhost:8000"
echo -e "${BLUE}📚 API Docs:${NC}  http://localhost:8000/api/docs"
echo ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo "   Backend:  tail -f backend.log"
echo "   Celery:   tail -f celery.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo -e "${YELLOW}🛑 To stop:${NC} ./STOP_APP.sh"
echo ""
echo -e "${GREEN}✨ Ready to upload videos!${NC}"
echo ""

# Open browser after 5 seconds
sleep 5
echo -e "${BLUE}Opening browser...${NC}"
open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null
