#!/bin/bash

# Script to run NLP service and see embedding initialization logs
# This will show the three-section embedding computation:
# 1. Important Tech embeddings
# 2. Less Important Tech embeddings  
# 3. Non-Tech embeddings

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "Running Embeddings for 3-Section Classification"
echo "=========================================="
echo ""

# Check if venv exists
VENV_PATH="venv"
if [ ! -d "$VENV_PATH" ]; then
    echo -e "${RED}✗${NC} Virtual environment not found at: $VENV_PATH"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Check if port 8001 is in use
if command -v lsof &> /dev/null; then
    if lsof -Pi :8001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠${NC} Port 8001 is already in use!"
        echo "Killing existing process..."
        PID=$(lsof -ti:8001)
        if [ ! -z "$PID" ]; then
            kill -9 $PID 2>/dev/null || true
            sleep 1
            echo -e "${GREEN}✓${NC} Process killed"
        fi
    fi
fi

# Check if Sentence Transformers is installed
echo -e "${BLUE}ℹ${NC} Checking Sentence Transformers installation..."
if $VENV_PATH/bin/python -c "import sentence_transformers" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Sentence Transformers is installed"
else
    echo -e "${RED}✗${NC} Sentence Transformers is NOT installed"
    echo "Installing Sentence Transformers..."
    $VENV_PATH/bin/pip install sentence-transformers torch
    echo -e "${GREEN}✓${NC} Installation complete"
fi

echo ""
echo "=========================================="
echo "Starting NLP Service with Embeddings"
echo "=========================================="
echo -e "${BLUE}ℹ${NC} You will see embedding logs for:"
echo "  1. Important Tech embeddings (Section 1)"
echo "  2. Less Important Tech embeddings (Section 2)"
echo "  3. Non-Tech embeddings (Section 3)"
echo ""
echo -e "${YELLOW}Press CTRL+C to stop${NC}"
echo "=========================================="
echo ""

# Run from nlp_service directory (this ensures imports work correctly)
cd "$SCRIPT_DIR/nlp_service"

# Run uvicorn with main:app (since we're in nlp_service directory)
$SCRIPT_DIR/$VENV_PATH/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8001

