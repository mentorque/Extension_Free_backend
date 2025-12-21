#!/bin/bash

# Restart NLP Service Script
# Kills existing NLP service and lets it restart with new code

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "=========================================="
echo "Restarting NLP Service"
echo "=========================================="
echo ""

# Kill any existing NLP service processes
echo "Killing existing NLP service processes..."
pkill -f "uvicorn.*main:app" 2>/dev/null || true
pkill -f "python.*main.py" 2>/dev/null || true

sleep 1

# Check if port 8001 is still in use
if command -v lsof &> /dev/null; then
    if lsof -Pi :8001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠${NC} Port 8001 is still in use. Force killing..."
        lsof -ti :8001 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
fi

echo -e "${GREEN}✓${NC} NLP service stopped"
echo ""
echo "The NLP service will automatically restart when you make the next request."
echo "Or restart your backend server to start it immediately."
echo ""


