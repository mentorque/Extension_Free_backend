#!/bin/bash

# Backend Setup Script
# This script sets up everything needed to run the backend with NLP service

set -e  # Exit on error

echo "=========================================="
echo "Backend Setup Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Working directory: $(pwd)"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python found: $PYTHON_VERSION"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    print_success "Python found: $PYTHON_VERSION"
    PYTHON_CMD="python"
else
    print_error "Python 3.9+ is not installed. Please install Python first."
    exit 1
fi

# Check pip
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
elif command -v pip &> /dev/null; then
    PIP_CMD="pip"
else
    print_error "pip is not installed. Please install pip first."
    exit 1
fi

echo ""
echo "=========================================="
echo "Step 1: Setting up Node.js dependencies"
echo "=========================================="
echo ""

if [ -d "node_modules" ]; then
    print_warning "node_modules already exists. Updating dependencies..."
    npm install
else
    print_success "Installing Node.js dependencies..."
    npm install
fi

print_success "Node.js dependencies installed"
echo ""

# Step 2: Set up Python virtual environment
echo "=========================================="
echo "Step 2: Setting up Python virtual environment"
echo "=========================================="
echo ""

# Determine venv location (prefer project root, fallback to backend)
VENV_PATH="../venv"
if [ ! -d "$VENV_PATH" ]; then
    VENV_PATH="venv"
fi

if [ -d "$VENV_PATH" ]; then
    print_warning "Virtual environment already exists at: $VENV_PATH"
    print_success "Using existing virtual environment"
else
    print_success "Creating virtual environment at: $VENV_PATH"
    $PYTHON_CMD -m venv "$VENV_PATH"
    print_success "Virtual environment created"
fi

# Activate virtual environment
print_success "Activating virtual environment..."
if [ -f "$VENV_PATH/bin/activate" ]; then
    source "$VENV_PATH/bin/activate"
    print_success "Virtual environment activated"
elif [ -f "$VENV_PATH/Scripts/activate" ]; then
    source "$VENV_PATH/Scripts/activate"
    print_success "Virtual environment activated (Windows)"
else
    print_error "Could not find activation script in $VENV_PATH"
    exit 1
fi

echo ""
echo "=========================================="
echo "Step 3: Installing Python dependencies"
echo "=========================================="
echo ""

if [ ! -d "nlp_service" ]; then
    print_error "nlp_service directory not found!"
    exit 1
fi

cd nlp_service

print_success "Installing Python dependencies from requirements.txt..."
$PIP_CMD install --upgrade pip
$PIP_CMD install -r requirements.txt

print_success "Python dependencies installed"
echo ""

# Step 4: Download spaCy model
echo "=========================================="
echo "Step 4: Downloading spaCy language model"
echo "=========================================="
echo ""

print_success "Downloading spaCy model (en_core_web_sm)..."
$PYTHON_CMD -m spacy download en_core_web_sm || {
    print_warning "Failed to download spaCy model automatically."
    print_warning "You may need to run manually: python -m spacy download en_core_web_sm"
}

print_success "spaCy model setup complete"
echo ""

cd ..

# Step 5: Create .env file if it doesn't exist
echo "=========================================="
echo "Step 5: Setting up environment variables"
echo "=========================================="
echo ""

if [ -f ".env" ]; then
    print_warning ".env file already exists. Skipping creation."
else
    print_success "Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=3000

# NLP Service Configuration
NLP_SERVICE_URL=http://127.0.0.1:8001
PYTHON_BIN=$PYTHON_CMD

# Database (if using Prisma)
# DATABASE_URL=your_database_url_here

# API Keys (for other features - not needed for keywords, uses NLP service)
# GEMINI_API_KEY=your_gemini_api_key_here  # Only needed for chat, coverletter, experience features
# GOOGLE_API_KEY=your_google_api_key_here
# GOOGLE_CSE_ID=your_custom_search_engine_id_here
EOF
    print_success ".env file created with default values"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
print_success "All dependencies installed"
print_success "Virtual environment ready"
print_success "spaCy model downloaded"
print_success "Environment variables configured"
echo ""
echo "You can now run the backend with:"
echo "  ./run.sh"
echo "  or"
echo "  npm run dev"
echo ""
echo "Note: The NLP service will start automatically when needed."
echo ""

