#!/bin/bash

echo "🛑 Stopping SubtitleAI Application..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Stop Backend
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo -e "${GREEN}✅ Backend stopped${NC}"
    fi
    rm .backend.pid
fi

# Stop Celery
if [ -f .celery.pid ]; then
    CELERY_PID=$(cat .celery.pid)
    if kill -0 $CELERY_PID 2>/dev/null; then
        kill $CELERY_PID
        echo -e "${GREEN}✅ Celery worker stopped${NC}"
    fi
    rm .celery.pid
fi

# Stop Frontend
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✅ Frontend stopped${NC}"
    fi
    rm .frontend.pid
fi

echo ""
echo -e "${GREEN}✅ All services stopped${NC}"
