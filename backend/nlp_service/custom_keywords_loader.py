"""
Custom Keywords Loader
======================
Loads custom keywords from JSON and generates variations.
"""

import json
import logging
from pathlib import Path
from typing import List, Dict, Set

logger = logging.getLogger(__name__)


def generate_variations(base: str) -> List[str]:
    """
    Auto-generate variations of a keyword.
    
    Generates:
    - Case variations: RAG, rag, Rag
    - Punctuation variations: R.A.G., R-A-G, R_A_G (for short uppercase keywords)
    
    Args:
        base: Base keyword (e.g., "RAG")
        
    Returns:
        List of all variations
    """
    variations = set()
    
    # Add base form
    variations.add(base)
    
    # Case variations
    variations.add(base.lower())
    variations.add(base.upper())
    if len(base) > 1:
        variations.add(base.capitalize())
    
    # Punctuation variations (only for uppercase/short keywords)
    # This helps with acronyms like RAG, LLM, API, etc.
    if base.isupper() and len(base) <= 10 and len(base) > 1:
        # Dotted: R.A.G.
        dotted = '.'.join(base)
        variations.add(dotted)
        variations.add(dotted.lower())
        
        # Dashed: R-A-G
        dashed = '-'.join(base)
        variations.add(dashed)
        variations.add(dashed.lower())
        
        # Underscored: R_A_G
        underscored = '_'.join(base)
        variations.add(underscored)
        variations.add(underscored.lower())
    
    # For multi-word keywords, also try variations with different separators
    if ' ' in base:
        # Space-separated: "Fine Tuning"
        variations.add(base)
        variations.add(base.lower())
        variations.add(base.upper())
        
        # Hyphen-separated: "Fine-Tuning"
        hyphenated = base.replace(' ', '-')
        variations.add(hyphenated)
        variations.add(hyphenated.lower())
        variations.add(hyphenated.upper())
        
        # Underscore-separated: "Fine_Tuning"
        underscored_multi = base.replace(' ', '_')
        variations.add(underscored_multi)
        variations.add(underscored_multi.lower())
        variations.add(underscored_multi.upper())
    
    return sorted(list(variations))


def load_custom_keywords(json_path: str = None) -> List[Dict]:
    """
    Load custom keywords from JSON file.
    
    Args:
        json_path: Path to custom_keywords.json (default: same dir as this file)
        
    Returns:
        List of keyword objects with 'base', 'description', and 'variations'
    """
    if json_path is None:
        # Default to same directory as this file
        current_dir = Path(__file__).parent
        json_path = current_dir / "custom_keywords.json"
    
    json_path = Path(json_path)
    
    if not json_path.exists():
        logger.warning(f"Custom keywords file not found: {json_path}")
        return []
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        keywords = data.get('keywords', [])
        
        # Generate variations for each keyword
        for keyword in keywords:
            if 'variations' not in keyword or not keyword.get('variations'):
                keyword['variations'] = generate_variations(keyword['base'])
            else:
                # User provided variations, merge with auto-generated ones
                user_variations = set(keyword['variations'])
                auto_variations = set(generate_variations(keyword['base']))
                keyword['variations'] = sorted(list(user_variations | auto_variations))
        
        logger.info(f"Loaded {len(keywords)} custom keywords from {json_path}")
        return keywords
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in custom keywords file: {e}")
        return []
    except Exception as e:
        logger.error(f"Error loading custom keywords: {e}")
        return []


def get_custom_skills_list(keywords: List[Dict]) -> List[str]:
    """
    Get flat list of all skill variations from custom keywords.
    
    Args:
        keywords: List of keyword objects
        
    Returns:
        List of all variations (strings)
    """
    skills = []
    for keyword in keywords:
        skills.extend(keyword.get('variations', []))
    return skills


def get_custom_keywords_normalized_set(keywords: List[Dict], normalize_func) -> Set[str]:
    """
    Get set of normalized forms of all custom keyword variations.
    Used for duplicate checking and marking custom keywords.
    
    Args:
        keywords: List of keyword objects
        normalize_func: Function to normalize text (e.g., SkillsDatabase._normalize)
        
    Returns:
        Set of normalized strings
    """
    normalized_set = set()
    for keyword in keywords:
        for variation in keyword.get('variations', []):
            normalized = normalize_func(variation.lower())
            normalized_set.add(normalized)
    return normalized_set

