#!/bin/bash

# Install Sentence Transformers for semantic skill classification
# This enables embedding-based filtering of non-technical skills

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "=========================================="
echo "Installing Sentence Transformers"
echo "=========================================="
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check for venv
VENV_PATH="venv"
if [ ! -d "$VENV_PATH" ]; then
    VENV_PATH="../venv"
fi

if [ -d "$VENV_PATH" ]; then
    echo -e "${GREEN}✓${NC} Found virtual environment: $VENV_PATH"
    if [ -f "$VENV_PATH/bin/activate" ]; then
        source "$VENV_PATH/bin/activate"
        echo -e "${GREEN}✓${NC} Activated virtual environment"
    elif [ -f "$VENV_PATH/Scripts/activate" ]; then
        source "$VENV_PATH/Scripts/activate"
        echo -e "${GREEN}✓${NC} Activated virtual environment (Windows)"
    fi
else
    echo -e "${YELLOW}⚠${NC} No virtual environment found. Installing globally..."
fi

echo ""
echo "Installing sentence-transformers and torch..."
echo "This may take a few minutes (will download ~200MB)..."
echo ""

# Install sentence-transformers
pip install sentence-transformers torch

echo ""
echo -e "${GREEN}✓${NC} Installation complete!"
echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo "1. Restart your backend server:"
echo "   ./run.sh"
echo ""
echo "2. The NLP service will automatically restart and use embeddings"
echo ""
echo "3. Check the logs for:"
echo "   ✅ [EMBEDDINGS] Sentence Transformers is INSTALLED"
echo "   ✅ [EMBEDDINGS] Classifier is ACTIVE"
echo ""


