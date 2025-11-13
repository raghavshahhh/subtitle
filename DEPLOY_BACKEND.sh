#!/bin/bash

echo "🚀 Deploying SubtitleAI Backend to Railway..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

echo -e "${BLUE}📦 Preparing backend for deployment...${NC}"
cd subtitleai/backend

# Create .env for Railway with demo values
cat > .env << EOF
# Demo environment for Railway deployment
DATABASE_URL=sqlite:///./subtitleai.db
REDIS_URL=redis://localhost:6379
SUPABASE_URL=https://demo.supabase.co
SUPABASE_KEY=demo-key
R2_ENDPOINT=https://demo.r2.cloudflarestorage.com
R2_ACCESS_KEY=demo-access-key
R2_SECRET_KEY=demo-secret-key
R2_BUCKET=subtitleai-demo
GEMINI_API_KEY=demo-gemini-key
RAZORPAY_KEY_ID=rzp_test_demo
RAZORPAY_KEY_SECRET=demo-secret
SECRET_KEY=demo-secret-key-for-jwt-tokens-minimum-32-characters
ALLOWED_ORIGINS=*
DEBUG=False
ENVIRONMENT=production
EOF

echo -e "${GREEN}✅ Environment configured${NC}"

# Initialize Railway project
echo -e "${BLUE}🚂 Initializing Railway project...${NC}"
railway login --browserless

echo -e "${BLUE}📤 Deploying to Railway...${NC}"
railway up --detach

echo -e "${GREEN}✅ Backend deployment initiated!${NC}"
echo ""
echo -e "${BLUE}🔗 Getting deployment URL...${NC}"
sleep 10
RAILWAY_URL=$(railway status --json | grep -o '"url":"[^"]*' | cut -d'"' -f4)

if [ -n "$RAILWAY_URL" ]; then
    echo -e "${GREEN}🎉 Backend deployed successfully!${NC}"
    echo -e "${GREEN}URL: $RAILWAY_URL${NC}"
    echo ""
    echo -e "${BLUE}📝 Next steps:${NC}"
    echo "1. Update Vercel environment variable:"
    echo "   NEXT_PUBLIC_API_URL=$RAILWAY_URL"
    echo ""
    echo "2. Test backend health:"
    echo "   curl $RAILWAY_URL/api/health"
else
    echo -e "${RED}❌ Could not get Railway URL. Check Railway dashboard.${NC}"
fi

cd ../..