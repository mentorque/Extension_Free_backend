#!/usr/bin/env python3
"""
Test script to debug custom keywords recognition
"""

import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from custom_keywords_loader import load_custom_keywords, generate_variations
from skills_matcher import get_skills_database

def test_custom_keywords():
    print("=" * 60)
    print("Testing Custom Keywords Recognition")
    print("=" * 60)
    
    # 1. Load custom keywords
    print("\n1. Loading custom keywords...")
    custom_keywords = load_custom_keywords()
    print(f"   Loaded {len(custom_keywords)} custom keyword definitions")
    
    # 2. Check specific keywords
    test_keywords = [
        "Sales",
        "Business Development",
        "Consultative Selling",
        "Cold Calling",
        "Solution Selling",
        "Account Management",
        "Lead Qualification",
        "CRM",
        "Salesforce",
        "Advanced Excel",
        "MS Office",
        "Google Colab",
        "Stakeholder Engagement",
        "Conflict Resolution",
        "Stakeholder Management",
        "Strategic Planning"
    ]
    
    print("\n2. Checking if test keywords exist in custom keywords...")
    found_keywords = []
    missing_keywords = []
    
    for test_kw in test_keywords:
        found = False
        for kw_obj in custom_keywords:
            base = kw_obj.get('base', '')
            variations = kw_obj.get('variations', [])
            
            if test_kw.lower() == base.lower() or test_kw.lower() in [v.lower() for v in variations]:
                found = True
                found_keywords.append(test_kw)
                print(f"   ✓ '{test_kw}' found (base: '{base}')")
                print(f"     Variations: {variations[:5]}...")  # Show first 5
                break
        
        if not found:
            missing_keywords.append(test_kw)
            print(f"   ✗ '{test_kw}' NOT FOUND in custom keywords")
    
    print(f"\n   Found: {len(found_keywords)}/{len(test_keywords)}")
    print(f"   Missing: {len(missing_keywords)}/{len(test_keywords)}")
    
    # 3. Load skills database
    print("\n3. Loading skills database...")
    skills_db = get_skills_database()
    skills_db.load()
    print(f"   Total skills loaded: {len(skills_db.skills)}")
    print(f"   Custom keywords normalized set: {len(skills_db.custom_keywords_normalized)}")
    
    # 4. Check if test keywords are in skills list
    print("\n4. Checking if test keywords are in skills list...")
    for test_kw in test_keywords:
        # Check exact match (case-insensitive)
        in_skills = any(test_kw.lower() == s.lower() for s in skills_db.skills)
        # Check normalized match
        normalized = skills_db._normalize(test_kw.lower())
        in_normalized = normalized in skills_db.custom_keywords_normalized
        
        status = "✓" if (in_skills or in_normalized) else "✗"
        print(f"   {status} '{test_kw}' - in_skills: {in_skills}, in_normalized: {in_normalized}")
    
    # 5. Test PhraseMatcher matching
    print("\n5. Testing PhraseMatcher matching...")
    test_text = "Sales, Business Development, Consultative Selling, Cold Calling, Solution Selling, Account Management, Lead Qualification, CRM, Salesforce, Advanced Excel, MS Office, Google Colab, Stakeholder Engagement, Conflict Resolution, Stakeholder Management, Strategic Planning"
    
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        
        from spacy.matcher import PhraseMatcher
        matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        
        # Add all skills as patterns
        patterns = [nlp.make_doc(skill) for skill in skills_db.skills]
        matcher.add("SKILLS", patterns)
        
        # Process text
        doc = nlp(test_text)
        matches = matcher(doc)
        
        print(f"   Found {len(matches)} matches")
        
        matched_texts = set()
        for match_id, start, end in matches:
            span = doc[start:end]
            matched_texts.add(span.text.strip())
        
        print(f"   Unique matched skills: {len(matched_texts)}")
        
        # Check which test keywords were matched
        print("\n   Matched keywords:")
        for test_kw in test_keywords:
            matched = any(test_kw.lower() == m.lower() for m in matched_texts)
            status = "✓" if matched else "✗"
            print(f"     {status} '{test_kw}'")
        
        # Show all matches
        print(f"\n   All matched skills ({len(matched_texts)}):")
        for m in sorted(matched_texts):
            print(f"     - {m}")
            
    except Exception as e:
        print(f"   Error testing PhraseMatcher: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_custom_keywords()




