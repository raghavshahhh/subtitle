#!/bin/bash

echo "🧪 Testing SubtitleAI Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Test Python
echo -n "Testing Python... "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✅ Python $PYTHON_VERSION${NC}"
else
    echo -e "${RED}❌ Python not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Test Node
echo -n "Testing Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Test Redis
echo -n "Testing Redis... "
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✅ Redis running${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis installed but not running${NC}"
        echo "   Run: redis-server"
    fi
else
    echo -e "${RED}❌ Redis not found${NC}"
    echo "   Install: brew install redis (macOS) or apt-get install redis-server (Linux)"
    ERRORS=$((ERRORS + 1))
fi

# Test FFmpeg
echo -n "Testing FFmpeg... "
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1 | cut -d' ' -f3)
    echo -e "${GREEN}✅ FFmpeg $FFMPEG_VERSION${NC}"
else
    echo -e "${RED}❌ FFmpeg not found${NC}"
    echo "   Install: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
    ERRORS=$((ERRORS + 1))
fi

# Test Backend Dependencies
echo -n "Testing Backend Dependencies... "
if [ -d "subtitleai/backend/venv" ]; then
    echo -e "${GREEN}✅ Virtual environment exists${NC}"
else
    echo -e "${YELLOW}⚠️  Virtual environment not found${NC}"
    echo "   Run: cd subtitleai/backend && python3 -m venv venv"
fi

# Test Frontend Dependencies
echo -n "Testing Frontend Dependencies... "
if [ -d "subtitleai/frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Node modules installed${NC}"
else
    echo -e "${YELLOW}⚠️  Node modules not found${NC}"
    echo "   Run: cd subtitleai/frontend && npm install"
fi

# Test Backend .env
echo -n "Testing Backend .env... "
if [ -f "subtitleai/backend/.env" ]; then
    echo -e "${GREEN}✅ Backend .env exists${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env not found${NC}"
    echo "   Copy: cp subtitleai/backend/.env.example subtitleai/backend/.env"
fi

# Test Frontend .env
echo -n "Testing Frontend .env... "
if [ -f "subtitleai/frontend/.env.local" ]; then
    echo -e "${GREEN}✅ Frontend .env.local exists${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env.local not found${NC}"
    echo "   Copy: cp subtitleai/frontend/.env.example subtitleai/frontend/.env.local"
fi

# Test Database
echo -n "Testing Database... "
if [ -f "subtitleai/backend/subtitleai.db" ]; then
    echo -e "${GREEN}✅ Database exists${NC}"
else
    echo -e "${YELLOW}⚠️  Database not found (will be created on first run)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Ready to start.${NC}"
    echo ""
    echo "Run: ./START_APP.sh"
else
    echo -e "${RED}❌ $ERRORS error(s) found. Please fix them first.${NC}"
    exit 1
fi
