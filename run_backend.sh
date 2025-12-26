#!/bin/bash

# Run Node.js Backend Server
# ===========================
# This script starts the Node.js backend server on port 3000
# The backend will automatically start the NLP service if needed

echo "=========================================="
echo "Starting Node.js Backend Server"
echo "=========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    cd backend
    npm install
    cd ..
fi

# Set environment variables (optional - can be overridden)
export PORT=${PORT:-3000}
export NODE_ENV=${NODE_ENV:-development}

# Check if port is already in use
if command -v lsof >/dev/null 2>&1; then
    if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  WARNING: Port ${PORT} is already in use!"
        echo "   Trying to find what's using it..."
        lsof -Pi :${PORT} -sTCP:LISTEN
        echo ""
        echo "   Please stop the process using port ${PORT} or use a different port:"
        echo "   PORT=3001 ./run_backend.sh"
        echo ""
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Aborted."
            exit 1
        fi
    fi
fi

echo "📍 Working directory: $(pwd)"
echo "🌐 Backend will run on: http://localhost:${PORT}"
echo "🔧 NODE_ENV: ${NODE_ENV}"
echo ""
echo "Starting backend server..."
echo "=========================================="
echo ""

# Start the backend server
cd backend
node server.js

