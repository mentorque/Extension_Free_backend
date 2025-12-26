# NLP Service Architecture

## Overview
FastAPI microservice (`backend/nlp_service/`) for keyword extraction and resume parsing using spaCy NLP.

---

## Endpoints

### 1. `/extract-skills` (POST)
**Purpose:** Extract keywords from job descriptions

**Flow:**
1. Receive text → Validate & clean
2. Load spaCy model (`en_core_web_sm`)
3. Load SkillsDatabase (38k skills from `skills.csv`)
4. **PhraseMatcher** → Find exact matches
5. **Semantic Classification** :
   - Sentence Transformers (`all-MiniLM-L6-v2`)
   - Pre-computed embeddings cache
   - Classify: important/less important/non-technical
6. Filter garbage terms
7. Collapse overlapping phrases
8. Assign weights
9. Return: `{skills: [], matches: [], stats: {}}`

**Components:**
- `skills_matcher.py` - PhraseMatcher logic
- `skills.csv` - 38k skills database
- `embeddings_cache/` - Pre-computed embeddings

---

### 2. `/extract` (POST)
**Purpose:** Extract keywords using pattern matching (legacy)

**Flow:**
1. Receive text
2. Load spaCy model
3. **4 Strategies:**
   - Pattern matching (tech terms: C++, Node.js, AWS)
   - Extract all nouns & proper nouns (lenient)
   - Multi-word noun phrases (2-6 tokens)
   - Named entity recognition
4. Return: `{keywords: [], count: N}`

**Components:**
- `main.py` - Keyword extraction logic
- Regex patterns for tech terms
- spaCy NLP pipeline

---

### 3. `/parse-resume` (POST)
**Purpose:** Parse PDF resume to structured JSON

**Flow:**
1. Receive PDF file
2. Extract text from PDF
3. Use spaCy + Gemini LLM
4. Extract structured data (skills, experience, education)
5. Return: `formatted_resume` (JSON)

---

## Core Components

### SkillsDatabase
- Loads 38k skills from `skills.csv`
- Creates PhraseMatcher patterns
- Handles skill normalization

### SkillClassifier (Sentence Transformers)
- Model: `all-MiniLM-L6-v2`
- Pre-computed embeddings cache
- Semantic validation of extracted skills
- Classification: important/less important/non-technical

### spaCy Pipeline
- Model: `en_core_web_sm`
- Tokenization, POS tagging, NER
- Noun phrase extraction

---

## Data Flow

```
Job Description Text
    ↓
Text Cleaning & Normalization
    ↓
spaCy Processing (tokenize, POS, NER)
    ↓
PhraseMatcher (38k skills)
    ↓
Semantic Classification (Sentence Transformers)
    ↓
Filter & Weight Skills
    ↓
Return Extracted Keywords
```

---

## Tech Stack
- **FastAPI** - Web framework
- **spaCy** - NLP processing
- **Sentence Transformers** - Semantic classification
- **PhraseMatcher** - Exact skill matching
- **PyTorch** - ML backend (for embeddings)
