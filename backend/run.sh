#!/bin/bash

# Backend Run Script
# This script runs the backend server

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "Starting Backend Server"
echo "=========================================="
echo ""

# Check if setup has been run
if [ ! -d "node_modules" ]; then
    print_error "node_modules not found. Please run setup.sh first:"
    echo "  ./setup.sh"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating with defaults..."
    cat > .env << EOF
PORT=3000
NLP_SERVICE_URL=http://127.0.0.1:8001
PYTHON_BIN=python3
EOF
    print_success ".env file created"
fi

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    print_success "Environment variables loaded"
fi

# Check if Python venv exists and activate it
VENV_PATH="../venv"
if [ ! -d "$VENV_PATH" ]; then
    VENV_PATH="venv"
fi

if [ -d "$VENV_PATH" ]; then
    if [ -f "$VENV_PATH/bin/activate" ]; then
        source "$VENV_PATH/bin/activate"
        print_success "Python virtual environment activated"
    elif [ -f "$VENV_PATH/Scripts/activate" ]; then
        source "$VENV_PATH/Scripts/activate"
        print_success "Python virtual environment activated (Windows)"
    fi
else
    print_warning "Virtual environment not found. NLP service may not work."
    print_warning "Run ./setup.sh to set up the environment."
fi

# Check if spaCy model is available
if python3 -c "import spacy; spacy.load('en_core_web_sm')" 2>/dev/null || python -c "import spacy; spacy.load('en_core_web_sm')" 2>/dev/null; then
    print_success "spaCy model is available"
else
    print_warning "spaCy model may not be installed. The NLP service will download it on first use."
fi

# Check if Sentence Transformers is available (for semantic skill classification)
# Try venv Python first, then fall back to system Python
PYTHON_BIN=""
if [ -d "$VENV_PATH" ] && [ -f "$VENV_PATH/bin/python" ]; then
    PYTHON_BIN="$VENV_PATH/bin/python"
elif [ -d "$VENV_PATH" ] && [ -f "$VENV_PATH/bin/python3" ]; then
    PYTHON_BIN="$VENV_PATH/bin/python3"
elif command -v python3 &> /dev/null; then
    PYTHON_BIN="python3"
elif command -v python &> /dev/null; then
    PYTHON_BIN="python"
fi

if [ -n "$PYTHON_BIN" ] && $PYTHON_BIN -c "import sentence_transformers" 2>/dev/null; then
    print_success "Sentence Transformers is installed (embeddings enabled)"
else
    print_warning "Sentence Transformers is NOT installed (embeddings disabled)"
    print_warning "For better skill filtering, install it:"
    echo "  ./install_embeddings.sh"
    echo "  Or manually: cd backend && venv/bin/pip install sentence-transformers torch"
    echo "  Then restart the server"
fi

echo ""
echo "=========================================="
echo "Server Information"
echo "=========================================="
echo ""
print_info "Backend will run on: http://localhost:${PORT:-3000}"
print_info "NLP Service will run on: ${NLP_SERVICE_URL:-http://127.0.0.1:8001}"
print_info "NLP service will start automatically when needed"
echo ""
print_info "Skill Extraction Features:"
if [ -n "$PYTHON_BIN" ] && $PYTHON_BIN -c "import sentence_transformers" 2>/dev/null; then
    echo "  ✓ Semantic filtering (embeddings) - ACTIVE"
else
    echo "  ✗ Semantic filtering (embeddings) - DISABLED"
fi
echo "  ✓ PhraseMatcher with 38k skills from skills.csv"
echo "  ✓ Weighted skill matching"
echo ""

# Check if port is already in use
if command -v lsof &> /dev/null; then
    if lsof -Pi :${PORT:-3000} -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port ${PORT:-3000} is already in use!"
        print_warning "Please stop the other service or change PORT in .env"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

echo "=========================================="
echo "Starting Server..."
echo "=========================================="
echo ""

# Determine which command to use
if [ -f "package.json" ]; then
    if grep -q '"dev"' package.json; then
        print_success "Starting in development mode (with auto-reload)..."
        npm run dev
    else
        print_success "Starting in production mode..."
        npm start
    fi
else
    print_error "package.json not found!"
    exit 1
fi






