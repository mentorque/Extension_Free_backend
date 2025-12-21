"""
NLP Service for Keyword Extraction
===================================
A FastAPI service that extracts relevant keywords from job descriptions
using spaCy's natural language processing capabilities.

Features:
- Technology and tool detection (C++, Python, AWS, etc.)
- Skills and knowledge area extraction
- Named entity recognition
- Smart filtering of generic terms
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Set, Optional
import re
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="NLP Keyword Extraction Service",
    description="Extract relevant keywords from job descriptions using spaCy",
    version="2.0.0"
)

# Global spaCy model instance
nlp = None


# ============================================================================
# Pydantic Models
# ============================================================================

class ExtractRequest(BaseModel):
    """Request model for keyword extraction"""
    text: str = Field(..., description="Job description text to extract keywords from", min_length=1)


class ExtractResponse(BaseModel):
    """Response model containing extracted keywords"""
    keywords: List[str] = Field(default_factory=list, description="List of extracted keywords")
    count: int = Field(default=0, description="Total number of keywords extracted")


class HealthResponse(BaseModel):
    """Health check response"""
    model_config = {"protected_namespaces": ()}
    
    status: str
    spacy_model_loaded: bool
    model_name: Optional[str] = None


# ============================================================================
# SpaCy Model Management
# ============================================================================

def load_spacy_model():
    """
    Load the spaCy language model. Downloads if not present.
    
    Returns:
        spacy.Language: Loaded spaCy model
    """
    global nlp
    
    if nlp is not None:
        return nlp
    
    logger.info("Loading spaCy model...")
    
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        logger.info("Successfully loaded spaCy model: en_core_web_sm")
    except OSError:
        logger.warning("spaCy model not found. Downloading en_core_web_sm...")
        try:
            from spacy.cli import download
            download("en_core_web_sm")
            import spacy
            nlp = spacy.load("en_core_web_sm")
            logger.info("Successfully downloaded and loaded spaCy model")
        except Exception as e:
            logger.error(f"Failed to download spaCy model: {e}")
            raise
    
    return nlp


@app.on_event("startup")
async def startup_event():
    """Pre-load the spaCy model at startup to avoid delays on first request"""
    try:
        load_spacy_model()
        logger.info("NLP service startup complete")
    except Exception as e:
        logger.error(f"Warning: Failed to pre-load spaCy model during startup: {e}")


# ============================================================================
# Stop Words and Filters
# ============================================================================

# Generic business terms and common words that should not be keywords
GENERIC_STOPWORDS: Set[str] = {
    # Job description boilerplate
    "responsibilities", "responsibility", "requirement", "requirements",
    "qualification", "qualifications", "candidate", "candidates",
    "position", "opportunity", "role", "roles", "job", "jobs",
    
    # Time and measurement
    "year", "years", "month", "months", "day", "days", "week", "weeks",
    
    # Generic business terms (removed some that could be meaningful in context)
    "team", "teams", "work", "working", "environment",
    "experience", "experiences", "skill", "skills",
    "ability", "abilities", "company", "organization", "culture",
    "background", "degree", "education",
    
    # Adjectives/qualifiers
    "strong", "proven", "excellent", "good", "great",
    "preferred", "required", "plus", "bonus", "nice",
    "fast-paced", "dynamic", "collaborative",
    
    # Pronouns and articles
    "we", "our", "us", "you", "your", "they", "them", "their",
    "he", "she", "his", "hers", "it", "its",
    "the", "a", "an", "this", "that", "these", "those",
    
    # Verbs (common action words)
    "include", "includes", "including", "provide", "provides",
    "ensure", "ensures", "ensuring", "support", "supports",
    "manage", "manages", "managing", "develop", "develops",
    "create", "creates", "creating", "build", "builds",
    "work", "works", "working",
    
    # Other generic terms
    "responsible", "looking", "seeking", "offering",
    "etc", "e.g.", "i.e.", "and", "or", "but",
    
    # Too generic single words that add no value
    "thing", "things", "way", "ways", "time", "times",
    "place", "places", "person", "people", "area", "areas",
    
    # Location and place-related terms (not skills)
    "centre", "center", "office", "location", "site", "facility",
    "building", "campus", "headquarters", "region", "city", "country",
    
    # Generic industry/domain words (not specific skills)
    "flight", "training", "simulation", "aviation", "avionics",
    "core", "web", "software", "application", "solution",
    "service", "services", "platform", "system", "systems",
    
    # Generic descriptors
    "basic", "advanced", "intermediate", "junior", "senior",
    "lead", "principal", "staff", "associate", "entry-level",
}


# ============================================================================
# Technology and Tool Detection
# ============================================================================

# Regex patterns for specific technologies that need special handling
TECH_PATTERNS: List[re.Pattern] = [
    # Programming languages with special characters
    re.compile(r"\bc\+\+\b", re.IGNORECASE),
    re.compile(r"\bc#\b", re.IGNORECASE),
    re.compile(r"\b\.net(?:\s+(?:core|framework))?\b", re.IGNORECASE),
    re.compile(r"\bf#\b", re.IGNORECASE),
    
    # Common programming languages (explicit patterns)
    re.compile(r"\bpython\b", re.IGNORECASE),
    re.compile(r"\bjava\b(?!script)", re.IGNORECASE),  # Java but not JavaScript
    re.compile(r"\bjavascript\b", re.IGNORECASE),
    re.compile(r"\btypescript\b", re.IGNORECASE),
    re.compile(r"\bruby\b", re.IGNORECASE),
    re.compile(r"\bphp\b", re.IGNORECASE),
    re.compile(r"\bgo\b(?=.*(?:lang|programming))", re.IGNORECASE),
    re.compile(r"\bgolang\b", re.IGNORECASE),
    re.compile(r"\brust\b(?=.*(?:lang|programming))", re.IGNORECASE),
    re.compile(r"\bkotlin\b", re.IGNORECASE),
    re.compile(r"\bswift\b(?=.*(?:programming|ios))", re.IGNORECASE),
    re.compile(r"\bscala\b", re.IGNORECASE),
    
    # JavaScript frameworks and runtime
    re.compile(r"\bnode\.?js\b", re.IGNORECASE),
    re.compile(r"\bnext\.?js\b", re.IGNORECASE),
    re.compile(r"\breact(?:\.js)?\b", re.IGNORECASE),
    re.compile(r"\bvue(?:\.js)?\b", re.IGNORECASE),
    re.compile(r"\bangular(?:\.js)?\b", re.IGNORECASE),
    
    # BI and Analytics tools
    re.compile(r"\bpower\s*bi\b", re.IGNORECASE),
    re.compile(r"\bpower\s*pivot\b", re.IGNORECASE),
    re.compile(r"\bpower\s*query\b", re.IGNORECASE),
    re.compile(r"\btableau\b", re.IGNORECASE),
    re.compile(r"\blooker\b", re.IGNORECASE),
    re.compile(r"\bqlik(?:view|sense)?\b", re.IGNORECASE),
    re.compile(r"\bdata\s+analytics?\b", re.IGNORECASE),
    re.compile(r"\bbusiness\s+analytics?\b", re.IGNORECASE),
    re.compile(r"\bpredictive\s+analytics?\b", re.IGNORECASE),
    re.compile(r"\bdata\s+visualization\b", re.IGNORECASE),
    re.compile(r"\bdashboards?\b", re.IGNORECASE),
    re.compile(r"\bkpis?\b", re.IGNORECASE),
    re.compile(r"\breturn\s+on\s+investment\b", re.IGNORECASE),
    re.compile(r"\broi\b", re.IGNORECASE),
    
    # Databases
    re.compile(r"\bsql\b", re.IGNORECASE),
    re.compile(r"\bt-sql\b", re.IGNORECASE),
    re.compile(r"\bpl/sql\b", re.IGNORECASE),
    re.compile(r"\bmysql\b", re.IGNORECASE),
    re.compile(r"\bpostgresql\b", re.IGNORECASE),
    re.compile(r"\bpostgres\b", re.IGNORECASE),
    re.compile(r"\bmongodb\b", re.IGNORECASE),
    re.compile(r"\boracle\s*(?:db)?\b", re.IGNORECASE),
    re.compile(r"\bms\s*sql\s*server\b", re.IGNORECASE),
    re.compile(r"\bsql\s*server\b", re.IGNORECASE),
    
    # Cloud platforms
    re.compile(r"\baws\b", re.IGNORECASE),
    re.compile(r"\bamazon\s*web\s*services\b", re.IGNORECASE),
    re.compile(r"\bec2\b", re.IGNORECASE),
    re.compile(r"\bs3\b", re.IGNORECASE),
    re.compile(r"\blambda\b(?=.*(?:aws|cloud))", re.IGNORECASE),
    re.compile(r"\bazure\b", re.IGNORECASE),
    re.compile(r"\bgcp\b", re.IGNORECASE),
    re.compile(r"\bgoogle\s*cloud\b", re.IGNORECASE),
    
    # Salesforce ecosystem
    re.compile(r"\bsalesforce\b", re.IGNORECASE),
    re.compile(r"\bsalesforce\s+service\s+cloud\b", re.IGNORECASE),
    re.compile(r"\bsalesforce\s+sales\s+cloud\b", re.IGNORECASE),
    re.compile(r"\bsalesforce\s+experience\s+cloud\b", re.IGNORECASE),
    re.compile(r"\bsalesforce\s+marketing\s+cloud\b", re.IGNORECASE),
    re.compile(r"\bservice\s+cloud\b", re.IGNORECASE),
    re.compile(r"\bexperience\s+cloud\b", re.IGNORECASE),
    re.compile(r"\bsalesforce\s+knowledge\b", re.IGNORECASE),
    re.compile(r"\bapex\b(?=.*salesforce)", re.IGNORECASE),
    re.compile(r"\blightning\s+(?:web\s+)?components?\b", re.IGNORECASE),
    re.compile(r"\bvisualforce\b", re.IGNORECASE),
    
    # Big Data and Data Engineering
    re.compile(r"\bsnowflake\b", re.IGNORECASE),
    re.compile(r"\bredshift\b", re.IGNORECASE),
    re.compile(r"\bbigquery\b", re.IGNORECASE),
    re.compile(r"\bdatabricks\b", re.IGNORECASE),
    re.compile(r"\bapache\s*spark\b", re.IGNORECASE),
    re.compile(r"\bhadoop\b", re.IGNORECASE),
    re.compile(r"\bkafka\b", re.IGNORECASE),
    
    # DevOps and Tools
    re.compile(r"\bairflow\b", re.IGNORECASE),
    re.compile(r"\bdocker\b", re.IGNORECASE),
    re.compile(r"\bkubernetes\b", re.IGNORECASE),
    re.compile(r"\bk8s\b", re.IGNORECASE),
    re.compile(r"\bgit\b", re.IGNORECASE),
    re.compile(r"\bgithub\b", re.IGNORECASE),
    re.compile(r"\bgitlab\b", re.IGNORECASE),
    re.compile(r"\bjira\b", re.IGNORECASE),
    re.compile(r"\bconfluence\b", re.IGNORECASE),
    re.compile(r"\bjenkins\b", re.IGNORECASE),
    re.compile(r"\bterraform\b", re.IGNORECASE),
    
    # Data Science and ML
    re.compile(r"\bpandas\b", re.IGNORECASE),
    re.compile(r"\bnumpy\b", re.IGNORECASE),
    re.compile(r"\bscikit-?learn\b", re.IGNORECASE),
    re.compile(r"\btensorflow\b", re.IGNORECASE),
    re.compile(r"\bpytorch\b", re.IGNORECASE),
    re.compile(r"\bkeras\b", re.IGNORECASE),
    re.compile(r"\bmatlab\b", re.IGNORECASE),
    re.compile(r"\bsas\b", re.IGNORECASE),
    re.compile(r"\bspss\b", re.IGNORECASE),
    re.compile(r"\br\s+(?:programming|language)\b", re.IGNORECASE),
    
    # Web Frameworks
    re.compile(r"\bdjango\b", re.IGNORECASE),
    re.compile(r"\bflask\b", re.IGNORECASE),
    re.compile(r"\bfastapi\b", re.IGNORECASE),
    re.compile(r"\bspring\s*boot\b", re.IGNORECASE),
    re.compile(r"\bexpress\.?js\b", re.IGNORECASE),
    
    # Office and productivity
    re.compile(r"\bexcel\b", re.IGNORECASE),
    re.compile(r"\bvba\b", re.IGNORECASE),
    re.compile(r"\bpowerpoint\b", re.IGNORECASE),
    
    # Business and Management Skills
    re.compile(r"\bbusiness\s+analysis\b", re.IGNORECASE),
    re.compile(r"\bdata\s+analysis\b", re.IGNORECASE),
    re.compile(r"\bproject\s+management\b", re.IGNORECASE),
    re.compile(r"\bproduct\s+management\b", re.IGNORECASE),
    re.compile(r"\bstakeholder\s+management\b", re.IGNORECASE),
    re.compile(r"\bchange\s+management\b", re.IGNORECASE),
    re.compile(r"\brisk\s+management\b", re.IGNORECASE),
    re.compile(r"\bprocess\s+improvement\b", re.IGNORECASE),
    re.compile(r"\bagile\b", re.IGNORECASE),
    re.compile(r"\bscrum\b", re.IGNORECASE),
    re.compile(r"\bkanban\b", re.IGNORECASE),
    re.compile(r"\bwaterfall\b(?=.*(methodology|project))", re.IGNORECASE),
    
    # AI and ML Skills
    re.compile(r"\bartificial\s+intelligence\b", re.IGNORECASE),
    re.compile(r"\bmachine\s+learning\b", re.IGNORECASE),
    re.compile(r"\bdeep\s+learning\b", re.IGNORECASE),
    re.compile(r"\bnatural\s+language\s+processing\b", re.IGNORECASE),
    re.compile(r"\bnlp\b", re.IGNORECASE),
    re.compile(r"\bcomputer\s+vision\b", re.IGNORECASE),
    re.compile(r"\bgenerative\s+ai\b", re.IGNORECASE),
    re.compile(r"\bprompt\s+engineering\b", re.IGNORECASE),
    re.compile(r"\bai/ml\b", re.IGNORECASE),
    re.compile(r"\bllm\b", re.IGNORECASE),
    re.compile(r"\blarge\s+language\s+models?\b", re.IGNORECASE),
    
    # Communication and Soft Skills
    re.compile(r"\btechnical\s+writing\b", re.IGNORECASE),
    re.compile(r"\bpublic\s+speaking\b", re.IGNORECASE),
    re.compile(r"\bcross-functional\s+(?:collaboration|teams)\b", re.IGNORECASE),
    
    # Certifications and Standards
    re.compile(r"\bpmp\b", re.IGNORECASE),
    re.compile(r"\bcsm\b", re.IGNORECASE),
    re.compile(r"\bsix\s+sigma\b", re.IGNORECASE),
    re.compile(r"\bitil\b", re.IGNORECASE),
    
    # Banking and Financial Services
    re.compile(r"\bcash\s+(?:collection|collections)\b", re.IGNORECASE),
    re.compile(r"\bcheque\s+(?:collection|collections)\b", re.IGNORECASE),
    re.compile(r"\belectronic\s+(?:collection|collections)\b", re.IGNORECASE),
    re.compile(r"\bsupply\s+chain\s+finance\b", re.IGNORECASE),
    re.compile(r"\btrade\s+finance\b", re.IGNORECASE),
    re.compile(r"\bliquidity\s+management\b", re.IGNORECASE),
    re.compile(r"\bcash\s+management\b", re.IGNORECASE),
    re.compile(r"\btreasury\s+management\b", re.IGNORECASE),
    re.compile(r"\btreasury\s+operations?\b", re.IGNORECASE),
    re.compile(r"\bchannel\s+banking\b", re.IGNORECASE),
    re.compile(r"\bcore\s+banking\b", re.IGNORECASE),
    re.compile(r"\binternet\s+banking\b", re.IGNORECASE),
    re.compile(r"\bmobile\s+banking\b", re.IGNORECASE),
    re.compile(r"\bonline\s+banking\b", re.IGNORECASE),
    re.compile(r"\bpayment\s+processing\b", re.IGNORECASE),
    re.compile(r"\bpayment\s+gateway\b", re.IGNORECASE),
    re.compile(r"\bhost-to-host\b", re.IGNORECASE),
    re.compile(r"\bhost\s+to\s+host\b", re.IGNORECASE),
    re.compile(r"\bsweeps?\b", re.IGNORECASE),
    re.compile(r"\bpooling\b", re.IGNORECASE),
    re.compile(r"\bswift\b", re.IGNORECASE),
    re.compile(r"\biso\s*20022\b", re.IGNORECASE),
    re.compile(r"\biso20022\b", re.IGNORECASE),
    re.compile(r"\brdbms\b", re.IGNORECASE),
    re.compile(r"\brelational\s+database\b", re.IGNORECASE),
    re.compile(r"\bfraud\s+detection\b", re.IGNORECASE),
    re.compile(r"\baml\b(?=.*(?:anti|money|laundering))", re.IGNORECASE),
    re.compile(r"\bkyc\b(?=.*(?:know|customer))", re.IGNORECASE),
    re.compile(r"\banti[- ]money[- ]laundering\b", re.IGNORECASE),
    re.compile(r"\bknow\s+your\s+customer\b", re.IGNORECASE),
    re.compile(r"\bsepa\b", re.IGNORECASE),
    re.compile(r"\bach\b(?=.*(?:payment|transfer|clearing))", re.IGNORECASE),
    re.compile(r"\bwire\s+transfer\b", re.IGNORECASE),
    re.compile(r"\breal[- ]time\s+payments?\b", re.IGNORECASE),
    re.compile(r"\binstant\s+payments?\b", re.IGNORECASE),
    
    # Business Analysis and Requirements
    re.compile(r"\bfunctional\s+(?:specification|requirements?)\b", re.IGNORECASE),
    re.compile(r"\bfsd\b(?=.*(?:functional|specification|document))", re.IGNORECASE),
    re.compile(r"\bfrd\b(?=.*(?:functional|requirement|document))", re.IGNORECASE),
    re.compile(r"\buser\s+stor(?:y|ies)\b", re.IGNORECASE),
    re.compile(r"\brequirement(?:s)?\s+traceability\b", re.IGNORECASE),
    re.compile(r"\brequirement(?:s)?\s+gathering\b", re.IGNORECASE),
    re.compile(r"\brequirement(?:s)?\s+elicitation\b", re.IGNORECASE),
    re.compile(r"\belicitation\b", re.IGNORECASE),
    re.compile(r"\broot[- ]cause\s+analysis\b", re.IGNORECASE),
    re.compile(r"\brca\b(?=.*(?:root|cause))", re.IGNORECASE),
    re.compile(r"\bdefect\s+management\b", re.IGNORECASE),
    re.compile(r"\bbug\s+tracking\b", re.IGNORECASE),
    re.compile(r"\bfunctional\s+(?:design|solution)\b", re.IGNORECASE),
    re.compile(r"\bsolution\s+design\b", re.IGNORECASE),
    re.compile(r"\bworkflow\s+design\b", re.IGNORECASE),
    re.compile(r"\bprocess\s+(?:mapping|modeling|modelling)\b", re.IGNORECASE),
    re.compile(r"\bflowchart(?:s|ing)?\b", re.IGNORECASE),
    re.compile(r"\buml\s+diagram(?:s)?\b", re.IGNORECASE),
    re.compile(r"\buml\b", re.IGNORECASE),
    re.compile(r"\buse\s+case(?:s)?\b", re.IGNORECASE),
    re.compile(r"\bsequence\s+diagram(?:s)?\b", re.IGNORECASE),
    re.compile(r"\bactivity\s+diagram(?:s)?\b", re.IGNORECASE),
    re.compile(r"\bclass\s+diagram(?:s)?\b", re.IGNORECASE),
    re.compile(r"\bbusiness\s+process\s+(?:modeling|modelling)\b", re.IGNORECASE),
    re.compile(r"\bbpmn\b", re.IGNORECASE),
    re.compile(r"\bstakeholder\s+(?:management|engagement)\b", re.IGNORECASE),
    re.compile(r"\bgap\s+analysis\b", re.IGNORECASE),
    re.compile(r"\bas[- ]is\b", re.IGNORECASE),
    re.compile(r"\bto[- ]be\b", re.IGNORECASE),
    re.compile(r"\bfit[- ]gap\s+analysis\b", re.IGNORECASE),
    
    # Enterprise and Integration
    re.compile(r"\benterprise\s+resource\s+planning\b", re.IGNORECASE),
    re.compile(r"\berp\b", re.IGNORECASE),
    re.compile(r"\bcrm\b", re.IGNORECASE),
    re.compile(r"\bcustomer\s+relationship\s+management\b", re.IGNORECASE),
    re.compile(r"\bsoap\b(?=.*(?:api|web|service))", re.IGNORECASE),
    re.compile(r"\bwsdl\b", re.IGNORECASE),
    re.compile(r"\betl\b", re.IGNORECASE),
    re.compile(r"\bextract[,\s]+transform[,\s]+load\b", re.IGNORECASE),
    re.compile(r"\bdata\s+integration\b", re.IGNORECASE),
    re.compile(r"\bsystem\s+integration\b", re.IGNORECASE),
    re.compile(r"\bapplication\s+integration\b", re.IGNORECASE),
    re.compile(r"\bmiddleware\b", re.IGNORECASE),
    re.compile(r"\besb\b(?=.*(?:enterprise|service|bus))", re.IGNORECASE),
    re.compile(r"\benterprise\s+service\s+bus\b", re.IGNORECASE),
    re.compile(r"\bmicroservices?\b", re.IGNORECASE),
    
    # Testing and Quality
    re.compile(r"\buat\b(?=.*(?:user|acceptance|testing))", re.IGNORECASE),
    re.compile(r"\buser\s+acceptance\s+testing\b", re.IGNORECASE),
    re.compile(r"\bsit\b(?=.*(?:system|integration|testing))", re.IGNORECASE),
    re.compile(r"\bsystem\s+integration\s+testing\b", re.IGNORECASE),
    re.compile(r"\bregression\s+testing\b", re.IGNORECASE),
    re.compile(r"\btest\s+case(?:s)?\b", re.IGNORECASE),
    re.compile(r"\btest\s+plan(?:s)?\b", re.IGNORECASE),
    re.compile(r"\btest\s+strategy\b", re.IGNORECASE),
    re.compile(r"\bquality\s+assurance\b", re.IGNORECASE),
    re.compile(r"\bqa\b(?=.*(?:quality|assurance|testing))", re.IGNORECASE),
]


# Noun heads that indicate skill/knowledge areas in multi-word phrases
SKILL_HEAD_WORDS: Set[str] = {
    "analysis", "analytics", "modeling", "modelling", "analyst",
    "management", "manager", "engineering", "engineer", "forecasting", "budgeting",
    "visualization", "governance", "accounting", "optimization",
    "segmentation", "operations", "architecture", "architect", "research", "researcher",
    "planning", "design", "designer", "development", "developer", "reporting",
    "testing", "tester", "deployment", "implementation", "integration",
    "administration", "administrator", "leadership", "leader", "strategy", "communication",
    "collaboration", "documentation", "maintenance", "troubleshooting",
    "intelligence", "learning", "processing", "vision", "science", "scientist",
    "programming", "programmer", "framework", "library", "platform", "tool", "tools",
    "system", "systems", "database", "server", "cloud", "infrastructure",
    "automation", "orchestration", "monitoring", "performance", "security",
    "certification", "training", "knowledge", "understanding",
    
    # Banking and Finance specific
    "finance", "banking", "payment", "payments", "collection", "collections",
    "treasury", "liquidity", "settlement", "clearing", "reconciliation",
    "transaction", "transactions", "transfer", "transfers", "gateway",
    
    # Requirements and Documentation
    "requirements", "requirement", "specification", "specifications",
    "traceability", "elicitation", "gathering", "documentation",
    "diagram", "diagrams", "flowchart", "flowcharts", "stories",
    
    # General Business
    "stakeholder", "stakeholders", "interaction", "engagement",
    "assurance", "quality", "defect", "defects", "tracking",
}


# ============================================================================
# Keyword Extraction Logic
# ============================================================================

def normalize_keyword(text: str) -> str:
    """
    Normalize a keyword by cleaning and standardizing the text.
    
    Args:
        text: Raw keyword text
        
    Returns:
        Normalized keyword string
    """
    # Strip whitespace and convert to lowercase
    cleaned = text.strip().lower()
    
    # Remove surrounding punctuation
    cleaned = cleaned.strip(".,;:()[]{}""'`""'!?")
    
    # Collapse multiple spaces
    cleaned = re.sub(r"\s+", " ", cleaned)
    
    return cleaned


def is_generic_word(word: str, spacy_stopwords: Set[str]) -> bool:
    """
    Check if a word is too generic to be a useful keyword.
    
    Args:
        word: Word to check
        spacy_stopwords: Set of spaCy stopwords
        
    Returns:
        True if the word is generic and should be filtered out
    """
    w = word.lower()
    
    # Check custom stopwords
    if w in GENERIC_STOPWORDS:
        return True
    
    # Check spaCy stopwords
    if w in spacy_stopwords:
        return True
    
    # Allow known tech abbreviations
    if w in {"c#", "c++", ".net", "go", "r", "sql", "aws", "gcp", "ec2", "s3"}:
        return False
    
    # Filter very short tokens
    if len(w) <= 2:
        return True
    
    # Filter tokens that are mostly punctuation
    if not re.search(r"[a-z0-9]", w):
        return True
    
    return False


def extract_keywords_from_text(text: str) -> List[str]:
    """
    Extract relevant keywords from job description text using spaCy NLP.
    
    This function uses multiple strategies:
    1. Technology pattern matching (e.g., C++, Node.js, AWS) - HIGHEST PRIORITY
    2. Single-token nouns and proper nouns
    3. Multi-word noun phrases (skills and knowledge areas)
    4. Named entities (organizations, products, technologies)
    
    Args:
        text: Job description text
        
    Returns:
        List of extracted keywords, sorted by frequency and priority
    """
    nlp_model = load_spacy_model()
    doc = nlp_model(text)
    
    spacy_stopwords = set(nlp_model.Defaults.stop_words)
    
    # Frequency counter for keywords
    keyword_freq: Dict[str, int] = {}
    
    # Track pattern-matched keywords (these get priority)
    pattern_matched_keywords: Set[str] = set()
    
    def add_keyword(raw_text: str, is_pattern_match: bool = False) -> None:
        """Add a keyword to the frequency counter if valid"""
        normalized = normalize_keyword(raw_text)
        
        if not normalized:
            return
        
        # Check if phrase contains at least one non-generic token
        tokens = [t for t in re.split(r"\s+", normalized) if t]
        if not tokens:
            return
        
        if all(is_generic_word(t, spacy_stopwords) for t in tokens):
            return
        
        # Increment frequency (give pattern matches bonus points)
        if is_pattern_match:
            pattern_matched_keywords.add(normalized)
            keyword_freq[normalized] = keyword_freq.get(normalized, 0) + 10  # High priority
        else:
            keyword_freq[normalized] = keyword_freq.get(normalized, 0) + 1
    
    # ========================================================================
    # Strategy 1: Technology Pattern Matching (HIGHEST PRIORITY)
    # ========================================================================
    for pattern in TECH_PATTERNS:
        for match in pattern.finditer(text):
            add_keyword(match.group(0), is_pattern_match=True)
    
    # ========================================================================
    # Strategy 2: Single-Token Keywords (ONLY Known Technical Terms)
    # ========================================================================
    # STRICTLY limit single-word extraction to only known skill head words
    # This prevents extraction of company names, locations, and generic words
    for token in doc:
        # Skip whitespace, punctuation, and numbers
        if token.is_space or token.is_punct or token.like_num:
            continue
        
        # Only extract nouns (not proper nouns - they're often company/location names)
        if token.pos_ != "NOUN":
            continue
        
        # Use lemma for better normalization
        lemma = token.lemma_ if token.lemma_ else token.text
        candidate = normalize_keyword(lemma)
        
        # Filter generic words
        if is_generic_word(candidate, spacy_stopwords):
            continue
        
        # ONLY add if it's a known skill head word (like "python", "java", etc.)
        # This prevents random nouns from being extracted
        if candidate in SKILL_HEAD_WORDS:
            add_keyword(candidate)
    
    # ========================================================================
    # Strategy 3: Multi-Word Noun Phrases (Skills and Knowledge Areas)
    # ========================================================================
    for chunk in doc.noun_chunks:
        tokens = [t for t in chunk if not t.is_punct and not t.is_space]
        
        if not tokens:
            continue
        
        # Remove leading determiners and pronouns
        while tokens and tokens[0].pos_ in {"DET", "PRON"}:
            tokens = tokens[1:]
        
        if not tokens:
            continue
        
        # Limit phrase length (2-4 tokens for multi-word skills)
        if len(tokens) < 2 or len(tokens) > 4:
            continue
        
        # Must end with a noun or proper noun
        if tokens[-1].pos_ not in {"NOUN", "PROPN"}:
            continue
        
        # Must contain at least one noun
        if not any(t.pos_ == "NOUN" for t in tokens):
            continue
        
        # Build lemma-based phrase
        lemmas = [
            (t.lemma_.lower() if t.lemma_ else t.text.lower())
            for t in tokens
        ]
        phrase = normalize_keyword(" ".join(lemmas))
        
        # Check if the head word is a known skill noun
        last_word = tokens[-1].lemma_.lower() if tokens[-1].lemma_ else tokens[-1].text.lower()
        
        if is_generic_word(last_word, spacy_stopwords):
            continue
        
        # ONLY include phrases with skill-related head words
        # Must have a known skill head word to be considered a valid skill phrase
        has_skill_word = last_word in SKILL_HEAD_WORDS or any(w in SKILL_HEAD_WORDS for w in lemmas)
        
        # Be more specific with technical modifiers - only clear skill domains
        specific_skill_modifiers = {
            "data", "business", "project", "technical", "product", 
            "cloud", "digital", "database", "api", "machine", "artificial",
            "network", "cyber", "quality", "performance", "user",
            # Banking and Finance modifiers
            "cash", "treasury", "liquidity", "payment", "trade", "supply", "chain",
            "financial", "banking", "channel", "electronic", "mobile", "internet",
            # Requirements and Analysis modifiers
            "functional", "requirement", "requirements", "solution", "workflow",
            "stakeholder", "root", "cause", "defect", "test"
        }
        has_technical_modifier = any(w in specific_skill_modifiers for w in lemmas) and last_word in SKILL_HEAD_WORDS
        
        if has_skill_word or has_technical_modifier:
            add_keyword(phrase)
    
    # ========================================================================
    # Strategy 4: Named Entities (ONLY Products and Programming Languages)
    # ========================================================================
    # Removed: ORG (company names), GPE (locations/cities/countries)
    # These are not skills and cause noise
    relevant_entity_types = {"PRODUCT", "LANGUAGE"}
    
    for entity in doc.ents:
        if entity.label_ not in relevant_entity_types:
            continue
        
        entity_normalized = normalize_keyword(entity.text)
        
        # Filter if all tokens are generic
        tokens = [t for t in entity_normalized.split() if not is_generic_word(t, spacy_stopwords)]
        if not tokens:
            continue
        
        add_keyword(entity_normalized)
    
    # ========================================================================
    # Sort and Return
    # ========================================================================
    # Sort by priority: pattern-matched multi-word phrases first, then by frequency
    def sort_key(keyword: str) -> tuple:
        is_pattern = keyword in pattern_matched_keywords
        is_multi_word = ' ' in keyword
        freq = keyword_freq[keyword]
        
        # Priority order:
        # 1. Pattern-matched keywords (highest)
        # 2. Multi-word phrases
        # 3. Single words
        # Within each category, sort by frequency (desc), then alphabetically
        return (
            not is_pattern,      # Pattern matches first (False < True)
            not is_multi_word,   # Multi-word phrases next
            -freq,               # Higher frequency first
            keyword              # Alphabetical for ties
        )
    
    sorted_keywords = sorted(keyword_freq.keys(), key=sort_key)
    
    # Return top 50 keywords (focusing on quality over quantity)
    return sorted_keywords[:50]


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify service status.
    
    Returns:
        Health status and spaCy model information
    """
    global nlp
    
    return HealthResponse(
        status="healthy",
        spacy_model_loaded=nlp is not None,
        model_name="en_core_web_sm" if nlp is not None else None
    )


@app.post("/extract", response_model=ExtractResponse)
async def extract_keywords(request: ExtractRequest):
    """
    Extract keywords from job description text.
    
    Args:
        request: Request containing job description text
        
    Returns:
        Response with extracted keywords and count
        
    Raises:
        HTTPException: If text processing fails
    """
    try:
        # Validate input
        if not request.text or not request.text.strip():
            return ExtractResponse(keywords=[], count=0)
        
        # Extract keywords
        logger.info(f"Extracting keywords from text (length: {len(request.text)})")
        keywords = extract_keywords_from_text(request.text)
        
        logger.info(f"Extracted {len(keywords)} keywords")
        
        return ExtractResponse(
            keywords=keywords,
            count=len(keywords)
        )
        
    except Exception as e:
        logger.error(f"Error extracting keywords: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract keywords: {str(e)}"
        )


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "NLP Keyword Extraction Service",
        "version": "2.0.0",
        "endpoints": {
            "health": "/health",
            "extract": "/extract (POST)",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
