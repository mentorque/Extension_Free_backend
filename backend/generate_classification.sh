#!/bin/bash

# Script to generate skills classification CSV
# This pre-classifies all skills so embeddings don't need to be computed each time

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "Generate Skills Classification CSV"
echo "=========================================="
echo ""

# Check if venv exists
VENV_PATH="venv"
if [ ! -d "$VENV_PATH" ]; then
    echo -e "${YELLOW}⚠${NC} Virtual environment not found at: $VENV_PATH"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Activate venv
source "$VENV_PATH/bin/activate"

# Run the classification script
echo -e "${BLUE}ℹ${NC} Running classification script..."
echo "   This will classify all ~40k skills"
echo "   (This may take 10-20 minutes)"
echo ""

cd nlp_service
"$SCRIPT_DIR/$VENV_PATH/bin/python" generate_skills_classification.py

echo ""
echo -e "${GREEN}✓${NC} Classification complete!"
echo ""
echo "The classification CSV is saved at:"
echo "  backend/src/utils/skills_classification.csv"
echo ""

