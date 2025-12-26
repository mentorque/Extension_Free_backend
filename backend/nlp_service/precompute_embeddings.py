#!/usr/bin/env python3
"""
Pre-compute embeddings on a powerful machine and save to cache.
This allows the server to load pre-computed embeddings instead of computing them.

Usage:
    python precompute_embeddings.py
"""

import sys
import os
from pathlib import Path

# Add parent directory to path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Suppress warnings
os.environ['TOKENIZERS_PARALLELISM'] = 'false'
os.environ['CUDA_VISIBLE_DEVICES'] = ''

import warnings
warnings.filterwarnings('ignore')

# Suppress logging from transformers
import logging
logging.getLogger('transformers').setLevel(logging.ERROR)
logging.getLogger('sentence_transformers').setLevel(logging.ERROR)
logging.getLogger('torch').setLevel(logging.ERROR)

def main():
    print("=" * 60)
    print("🤖 Pre-computing Embeddings for Railway Deployment")
    print("=" * 60)
    print()
    print("This script will:")
    print("  1. Load the Sentence Transformers model")
    print("  2. Compute embeddings for all 3 categories")
    print("  3. Save them to embeddings_cache/ directory")
    print("  4. These files will be committed to git")
    print("  5. Railway server will load them instead of computing")
    print()
    print("Starting...")
    print()
    
    try:
        # Import after setting up environment
        from skills_matcher import SkillClassifier
        
        # Initialize classifier (this will compute and cache embeddings)
        print("🔄 Initializing SkillClassifier...")
        classifier = SkillClassifier()
        
        if classifier.available:
            print()
            print("✅ SUCCESS!")
            print("✅ Embeddings have been computed and saved to cache")
            print()
            print("Next steps:")
            print("  1. Check that these files exist:")
            print("     - embeddings_cache/important_tech_embeddings.npy")
            print("     - embeddings_cache/less_important_tech_embeddings.npy")
            print("     - embeddings_cache/non_tech_embeddings.npy")
            print("     - embeddings_cache/embeddings_metadata.csv")
            print()
            print("  2. Commit these files to git:")
            print("     git add backend/nlp_service/embeddings_cache/*.npy")
            print("     git add backend/nlp_service/embeddings_cache/embeddings_metadata.csv")
            print("     git commit -m 'Add pre-computed embeddings'")
            print("     git push")
            print()
            print("  3. Railway will automatically use these cached embeddings!")
            print()
        else:
            print()
            print("❌ ERROR: Classifier is not available")
            print("   Make sure sentence-transformers and torch are installed:")
            print("   pip install sentence-transformers torch")
            sys.exit(1)
            
    except Exception as e:
        print()
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()








