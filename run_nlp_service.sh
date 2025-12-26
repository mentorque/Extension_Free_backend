#!/bin/bash

# Run NLP Service (Python FastAPI)
# ==================================
# This script starts the NLP service directly on port 8001
# Useful for debugging or running the NLP service independently

echo "=========================================="
echo "Starting NLP Service (Python FastAPI)"
echo "=========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/backend/nlp_service"

# Check for venv in multiple locations (backend/venv is most common)
PYTHON_CMD="python3"
PIP_CMD="pip3"

# Try backend/venv first (most common location)
if [ -d "../../venv" ] && [ -f "../../venv/bin/python3" ]; then
    echo "✅ Found venv in backend directory, activating..."
    source ../../venv/bin/activate
    PYTHON_CMD="../../venv/bin/python3"
    PIP_CMD="../../venv/bin/pip3"
    echo "📍 Using Python: $PYTHON_CMD"
elif [ -d "../venv" ] && [ -f "../venv/bin/python3" ]; then
    echo "✅ Found venv in parent directory, activating..."
    source ../venv/bin/activate
    PYTHON_CMD="../venv/bin/python3"
    PIP_CMD="../venv/bin/pip3"
    echo "📍 Using Python: $PYTHON_CMD"
elif [ -d ".venv" ] && [ -f ".venv/bin/python3" ]; then
    echo "✅ Found .venv in nlp_service, activating..."
    source .venv/bin/activate
    PYTHON_CMD=".venv/bin/python3"
    PIP_CMD=".venv/bin/pip3"
    echo "📍 Using Python: $PYTHON_CMD"
elif [ -d ".venv" ] && [ -f ".venv/bin/python" ]; then
    echo "✅ Found .venv in nlp_service, activating..."
    source .venv/bin/activate
    PYTHON_CMD=".venv/bin/python"
    PIP_CMD=".venv/bin/pip"
    echo "📍 Using Python: $PYTHON_CMD"
else
    echo "⚠️  No venv found, using system Python"
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
    echo "📍 Using Python: $(which python3)"
fi

# Check if requirements are installed
echo ""
echo "Checking dependencies..."
$PYTHON_CMD -c "import fastapi, uvicorn, spacy" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Some dependencies missing. Installing requirements..."
    $PIP_CMD install -r requirements.txt
    echo ""
    echo "📦 Downloading spaCy model..."
    $PYTHON_CMD -m spacy download en_core_web_sm
fi

# Set environment variables
export PORT=${PORT:-8001}
export HOST=${HOST:-127.0.0.1}

echo ""
echo "📍 Working directory: $(pwd)"
echo "🌐 NLP Service will run on: http://${HOST}:${PORT}"
echo "📚 API Docs will be at: http://${HOST}:${PORT}/docs"
echo "🏥 Health check: http://${HOST}:${PORT}/health"
echo ""
echo "Starting NLP service..."
echo "=========================================="
echo ""

# Start the NLP service with uvicorn
# Try using uvicorn directly from venv if available, otherwise use python -m uvicorn
if [ -f "../../venv/bin/uvicorn" ]; then
    echo "Using uvicorn from backend/venv..."
    ../../venv/bin/uvicorn main:app --host "$HOST" --port "$PORT" --reload
elif [ -f "../venv/bin/uvicorn" ]; then
    echo "Using uvicorn from parent venv..."
    ../venv/bin/uvicorn main:app --host "$HOST" --port "$PORT" --reload
elif [ -f ".venv/bin/uvicorn" ]; then
    echo "Using uvicorn from .venv..."
    .venv/bin/uvicorn main:app --host "$HOST" --port "$PORT" --reload
else
    echo "Using python -m uvicorn..."
    $PYTHON_CMD -m uvicorn main:app --host "$HOST" --port "$PORT" --reload
fi

