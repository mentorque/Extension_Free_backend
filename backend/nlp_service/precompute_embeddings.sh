#!/bin/bash
# Pre-compute embeddings script for local machine
# This runs on your powerful laptop and saves embeddings to cache

cd "$(dirname "$0")"

echo "=========================================="
echo "Pre-computing Embeddings for Railway"
echo "=========================================="
echo ""

# Activate venv if it exists
if [ -d "../venv" ]; then
    echo "Activating venv..."
    source ../venv/bin/activate
elif [ -d "../../venv" ]; then
    echo "Activating venv..."
    source ../../venv/bin/activate
elif [ -d ".venv" ]; then
    echo "Activating .venv..."
    source .venv/bin/activate
fi

# Run the Python script
echo "Running precompute_embeddings.py..."
python3 precompute_embeddings.py

echo ""
echo "Done! Check embeddings_cache/ directory for .npy files"

