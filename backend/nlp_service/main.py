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
from typing import List, Dict, Set, Optional, Union, Any
import re
import logging
import sys
import os
from pathlib import Path

# CRITICAL FIX: Redirect stderr to stdout at startup to prevent broken pipe errors
# This must be done BEFORE any imports that might write to stderr
try:
    # Redirect stderr to stdout to prevent broken pipe errors
    # This ensures all output goes to stdout, which is properly handled by Node.js
    sys.stderr = sys.stdout
except (BrokenPipeError, OSError, AttributeError):
    # If redirection fails, create a null device for stderr
    try:
        sys.stderr = open(os.devnull, 'w')
    except:
        pass  # If all else fails, stderr will use safe_stderr_print

# Helper function to safely write to stderr (handles broken pipe errors)
def safe_stderr_print(*args, **kwargs):
    """Safely print to stderr, handling broken pipe errors gracefully"""
    try:
        # Since stderr is redirected to stdout, this will write to stdout
        print(*args, file=sys.stderr, **kwargs)
    except (BrokenPipeError, OSError):
        # Broken pipe or other I/O error - stderr pipe was closed
        # Silently ignore to prevent crashes
        pass

# Configure logging FIRST (before imports that might log)
# Use a custom handler that safely handles broken pipe errors
class SafeStreamHandler(logging.StreamHandler):
    """Stream handler that safely handles broken pipe errors"""
    def emit(self, record):
        try:
            super().emit(record)
        except (BrokenPipeError, OSError):
            # Silently ignore broken pipe errors in logging
            pass

# Configure logging with safe handler
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    force=True,  # Force reconfiguration if already configured
    handlers=[SafeStreamHandler(sys.stdout)]  # Use stdout instead of stderr for logging
)
logger = logging.getLogger(__name__)

# Also configure root logger to ensure all logs are visible
root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)
# Replace any existing handlers with safe handlers
for handler in root_logger.handlers[:]:
    root_logger.removeHandler(handler)
root_logger.addHandler(SafeStreamHandler(sys.stdout))

# Import skills matcher
try:
    try:
        from .skills_matcher import get_skills_database, extract_skills_with_phrasematcher
    except ImportError:
        # Fallback for when running as script
        from skills_matcher import get_skills_database, extract_skills_with_phrasematcher
    SKILLS_MATCHER_AVAILABLE = True
    logger.info("Skills matcher module loaded successfully")
except ImportError as e:
    logger.warning(f"Skills matcher not available: {e}")
    logger.warning("The /extract-skills endpoint will not be available")
    SKILLS_MATCHER_AVAILABLE = False

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


class ExtractSkillsRequest(BaseModel):
    """Request model for skill extraction using PhraseMatcher"""
    text: str = Field(..., description="Text to extract skills from", min_length=1)
    use_fuzzy: bool = Field(default=True, description="Use fuzzy matching for missed skills")


class SkillMatch(BaseModel):
    """Individual skill match result"""
    skill: str = Field(..., description="Matched skill name")
    canonical: str = Field(..., description="Canonical form of the skill")
    weight: float = Field(..., description="Skill weight (0-3): 3=core language, 2=framework, 1=tool, 0=filtered")


class ExtractSkillsResponse(BaseModel):
    """Response model containing extracted skills with matching details"""
    skills: List[str] = Field(default_factory=list, description="List of extracted skill names (canonical)")
    matches: List[SkillMatch] = Field(default_factory=list, description="Detailed match information")
    count: int = Field(default=0, description="Total number of skills extracted")
    stats: Dict[str, Any] = Field(default_factory=dict, description="Extraction statistics (can contain integers for counts or strings for error messages)")
    # 3-section classification
    important_skills: List[str] = Field(default_factory=list, description="Important technical skills")
    less_important_skills: List[str] = Field(default_factory=list, description="Less important technical skills")
    non_technical_skills: List[str] = Field(default_factory=list, description="Non-technical terms")


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
    """Pre-load the spaCy model and embeddings at startup to avoid delays on first request"""
    try:
        load_spacy_model()
        logger.info("NLP service startup complete")
        
        # Pre-load skills database (this loads embeddings from cache if available)
        try:
            from .skills_matcher import get_skills_database
        except ImportError:
            from skills_matcher import get_skills_database
        
        skills_db = get_skills_database()
        if skills_db and skills_db.classifier and skills_db.classifier.available:
            if (skills_db.classifier.important_tech_embeddings is not None and
                skills_db.classifier.less_important_tech_embeddings is not None and
                skills_db.classifier.non_tech_embeddings is not None):
                logger.info("✅ Pre-computed embeddings loaded from cache - no computation needed")
            else:
                logger.warning("⚠️  Embeddings cache not found - will compute on first request (slow)")
        else:
            logger.warning("⚠️  Sentence Transformers not available - using rule-based filters only")
    except Exception as e:
        logger.error(f"Warning: Failed to pre-load during startup: {e}")


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
        """Add a keyword to the frequency counter if valid (very lenient)"""
        normalized = normalize_keyword(raw_text)
        
        if not normalized:
            return
        
        # Very lenient: only check if it's not empty and has at least one alphanumeric character
        if not re.search(r"[a-z0-9]", normalized):
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
    # Strategy 2: Single-Token Keywords (Very Lenient - Extract All Nouns)
    # ========================================================================
    # Extract all nouns and proper nouns - very lenient approach
    # Only filter out very obvious stopwords and very short tokens
    minimal_stopwords = {
        "the", "a", "an", "and", "or", "but", "for", "with", "from", "to", "of", "in", "on", "at", "by"
    }
    
    for token in doc:
        # Skip whitespace, punctuation, and numbers
        if token.is_space or token.is_punct or token.like_num:
            continue
        
        # Use lemma for better normalization
        lemma = token.lemma_ if token.lemma_ else token.text
        candidate = normalize_keyword(lemma)
        
        # Very lenient filtering - only filter out:
        # 1. Very short tokens (1-2 characters)
        # 2. Minimal stopwords
        # 3. Tokens that are mostly punctuation
        if len(candidate) <= 2:
            continue
        
        if not re.search(r"[a-z0-9]", candidate):
            continue
        
        # Extract ALL nouns and proper nouns (very lenient)
        should_extract = False
        
        if token.pos_ == "NOUN" or token.pos_ == "PROPN":
            # Only skip if it's a minimal stopword
            if candidate.lower() not in minimal_stopwords:
                should_extract = True
        
        if should_extract:
            add_keyword(candidate)
    
    # ========================================================================
    # Strategy 3: Multi-Word Noun Phrases (Very Lenient - Extract All Noun Phrases)
    # ========================================================================
    # Very lenient: Extract all noun phrases that contain nouns
    minimal_stopwords = {
        "the", "a", "an", "and", "or", "but", "for", "with", "from", "to", "of", "in", "on", "at", "by"
    }
    
    for chunk in doc.noun_chunks:
        tokens = [t for t in chunk if not t.is_punct and not t.is_space]
        
        if not tokens:
            continue
        
        # Remove leading determiners and pronouns
        while tokens and tokens[0].pos_ in {"DET", "PRON"}:
            tokens = tokens[1:]
        
        if not tokens:
            continue
        
        # Limit phrase length (2-6 tokens for multi-word phrases - more lenient)
        if len(tokens) < 2 or len(tokens) > 6:
            continue
        
        # Must end with a noun or proper noun
        if tokens[-1].pos_ not in {"NOUN", "PROPN"}:
            continue
        
        # Must contain at least one noun
        if not any(t.pos_ in {"NOUN", "PROPN"} for t in tokens):
            continue
        
        # Build lemma-based phrase
        lemmas = [
            (t.lemma_.lower() if t.lemma_ else t.text.lower())
            for t in tokens
        ]
        phrase = normalize_keyword(" ".join(lemmas))
        
        # Very lenient: Extract if phrase contains at least one noun and doesn't start with minimal stopwords
        # Only skip if all words are minimal stopwords
        if all(w in minimal_stopwords for w in lemmas):
            continue
        
        # Extract all noun phrases (very lenient)
        add_keyword(phrase)
    
    # ========================================================================
    # Strategy 4: Named Entities (Products, Languages, and Organizations that are Technologies)
    # ========================================================================
    # Extract PRODUCT and LANGUAGE entities
    # Also extract ORG entities that look like technology companies/products
    relevant_entity_types = {"PRODUCT", "LANGUAGE"}
    
    # Technology company names that are also product names
    tech_orgs = {
        "salesforce", "oracle", "sap", "microsoft", "ibm", "adobe", "servicenow",
        "workday", "snowflake", "databricks", "tableau", "qlik", "looker",
        "atlassian", "jira", "confluence", "github", "gitlab", "jenkins",
        "docker", "kubernetes", "terraform", "ansible", "puppet", "chef"
    }
    
    for entity in doc.ents:
        entity_normalized = normalize_keyword(entity.text)
        
        # Extract PRODUCT and LANGUAGE entities
        if entity.label_ in relevant_entity_types:
            tokens = [t for t in entity_normalized.split() if not is_generic_word(t, spacy_stopwords)]
            if tokens:
                add_keyword(entity_normalized)
        
        # Extract ORG entities that are known technology companies/products
        elif entity.label_ == "ORG":
            if entity_normalized in tech_orgs or any(word in tech_orgs for word in entity_normalized.split()):
                tokens = [t for t in entity_normalized.split() if not is_generic_word(t, spacy_stopwords)]
                if tokens:
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
    
    # Return top 100 keywords (increased from 50 to extract more skills)
    return sorted_keywords[:100]


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
        logger.error(f"Error extracting keywords: {e}", exc_info=False)  # Don't use exc_info to avoid stderr writes
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract keywords: {str(e)}"
        )


@app.post("/extract-skills", response_model=ExtractSkillsResponse)
async def extract_skills_phrasematcher(request: ExtractSkillsRequest):
    """
    Extract skills from text using spaCy PhraseMatcher with skills.csv.
    
    This endpoint:
    1. Uses PhraseMatcher to find exact matches from skills.csv (38k skills)
    2. Normalizes same-meaning skills (node.js = node)
    3. Filters out low-priority skills (leadership, etc.)
    4. Returns canonical skill names
    
    Args:
        request: Request containing text and options
        
    Returns:
        Response with extracted skills, matches, and statistics
    """
    if not SKILLS_MATCHER_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Skills matcher module not available. Check server logs."
        )
    
    # Top-level wrapper to catch any broken pipe errors before processing
    try:
        return await _extract_skills_internal(request)
    except (BrokenPipeError, OSError) as e:
        # Catch broken pipe at the very top level
        error_str = str(e)
        error_lower = error_str.lower()
        is_broken_pipe = (
            isinstance(e, BrokenPipeError) or 
            (isinstance(e, OSError) and e.errno == 32) or
            "broken pipe" in error_lower or 
            "[errno 32]" in error_lower or 
            "errno 32" in error_lower
        )
        if is_broken_pipe:
            try:
                logger.warning(f"Broken pipe error at top level: {e}")
            except:
                pass
            return ExtractSkillsResponse(
                skills=[],
                matches=[],
                count=0,
                stats={"total_matches": 0, "error": "stderr_pipe_closed", "message": "Broken pipe - stderr closed"}
            )
        raise
    except Exception as e:
        # Check error message for broken pipe
        error_str = str(e)
        error_lower = error_str.lower()
        if "broken pipe" in error_lower or "[errno 32]" in error_lower or "errno 32" in error_lower:
            try:
                logger.warning(f"Broken pipe error (in exception message): {e}")
            except:
                pass
            return ExtractSkillsResponse(
                skills=[],
                matches=[],
                count=0,
                stats={"total_matches": 0, "error": "stderr_pipe_closed", "message": str(e)}
            )
        raise


async def _extract_skills_internal(request: ExtractSkillsRequest):
    """Internal function to extract skills - separated for better error handling"""
    try:
        # Validate input
        if not request.text or not request.text.strip():
            return ExtractSkillsResponse(
                skills=[],
                matches=[],
                count=0,
                stats={"total_matches": 0, "low_priority_filtered": 0}
            )
        
        # Load NLP model
        nlp_model = load_spacy_model()
        
        # Get skills database (this will initialize Sentence Transformers if available)
        # Wrap in try-except to handle broken pipe during initialization
        try:
            safe_stderr_print("=" * 60, flush=True)
            safe_stderr_print("🔍 [EMBEDDINGS] Initializing skills database...", flush=True)
            safe_stderr_print("=" * 60, flush=True)
            
            logger.info("=" * 60)
            logger.info("🔍 [Sentence Transformers] Checking availability...")
            skills_db = get_skills_database()
        except (BrokenPipeError, OSError) as e:
            # Handle broken pipe during database initialization
            is_broken_pipe = (
                isinstance(e, BrokenPipeError) or 
                (isinstance(e, OSError) and e.errno == 32)
            )
            if is_broken_pipe:
                # Broken pipe during init - return empty result
                try:
                    logger.warning(f"Broken pipe during skills database initialization: {e}")
                except:
                    pass
                return ExtractSkillsResponse(
                    skills=[],
                    matches=[],
                    count=0,
                    stats={"total_matches": 0, "error": "init_broken_pipe", "message": "Broken pipe during initialization"}
                )
            else:
                raise
        
        safe_stderr_print(f"[EMBEDDINGS] Classifier available: {skills_db.classifier.available}", flush=True)
        
        # Log Sentence Transformers status
        if skills_db.classifier.available:
            safe_stderr_print("✅ [EMBEDDINGS] Classifier is ACTIVE - semantic filtering ENABLED", flush=True)
            logger.info("✅ [Sentence Transformers] Classifier is ACTIVE")
            logger.info("   Will validate all extracted skills semantically")
        else:
            safe_stderr_print("=" * 60, flush=True)
            safe_stderr_print("⚠️  [EMBEDDINGS] Classifier NOT available", flush=True)
            safe_stderr_print("   Install with: pip install sentence-transformers torch", flush=True)
            safe_stderr_print("   Continuing without semantic validation...", flush=True)
            safe_stderr_print("=" * 60, flush=True)
            logger.warning("=" * 60)
            logger.warning("⚠️  [Sentence Transformers] Classifier NOT available")
            logger.warning("   Install with: pip install sentence-transformers torch")
            logger.warning("   Continuing without semantic validation...")
            logger.warning("=" * 60)
        logger.info("=" * 60)
        
        # Extract skills using PhraseMatcher with context filtering
        logger.info(f"Extracting skills from text (length: {len(request.text)})")
        try:
            matches = extract_skills_with_phrasematcher(
                request.text,
                nlp_model,
                skills_db,
                use_fuzzy=request.use_fuzzy,
                use_context_filter=True  # Enable context filtering (Option 2)
            )
        except (BrokenPipeError, OSError) as e:
            # Handle broken pipe during extraction - return empty result
            if isinstance(e, OSError) and e.errno != 32:
                raise  # Re-raise if not broken pipe
            try:
                logger.warning(f"Broken pipe during skill extraction: {e}")
            except:
                pass
            matches = []  # Return empty matches on broken pipe
        
        # Extract unique canonical skills with weights (already collapsed and filtered)
        # Store as (skill, canonical, weight) tuples for sorting
        skill_tuples = []
        seen_canonicals = set()
        
        for skill, canonical, weight in matches:
            if canonical not in seen_canonicals:
                seen_canonicals.add(canonical)
                skill_tuples.append((skill, canonical, weight))
        
        # Sort by weight (descending) - most important skills first
        # Weight 3 = core languages (highest priority)
        # Weight 2 = frameworks
        # Weight 1 = tools/platforms
        skill_tuples.sort(key=lambda x: (-x[2], x[0].lower()))  # Sort by weight desc, then alphabetically
        
        # Normalize skills to display names (e.g., "ts" → "TypeScript", "node" → "Node.js")
        normalized_skills = []
        for skill, canonical, weight in skill_tuples:
            normalized = skills_db.normalize_skill_display(skill)
            normalized_skills.append(normalized)
        
        # Build response with weights and normalized display names (sorted by importance)
        normalized_matches = []
        for skill, canonical, weight in skill_tuples:
            normalized_skill = skills_db.normalize_skill_display(skill)
            normalized_matches.append(SkillMatch(
                skill=normalized_skill,
                canonical=canonical,
                weight=weight
            ))
        
        # Blacklist: Skills that should NEVER be classified as Important
        IMPORTANT_KEYWORDS_BLACKLIST = {
            "computer science", "cs", "information technology", "it",
            "software development", "web development", "application development",
            "programming", "coding", "code", "codes", "coded", "coder", "coders",
            "software engineering", "code review", "code reviews",
            "technical skills", "technical knowledge", "technical writing"
        }
        
        def is_blacklisted_skill(skill_name: str) -> bool:
            """Check if a skill is blacklisted (case-insensitive with substring matching)"""
            if not skill_name:
                return False
            skill_lower = skill_name.lower().strip()
            # Check exact match
            if skill_lower in IMPORTANT_KEYWORDS_BLACKLIST:
                return True
            # Check if skill contains any blacklisted term as substring
            for blacklisted_term in IMPORTANT_KEYWORDS_BLACKLIST:
                if blacklisted_term in skill_lower or skill_lower in blacklisted_term:
                    return True
            return False
        
        # Classify skills into 3 categories: Important Tech, Less Important Tech, Non-Tech
        important_skills = []
        less_important_skills = []
        non_technical_skills = []
        
        classifier = skills_db.classifier if hasattr(skills_db, 'classifier') else None
        
        # Check if classifier and embeddings are available
        has_classifier = (classifier and classifier.available and 
                         classifier.model is not None and
                         classifier.important_tech_embeddings is not None and
                         classifier.less_important_tech_embeddings is not None and
                         classifier.non_tech_embeddings is not None)
        
        if has_classifier:
            logger.info("Using semantic classification for 3-section categorization")
        else:
            logger.info("Using weight-based classification (classifier/embeddings not available)")
        
        for skill, canonical, weight in skill_tuples:
            normalized_skill = skills_db.normalize_skill_display(skill)
            skill_lower = normalized_skill.lower().strip()
            original_skill_lower = skill.lower().strip()
            
            # Check blacklist first - never allow these as Important
            # Check both normalized and original skill names with substring matching
            is_blacklisted = (is_blacklisted_skill(normalized_skill) or 
                            is_blacklisted_skill(skill))
            
            if is_blacklisted:
                logger.info(f"🚫 Blacklisted skill '{normalized_skill}' (original: '{skill}') - forcing to Less Important or Non-Technical")
                safe_stderr_print(f"[EMBEDDINGS] 🚫 Blacklisted: '{normalized_skill}' - will NOT be Important", flush=True)
                # Force to Less Important or Non-Technical based on similarity
                if has_classifier:
                    try:
                        import torch
                        from sentence_transformers import util
                        skill_embedding = classifier.model.encode(normalized_skill, convert_to_tensor=True)
                        less_important_sim = torch.max(util.cos_sim(skill_embedding, classifier.less_important_tech_embeddings)).item()
                        non_tech_sim = torch.max(util.cos_sim(skill_embedding, classifier.non_tech_embeddings)).item()
                        if less_important_sim > non_tech_sim and less_important_sim > 0.3:
                            less_important_skills.append(normalized_skill)
                        else:
                            non_technical_skills.append(normalized_skill)
                    except Exception as e:
                        logger.warning(f"Error classifying blacklisted skill '{normalized_skill}': {e}")
                        # Fallback: put in non-technical
                        non_technical_skills.append(normalized_skill)
                else:
                    # Fallback: put in less important
                    less_important_skills.append(normalized_skill)
                continue  # Skip to next skill
            
            if has_classifier:
                # Use semantic classification
                try:
                    import torch
                    from sentence_transformers import util
                    
                    skill_embedding = classifier.model.encode(normalized_skill, convert_to_tensor=True)
                    
                    # Compare with all three categories
                    important_sim = torch.max(util.cos_sim(skill_embedding, classifier.important_tech_embeddings)).item()
                    less_important_sim = torch.max(util.cos_sim(skill_embedding, classifier.less_important_tech_embeddings)).item()
                    non_tech_sim = torch.max(util.cos_sim(skill_embedding, classifier.non_tech_embeddings)).item()
                    
                    # Classify based on highest similarity
                    max_sim = max(important_sim, less_important_sim, non_tech_sim)
                    
                    if max_sim > 0.3:  # Minimum similarity threshold
                        if important_sim == max_sim and important_sim > 0.3:
                            important_skills.append(normalized_skill)
                        elif less_important_sim == max_sim and less_important_sim > 0.3:
                            less_important_skills.append(normalized_skill)
                        else:
                            non_technical_skills.append(normalized_skill)
                    else:
                        # Low similarity - classify based on weight as fallback
                        if weight >= 2:
                            important_skills.append(normalized_skill)
                        elif weight >= 1:
                            less_important_skills.append(normalized_skill)
                        else:
                            non_technical_skills.append(normalized_skill)
                except Exception as e:
                    logger.warning(f"Error classifying skill '{normalized_skill}': {e}, using weight-based classification")
                    import traceback
                    logger.debug(traceback.format_exc())
                    # Fallback to weight-based classification
                    if weight >= 2:
                        important_skills.append(normalized_skill)
                    elif weight >= 1:
                        less_important_skills.append(normalized_skill)
                    else:
                        non_technical_skills.append(normalized_skill)
            else:
                # Fallback: classify based on weight
                if weight >= 2:
                    important_skills.append(normalized_skill)
                elif weight >= 1:
                    less_important_skills.append(normalized_skill)
                else:
                    non_technical_skills.append(normalized_skill)
        
        # Final filter: Remove any blacklisted items from important_skills (defensive check)
        # This ensures blacklisted items never appear in Important, even if they somehow got through
        important_skills_filtered = []
        for skill in important_skills:
            if not is_blacklisted_skill(skill):
                important_skills_filtered.append(skill)
            else:
                # Move to less important or non-technical
                logger.warning(f"🚫 Removed blacklisted skill '{skill}' from Important (final filter)")
                safe_stderr_print(f"[EMBEDDINGS] 🚫 Final filter: Removed '{skill}' from Important", flush=True)
                skill_lower = skill.lower().strip()
                if skill_lower in ["computer science", "cs", "information technology", "it"]:
                    non_technical_skills.append(skill)
                else:
                    less_important_skills.append(skill)
        important_skills = important_skills_filtered
        
        # Calculate weighted statistics
        total_weight = sum(weight for _, _, weight in matches)
        weighted_skills = [skill for skill, _, weight in matches if weight > 0]
        
        stats = {
            "total_matches": len(matches),
            "unique_skills": len(normalized_skills),
            "weighted_skills": len(weighted_skills),
            "total_weight": total_weight,
            "garbage_filtered": len(matches) - len(weighted_skills),
            "validation_passed": len(weighted_skills),  # All skills passed type + specificity validation
            "important_count": len(important_skills),
            "less_important_count": len(less_important_skills),
            "non_technical_count": len(non_technical_skills)
        }
        
        logger.info(f"Extracted {len(normalized_skills)} unique skills from {len(matches)} matches")
        logger.info(f"Classification: {len(important_skills)} important, {len(less_important_skills)} less important, {len(non_technical_skills)} non-technical")
        logger.info(f"Skills normalized to display names (e.g., 'ts' → 'TypeScript', 'node' → 'Node.js')")
        
        # Ensure all lists are initialized (defensive programming)
        if not important_skills:
            important_skills = []
        if not less_important_skills:
            less_important_skills = []
        if not non_technical_skills:
            non_technical_skills = []
        
        safe_stderr_print(f"[EMBEDDINGS] Classification results: Important={len(important_skills)}, Less Important={len(less_important_skills)}, Non-Tech={len(non_technical_skills)}", flush=True)
        
        return ExtractSkillsResponse(
            skills=normalized_skills,
            matches=normalized_matches,
            count=len(normalized_skills),
            stats=stats,
            important_skills=important_skills,
            less_important_skills=less_important_skills,
            non_technical_skills=non_technical_skills
        )
        
    except (BrokenPipeError, OSError) as e:
        # Handle broken pipe errors - these happen when stderr pipe is closed
        # Check if it's a broken pipe (errno 32) or BrokenPipeError
        is_broken_pipe = (
            isinstance(e, BrokenPipeError) or 
            (isinstance(e, OSError) and e.errno == 32)
        )
        
        if is_broken_pipe:
            # Broken pipe - stderr was closed, but processing might have succeeded
            # Return empty result instead of crashing
            try:
                logger.warning(f"Broken pipe error during skill extraction (stderr closed): {e}")
            except:
                pass  # Even logger might fail if stderr is broken
            return ExtractSkillsResponse(
                skills=[],
                matches=[],
                count=0,
                stats={"total_matches": 0, "error": "stderr_pipe_closed", "message": "Broken pipe - stderr closed"}
            )
        else:
            # Other OSError - check if it's actually a broken pipe by checking the error message
            error_str = str(e)
            if "Broken pipe" in error_str or "[Errno 32]" in error_str or "broken pipe" in error_str.lower():
                # It's a broken pipe error - return empty result
                try:
                    logger.warning(f"Broken pipe error (detected in OSError): {e}")
                except:
                    pass
                return ExtractSkillsResponse(
                    skills=[],
                    matches=[],
                    count=0,
                    stats={"total_matches": 0, "error": "stderr_pipe_closed", "message": str(e)}
                )
            # Not a broken pipe - log and re-raise
            try:
                logger.error(f"OSError extracting skills: {e}", exc_info=False)
            except:
                pass
            raise HTTPException(
                status_code=500,
                detail=f"Failed to extract skills: {str(e)}"
            )
    except Exception as e:
        # Check if the error message contains "Broken pipe" or errno 32
        error_str = str(e)
        error_lower = error_str.lower()
        is_broken_pipe_in_message = (
            "broken pipe" in error_lower or 
            "[errno 32]" in error_lower or 
            "errno 32" in error_lower or
            "brokenpipeerror" in error_lower
        )
        
        if is_broken_pipe_in_message:
            # It's a broken pipe error wrapped in another exception
            try:
                logger.warning(f"Broken pipe error (wrapped in exception): {e}")
            except:
                pass
            return ExtractSkillsResponse(
                skills=[],
                matches=[],
                count=0,
                stats={"total_matches": 0, "error": "stderr_pipe_closed", "message": str(e)}
            )
        
        # For other exceptions, try to log but don't fail if logging fails
        try:
            logger.error(f"Error extracting skills: {e}", exc_info=False)
        except:
            pass
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract skills: {str(e)}"
        )


@app.get("/")
async def root():
    """Root endpoint with API information"""
    endpoints = {
            "health": "/health",
        "extract": "/extract (POST) - Legacy keyword extraction",
        "extract-skills": "/extract-skills (POST) - PhraseMatcher-based skill extraction",
            "docs": "/docs"
        }
    
    return {
        "service": "NLP Keyword Extraction Service",
        "version": "2.1.0",
        "endpoints": endpoints,
        "skills_matcher_available": SKILLS_MATCHER_AVAILABLE
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
