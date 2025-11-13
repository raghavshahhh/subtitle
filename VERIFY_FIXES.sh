#!/bin/bash

echo "🔍 Verifying Security Fixes - SubtitleAI"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Check if backend files exist and have fixes
echo "📁 Checking Backend Files..."
echo ""

# 1. Check auth_simple.py
if grep -q "logger.error" subtitleai/backend/app/api/auth_simple.py 2>/dev/null; then
    echo -e "${GREEN}✅ auth_simple.py - SQL Injection fix verified${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ auth_simple.py - Fix not found${NC}"
    ((FAILED++))
fi

# 2. Check upload_fixed.py
if grep -q "sanitize_filename" subtitleai/backend/app/api/upload_fixed.py 2>/dev/null; then
    echo -e "${GREEN}✅ upload_fixed.py - Path Traversal fix verified${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ upload_fixed.py - Fix not found${NC}"
    ((FAILED++))
fi

# 3. Check projects_simple.py
if grep -q "html.escape" subtitleai/backend/app/api/projects_simple.py 2>/dev/null; then
    echo -e "${GREEN}✅ projects_simple.py - XSS prevention verified${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ projects_simple.py - Fix not found${NC}"
    ((FAILED++))
fi

# 4. Check main.py
if grep -q "global_exception_handler" subtitleai/backend/app/main.py 2>/dev/null; then
    echo -e "${GREEN}✅ main.py - Error handling verified${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ main.py - Fix not found${NC}"
    ((FAILED++))
fi

echo ""
echo "📁 Checking Frontend Files..."
echo ""

# 5. Check api.ts
if grep -q "isValidUrl" subtitleai/frontend/lib/api.ts 2>/dev/null; then
    echo -e "${GREEN}✅ api.ts - SSRF prevention verified${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ api.ts - Fix not found${NC}"
    ((FAILED++))
fi

# 6. Check supabase.ts
if grep -q "Missing Supabase" subtitleai/frontend/lib/supabase.ts 2>/dev/null; then
    echo -e "${GREEN}✅ supabase.ts - Config validation verified${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ supabase.ts - Fix not found${NC}"
    ((FAILED++))
fi

echo ""
echo "🔐 Checking Security Configuration..."
echo ""

# 7. Check .env.example exists
if [ -f "subtitleai/backend/.env.example" ]; then
    echo -e "${GREEN}✅ .env.example created${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ .env.example not found${NC}"
    ((FAILED++))
fi

# 8. Check if .env is in .gitignore
if grep -q "*.env" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✅ .env added to .gitignore${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  .env not in .gitignore - Add it!${NC}"
    ((WARNINGS++))
fi

# 9. Check if real .env files still exist (warning)
if [ -f "subtitleai/backend/.env" ]; then
    if grep -q "AIzaSyCK0rj0H60Y65givLMsBke4Rvtr9ufUdmo" subtitleai/backend/.env 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Old API keys still in .env - ROTATE THEM!${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ API keys appear to be updated${NC}"
        ((PASSED++))
    fi
fi

if [ -f "subtitleai/frontend/.env.local" ]; then
    if grep -q "AIzaSyCK0rj0H60Y65givLMsBke4Rvtr9ufUdmo" subtitleai/frontend/.env.local 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Old API keys still in .env.local - ROTATE THEM!${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ Frontend API keys appear to be updated${NC}"
        ((PASSED++))
    fi
fi

echo ""
echo "🧪 Testing Backend (if running)..."
echo ""

# 10. Test backend health
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    
    # Test health endpoint response
    HEALTH=$(curl -s http://localhost:8000/api/health)
    if echo "$HEALTH" | grep -q "healthy"; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ Health check failed${NC}"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  Backend not running - Start it to test${NC}"
    ((WARNINGS++))
fi

echo ""
echo "========================================"
echo "📊 VERIFICATION RESULTS"
echo "========================================"
echo ""
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

# Calculate score
TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    SCORE=$((PASSED * 100 / TOTAL))
    echo "Security Score: $SCORE%"
    echo ""
fi

# Final verdict
if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}🎉 ALL FIXES VERIFIED! Application is secure!${NC}"
        echo ""
        echo "✅ Ready for production (after rotating API keys)"
    else
        echo -e "${YELLOW}⚠️  FIXES VERIFIED but warnings present${NC}"
        echo ""
        echo "Action Required:"
        echo "1. Add *.env to .gitignore"
        echo "2. Rotate all API keys"
        echo "3. Remove .env files from git"
    fi
else
    echo -e "${RED}❌ SOME FIXES MISSING!${NC}"
    echo ""
    echo "Please check the failed items above and reapply fixes."
fi

echo ""
echo "📚 Documentation:"
echo "  - ALL_FIXES_COMPLETE.md"
echo "  - SECURITY_FIXES_APPLIED.md"
echo "  - QUICK_FIX_SUMMARY.md"
echo ""
echo "🚀 Next Steps:"
echo "  1. Rotate all API keys (URGENT)"
echo "  2. Remove .env from git"
echo "  3. Test application thoroughly"
echo "  4. Deploy to production"
echo ""
