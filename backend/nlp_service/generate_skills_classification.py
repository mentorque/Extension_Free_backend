#!/usr/bin/env python3
"""
Generate Skills Classification CSV
==================================
Pre-classifies all skills from skills.csv into:
- Important Tech
- Less Important Tech  
- Non-Tech

Saves results to skills_classification.csv for fast lookups.
"""

import csv
import sys
import os
from pathlib import Path
from typing import Dict, Tuple, Optional
import time

# Add parent directory to path for imports
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Suppress GPU messages
os.environ['TOKENIZERS_PARALLELISM'] = 'false'
os.environ['CUDA_VISIBLE_DEVICES'] = ''

try:
    from skills_matcher import get_skills_database
    import torch
    from sentence_transformers import util
except ImportError as e:
    print(f"Error importing required modules: {e}")
    print("Make sure you're running this from the nlp_service directory with venv activated")
    sys.exit(1)


def classify_skill(
    skill: str,
    classifier,
    skills_db
) -> Tuple[str, float, bool]:
    """
    Classify a single skill into category with similarity score.
    
    Returns:
        (category, max_similarity, is_technical)
        category: 'important_tech', 'less_important_tech', or 'non_tech'
        max_similarity: highest similarity score (0.0 to 1.0)
        is_technical: True if technical (important or less important), False if non-tech
    """
    if not classifier or not classifier.available or not classifier.model:
        return ('non_tech', 0.0, False)
    
    try:
        normalized_skill = skills_db.normalize_skill_display(skill)
        
        # Generate embedding for the skill
        skill_embedding = classifier.model.encode(normalized_skill, convert_to_tensor=True)
        
        # Compare with all three categories
        similarities = {}
        
        if classifier.important_tech_embeddings is not None:
            important_sim = torch.max(util.cos_sim(skill_embedding, classifier.important_tech_embeddings)).item()
            similarities['important_tech'] = important_sim
        
        if classifier.less_important_tech_embeddings is not None:
            less_important_sim = torch.max(util.cos_sim(skill_embedding, classifier.less_important_tech_embeddings)).item()
            similarities['less_important_tech'] = less_important_sim
        
        if classifier.non_tech_embeddings is not None:
            non_tech_sim = torch.max(util.cos_sim(skill_embedding, classifier.non_tech_embeddings)).item()
            similarities['non_tech'] = non_tech_sim
        
        if not similarities:
            return ('non_tech', 0.0, False)
        
        # Get category with highest similarity
        best_category = max(similarities, key=similarities.get)
        max_sim = similarities[best_category]
        
        # Determine if technical
        is_technical = best_category in ['important_tech', 'less_important_tech']
        
        # If similarity is too low, default to non-tech
        if max_sim < 0.3:
            return ('non_tech', max_sim, False)
        
        return (best_category, max_sim, is_technical)
        
    except Exception as e:
        print(f"Error classifying skill '{skill}': {e}")
        return ('non_tech', 0.0, False)


def main():
    """Main function to generate classification CSV"""
    
    print("=" * 60)
    print("Skills Classification CSV Generator")
    print("=" * 60)
    print()
    
    # Get paths
    current_dir = Path(__file__).parent
    skills_csv_path = current_dir.parent / "src" / "utils" / "skills.csv"
    output_csv_path = current_dir.parent / "src" / "utils" / "skills_classification.csv"
    
    if not skills_csv_path.exists():
        print(f"Error: skills.csv not found at {skills_csv_path}")
        sys.exit(1)
    
    print(f"📂 Input:  {skills_csv_path}")
    print(f"📂 Output: {output_csv_path}")
    print()
    
    # Load skills database (this will initialize classifier)
    print("🔍 Loading skills database and initializing classifier...")
    print("   (This may take a minute on first run)")
    print()
    
    start_time = time.time()
    skills_db = get_skills_database()
    classifier = skills_db.classifier if hasattr(skills_db, 'classifier') else None
    
    if not classifier or not classifier.available:
        print("❌ Error: Sentence Transformers classifier not available")
        print("   Make sure sentence-transformers is installed:")
        print("   pip install sentence-transformers torch")
        sys.exit(1)
    
    init_time = time.time() - start_time
    print(f"✅ Classifier initialized in {init_time:.1f}s")
    print()
    
    # Read all skills from CSV
    print("📖 Reading skills from CSV...")
    skills = []
    with open(skills_csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            skill = row.get('Skill', '').strip()
            if skill:
                skills.append(skill)
    
    total_skills = len(skills)
    print(f"✅ Found {total_skills:,} skills")
    print()
    
    # Classify all skills
    print("🤖 Classifying skills...")
    print("   (This will take several minutes for ~40k skills)")
    print()
    
    results = []
    start_time = time.time()
    last_update_time = start_time
    
    for i, skill in enumerate(skills, 1):
        category, similarity, is_technical = classify_skill(skill, classifier, skills_db)
        
        results.append({
            'skill': skill,
            'category': category,
            'similarity_score': f"{similarity:.4f}",
            'is_technical': 'yes' if is_technical else 'no'
        })
        
        # Update progress on same line (every 100 skills or every 2 seconds)
        current_time = time.time()
        if i % 100 == 0 or (current_time - last_update_time) >= 2.0:
            elapsed = current_time - start_time
            rate = i / elapsed if elapsed > 0 else 0
            remaining = ((total_skills - i) / rate) if rate > 0 else 0
            percentage = (i * 100 / total_skills) if total_skills > 0 else 0
            
            # Use \r to overwrite the same line, flush to ensure it displays
            progress_msg = (
                f"   Progress: {i:,}/{total_skills:,} ({percentage:.1f}%) | "
                f"Speed: {rate:.0f} skills/sec | "
                f"ETA: {remaining/60:.1f} min"
            )
            print(f"\r{progress_msg}", end='', flush=True)
            last_update_time = current_time
    
    # Print newline after progress is complete
    print()
    
    total_time = time.time() - start_time
    print()
    print(f"✅ Classification complete in {total_time/60:.1f} minutes")
    print()
    
    # Count categories
    category_counts = {}
    for result in results:
        cat = result['category']
        category_counts[cat] = category_counts.get(cat, 0) + 1
    
    print("📊 Classification Summary:")
    print(f"   Important Tech:      {category_counts.get('important_tech', 0):,}")
    print(f"   Less Important Tech: {category_counts.get('less_important_tech', 0):,}")
    print(f"   Non-Tech:            {category_counts.get('non_tech', 0):,}")
    print()
    
    # Write results to CSV
    print("💾 Writing results to CSV...")
    with open(output_csv_path, 'w', encoding='utf-8', newline='') as f:
        fieldnames = ['skill', 'category', 'similarity_score', 'is_technical']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    print(f"✅ Saved to {output_csv_path}")
    print()
    print("=" * 60)
    print("Done! You can now use skills_classification.csv for fast lookups.")
    print("=" * 60)


if __name__ == '__main__':
    main()

