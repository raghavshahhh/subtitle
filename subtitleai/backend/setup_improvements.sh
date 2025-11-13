#!/bin/bash

echo "🚀 Setting up SubtitleAI Backend v2.0 Improvements..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Python
echo "📦 Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.8+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python found${NC}"

# Check Redis
echo "📦 Checking Redis..."
if ! command -v redis-cli &> /dev/null; then
    echo -e "${YELLOW}⚠️  Redis not found. Installing...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install redis
    else
        echo -e "${RED}❌ Please install Redis manually${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Redis found${NC}"

# Check FFmpeg
echo "📦 Checking FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${YELLOW}⚠️  FFmpeg not found. Installing...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ffmpeg
    else
        echo -e "${RED}❌ Please install FFmpeg manually${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ FFmpeg found${NC}"

# Install Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Download Whisper model
echo ""
echo "🤖 Downloading Whisper model (this may take a few minutes)..."
python3 -c "import whisper; whisper.load_model('base')"
echo -e "${GREEN}✅ Whisper model downloaded${NC}"

# Check .env file
echo ""
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update .env with your credentials${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
alembic upgrade head
echo -e "${GREEN}✅ Migrations complete${NC}"

# Start Redis
echo ""
echo "🔴 Starting Redis..."
redis-server --daemonize yes
echo -e "${GREEN}✅ Redis started${NC}"

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo "Version: 2.0.0"
echo ""
echo "Next steps:"
echo "1. Update .env file with your credentials"
echo "2. Start backend: uvicorn app.main:app --reload"
echo "3. Start Celery: celery -A app.tasks.transcription_tasks worker --loglevel=info"
echo "4. Start Flower: celery -A app.tasks.transcription_tasks flower"
echo ""
echo "Useful URLs:"
echo "- API Docs: http://localhost:8000/api/docs"
echo "- Health Check: http://localhost:8000/health"
echo "- Flower Dashboard: http://localhost:5555"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
echo "Made by RagsPro"
