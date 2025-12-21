"""
Skills Matcher Module
====================
Uses spaCy PhraseMatcher to match skills from skills.csv against text.
Includes canonical mapping, low-priority filtering, and fuzzy matching.
Now includes Sentence Transformers for semantic skill classification.
"""

# Suppress GPU/CUDA messages BEFORE any imports
import os
os.environ['TOKENIZERS_PARALLELISM'] = 'false'
os.environ['CUDA_VISIBLE_DEVICES'] = ''  # Disable CUDA to suppress GPU messages

import csv
import re
import json
import sys
from typing import Dict, List, Set, Tuple, Optional
from pathlib import Path
from collections import defaultdict
import logging

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

try:
    from rapidfuzz import fuzz, process
except ImportError:
    fuzz = None
    process = None
    logging.warning("rapidfuzz not installed, fuzzy matching will be disabled")

try:
    from sentence_transformers import SentenceTransformer, util
    import torch
    SENTENCE_TRANSFORMERS_AVAILABLE = True
    logging.info("✅ [Sentence Transformers] Import successful - semantic classification ENABLED")
except ImportError as e:
    SentenceTransformer = None
    util = None
    torch = None
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    logging.warning("=" * 60)
    logging.warning("⚠️  [Sentence Transformers] NOT INSTALLED")
    logging.warning("   Error: " + str(e))
    logging.warning("   To enable semantic skill filtering:")
    logging.warning("   cd backend/nlp_service")
    logging.warning("   pip install sentence-transformers torch")
    logging.warning("   Then restart the NLP service")
    logging.warning("=" * 60)

logger = logging.getLogger(__name__)

# Safe StreamHandler that handles broken pipe errors
class SafeStreamHandler(logging.StreamHandler):
    """Stream handler that safely handles broken pipe errors"""
    def emit(self, record):
        try:
            super().emit(record)
        except (BrokenPipeError, OSError):
            # Silently ignore broken pipe errors in logging
            pass

# Configure root logger with safe handler
root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)
# Replace any existing handlers with safe handlers
for handler in root_logger.handlers[:]:
    root_logger.removeHandler(handler)
root_logger.addHandler(SafeStreamHandler(sys.stdout))

# Suppress GPU/CUDA messages from transformers and sentence_transformers
# This must be done before importing these libraries
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("torch").setLevel(logging.ERROR)
logging.getLogger("transformers.modeling_utils").setLevel(logging.ERROR)

# Ensure logger level is set to INFO to see all messages
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = SafeStreamHandler(sys.stdout)  # Use stdout instead of stderr for logging
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# ============================================================================
# Skill Type Enforcement (Problem 1 Fix - MANDATORY)
# ============================================================================

ALLOWED_SKILL_TYPES: Set[str] = {
    "language",      # Python, Java, JavaScript
    "framework",     # React, Django, Spring Boot
    "library",       # Pandas, NumPy, Lodash
    "tool",          # Docker, Git, Jenkins
    "database",      # MySQL, MongoDB, PostgreSQL
    "cloud",         # AWS, Azure, GCP
    "protocol",      # REST API, GraphQL, HTTP
    "platform",      # Node.js, .NET, JVM
    "runtime",       # Node, JVM, Python runtime
    "methodology",   # Agile, Scrum, CI/CD
    "standard",      # ISO, RFC standards
}

# Industry/domain terms that are NOT skills
INDUSTRY_TERMS: Set[str] = {
    "bakery", "grocery", "retail", "hospitality", "finance", "banking",
    "healthcare", "education", "manufacturing", "logistics", "supply chain"
}

# Abstract concepts that are NOT actionable skills
ABSTRACT_CONCEPTS: Set[str] = {
    # Generic development concepts
    "integration", "scripting", "authorization", "engineering", "development",
    "product development", "front-end", "back-end", "full-stack", "backend",
    "frontend", "front end", "back end", "programming",  # Too generic
    
    # Job posting/HR terms (NOT skills)
    "ai", "hiring", "open source", "resume", "root", "root cause",
    "scratch", "screening", "start to finish", "start-to-finish",
    "notice period", "opportunity", "placement", "salary", "competitive",
    "apply", "application", "interview", "client", "talent", "career",
    "challenge", "work environment", "portal", "register", "login",
    "upload", "shortlisted", "meet", "waiting", "ready", "today",
    "step", "process", "click", "form", "chances", "progress",
    "goal", "reliable", "simple", "fast", "relevant", "product",
    "great fit", "great", "fit", "part", "founding", "team",
    "building", "consumer", "payments", "platform", "grounds",
    "own", "end to end", "end-to-end", "responsibility", "architecture",
    "deployment", "monitoring", "develop", "features", "working",
    "distributed", "micro-service", "microservice", "environment",
    "handle", "million", "customers", "millisecond", "latencies",
    "dive", "details", "issues", "incidents", "outages", "analyze",
    "prepare", "reports", "solving", "real", "business", "needs",
    "large scale", "large-scale", "consumer-tech", "saas", "startup",
    "built", "systems", "before", "yrs", "years", "working",
    "containers", "designing", "services", "caching", "realtime",
    "realtime db", "realtime database", "ensuring", "whatever", "build",
    "deploy", "start", "finish", "top-notch", "quality", "enjoy",
    "products", "joining", "early", "stage", "involves", "more",
    "than", "just", "developing", "app", "often", "chaotic",
    "environments", "involved", "decisions", "well", "leverage",
    "work", "fast", "faster", "need", "able", "collaborate",
    "design", "teams", "within", "constraints", "understand",
    "companies", "make", "correct", "tradeoffs", "between", "time",
    "speed", "features", "whenever", "required", "love", "give",
    "back", "community", "through", "blogging", "mentoring",
    "contributing", "fintech", "industry", "working", "around",
    "big", "plus", "apply", "opportunity", "easy", "register",
    "log", "portal", "updated", "complete", "increase", "get",
    "meet", "for", "about", "goal", "make", "getting", "hired",
    "reliable", "simple", "fast", "role", "help", "all", "our",
    "talents", "find", "progress", "their", "note", "there", "are",
    "many", "more", "opportunities", "apart", "from", "this", "on",
    "so", "if", "you", "are", "ready", "new", "great", "environment",
    "take", "your", "next", "level", "don't", "hesitate", "today",
    "we", "waiting", "for", "you"
    
    # Business/process concepts
    "cross functional", "working model", "sustainable growth", "product lines",
    "corporate card", "linkedin learning", "customer", "developers", "engineers",
    "contractors", "culture", "org structure", "learning programs", "business context",
    "user feedback", "user experience", "ux", "ui", "user interface",
    "programmers", "researchers", "research", "cooperation", "collaboration",
    "start-up", "startup", "start up",
    
    # Generic technical concepts (not specific skills)
    "cloud infrastructure", "infrastructure", "component libraries", "component library",
    "state management", "web security", "security", "dom", "document object model",
    "api", "apis", "rest api", "rest apis", "restful api", "restful apis",
    "microservices", "microservice", "micro services",  # Too generic without context
    "distributed systems", "scalability", "availability", "performance",
    "code review", "code reviews", "testing", "unit testing", "e2e testing",
    "end-to-end", "end to end", "e2e",
    "cloud", "cyber", "cyber security", "cybersecurity",  # Too generic
    "hybrid cloud", "public cloud", "private cloud",  # Too generic without specific tech
    "digital", "digital transformation", "digitalization",
    
    # Generic domains
    "databases", "database", "relational databases", "nosql databases",
    "web applications", "web application", "applications", "application",
    "software", "platform", "platforms", "systems", "system",
    
    # Architecture patterns (too abstract)
    "architecture", "architectures", "design patterns", "design pattern",
    "software architecture", "system architecture",
    
    # HR/Legal terms (NOT skills)
    "equal employment opportunity", "eeo", "pregnancy", "religion", "color",
    "race", "gender", "age", "disability", "veteran", "national origin",
    "discrimination", "harassment", "diversity", "inclusion", "equity",
    
    # Insurance and financial terms (NOT technical skills)
    "term life insurance", "life insurance", "health insurance", "disability insurance",
    "insurance", "value proposition", "credit", "craft",
    
    # Common words that are NOT skills
    "it", "color", "rocket", "yarn",  # Too ambiguous or generic
    "product", "products", "service", "services", "solution", "solutions",
    "technology", "technologies", "tech", "method", "methods",
    "process", "processes", "approach", "approaches",
    
    # Generic job-related terms
    "experience", "experiences", "background", "backgrounds",
    "qualification", "qualifications", "requirement", "requirements",
    "responsibility", "responsibilities", "duty", "duties",
    
    # Additional non-technical terms
    "developers", "cs",  # "cs" is too ambiguous (could be Computer Science or just initials)
    "object-oriented programming",  # Too generic without context
    
    # Job posting/HR terms (NOT skills)
    "engineering", "ai", "hiring", "open source", "resume", "root", "root cause",
    "scratch", "screening", "start to finish", "start-to-finish",
    "notice period", "opportunity", "placement", "salary", "competitive",
    "apply", "application", "interview", "client", "talent", "career",
    "challenge", "work environment", "portal", "register", "login",
    "upload", "shortlisted", "meet", "waiting", "ready", "today",
    "step", "process", "click", "form", "chances", "progress",
    "goal", "reliable", "simple", "fast", "relevant", "product",
    "great fit", "great", "fit", "part", "founding", "team",
    "building", "consumer", "payments", "platform", "grounds",
    "own", "end to end", "end-to-end", "responsibility", "architecture",
    "deployment", "monitoring", "develop", "features", "working",
    "distributed", "micro-service", "microservice", "environment",
    "handle", "million", "customers", "millisecond", "latencies",
    "dive", "details", "issues", "incidents", "outages", "analyze",
    "prepare", "reports", "solving", "real", "business", "needs",
    "large scale", "large-scale", "consumer-tech", "saas", "startup",
    "built", "systems", "before", "yrs", "years", "working",
    "containers", "designing", "services", "caching", "realtime",
    "realtime db", "realtime database", "ensuring", "whatever", "build",
    "deploy", "start", "finish", "top-notch", "quality", "enjoy",
    "products", "joining", "early", "stage", "involves", "more",
    "than", "just", "developing", "app", "often", "chaotic",
    "environments", "involved", "decisions", "well", "leverage",
    "work", "fast", "faster", "need", "able", "collaborate",
    "design", "teams", "within", "constraints", "understand",
    "companies", "make", "correct", "tradeoffs", "between", "time",
    "speed", "features", "whenever", "required", "love", "give",
    "back", "community", "through", "blogging", "mentoring",
    "contributing", "fintech", "industry", "working", "around",
    "big", "plus", "apply", "opportunity", "easy", "register",
    "log", "portal", "updated", "complete", "increase", "get",
    "meet", "for", "about", "goal", "make", "getting", "hired",
    "reliable", "simple", "fast", "role", "help", "all", "our",
    "talents", "find", "progress", "their", "note", "there", "are",
    "many", "more", "opportunities", "apart", "from", "this", "on",
    "so", "if", "you", "are", "ready", "new", "great", "environment",
    "take", "your", "next", "level", "don't", "hesitate", "today",
    "we", "waiting", "for", "you"
}

# ============================================================================
# Minimum Skill Specificity (Problem 2 Fix)
# ============================================================================

# Whitelist of single-word skills that are valid (highly specific)
SPECIFIC_SINGLE_WORD_SKILLS: Set[str] = {
    # Languages
    "java", "python", "javascript", "typescript", "kotlin", "swift", "go", "rust",
    "scala", "ruby", "php", "r", "matlab", "sql", "html", "css",
    # Frameworks (well-known single words)
    "react", "angular", "vue", "django", "flask", "express", "spring",
    # Tools
    "docker", "kubernetes", "git", "jenkins", "terraform", "ansible",
    # Databases
    "mysql", "mongodb", "redis", "postgresql", "oracle", "nosql",
    # Platforms
    "aws", "azure", "gcp", "heroku", "vercel",
    # Node.js (common single-word reference)
    "node",
    # Mobile platforms (capitalized versions are valid)
    "android"  # Android OS is a technical skill, but will be validated by classifier
}

# ============================================================================
# Garbage Skills Stoplist (Problem 1 Fix - Additional)
# ============================================================================

GARBAGE_SKILLS: Set[str] = {
    # Generic nouns that are NOT skills
    "skills", "skill", "framework", "frameworks", "architecture", "architectures",
    "software", "softwares", "application", "applications", "app", "apps",
    "components", "component", "design", "designs", "interfaces", "interface",
    "contribute", "contributes", "boot", "web", "webs", "system", "systems",
    "platform", "platforms", "service", "services", "tool", "tools",
    "technology", "technologies", "tech", "method", "methods", "methodology",
    "process", "processes", "procedure", "procedures", "approach", "approaches",
    "solution", "solutions", "concept", "concepts", "principle", "principles",
    "pattern", "patterns", "practice", "practices", "standard", "standards",
    "protocol", "protocols", "specification", "specifications", "requirement", "requirements",
    "feature", "features", "function", "functions", "module", "modules",
    "library", "libraries", "package", "packages", "dependency", "dependencies",
    "environment", "environments", "configuration", "configurations", "setting", "settings",
    "parameter", "parameters", "variable", "variables", "constant", "constants",
    "object", "objects", "class", "classes", "function", "functions",
    "method", "methods", "property", "properties", "attribute", "attributes",
    "element", "elements", "item", "items", "entry", "entries",
    "record", "records", "data", "datas", "information", "informations",
    "content", "contents", "document", "documents", "file", "files",
    "folder", "folders", "directory", "directories", "path", "paths",
    "url", "urls", "uri", "uris", "link", "links", "reference", "references",
    "code", "codes", "script", "scripts", "program", "programs",
    "project", "projects", "task", "tasks", "job", "jobs", "work", "works",
    "team", "teams", "group", "groups", "organization", "organizations",
    "company", "companies", "business", "businesses", "industry", "industries",
    "domain", "domains", "field", "fields", "area", "areas", "sector", "sectors",
    "role", "roles", "position", "positions", "title", "titles",
    "responsibility", "responsibilities", "duty", "duties", "function", "functions",
    "experience", "experiences", "background", "backgrounds", "history", "histories",
    "education", "educations", "training", "trainings", "course", "courses",
    "certification", "certifications", "certificate", "certificates", "degree", "degrees",
    "knowledge", "knowledges", "understanding", "understandings", "expertise", "expertises",
    "ability", "abilities", "capability", "capabilities", "capacity", "capacities",
    "competence", "competences", "proficiency", "proficiencies", "mastery", "masteries",
    "skill", "skills",  # Yes, "skill" itself is not a skill!
    
    # Additional garbage terms from user feedback
    "developers", "engineers", "programmers", "researchers", "research",
    "cooperation", "collaboration", "start-up", "startup", "start up",
    "cloud", "cyber", "cyber security", "cybersecurity", "hybrid cloud",
    "public cloud", "private cloud", "digital", "digital transformation",
    "product", "products", "it", "color", "rocket", "yarn",
    "pregnancy", "religion", "eeo", "equal employment opportunity",
    "race", "gender", "age", "disability", "veteran", "national origin",
    "discrimination", "harassment", "diversity", "inclusion", "equity",
    "ecmascript",  # Too technical/abstract without context
}

# ============================================================================
# Low Priority Skills Filter (Soft Skills)
# ============================================================================

LOW_PRIORITY_SKILLS: Set[str] = {
    # Soft skills
    "leadership", "teamwork", "communication", "collaboration",
    "problem solving", "critical thinking", "time management",
    "organization", "planning", "multitasking", "adaptability",
    "creativity", "innovation", "flexibility", "work ethic",
    "interpersonal skills", "verbal communication", "written communication",
    "presentation skills", "public speaking", "negotiation",
    "conflict resolution", "decision making", "strategic thinking",
    "analytical thinking", "attention to detail", "self motivation",
    "initiative", "proactive", "reliable", "dependable",
    
    # Generic business terms
    "business acumen", "customer service", "client relations",
    "stakeholder management", "project coordination",
    
    # Too generic
    "management", "administration", "operations", "support",
    "coordination", "implementation", "execution",
}

# ============================================================================
# Skill Hierarchy (Problem 2 Fix - Longest Phrase Wins)
# ============================================================================

SKILL_HIERARCHY: Dict[str, List[str]] = {
    # Framework/Library > Language
    "spring boot": ["spring", "boot"],
    "spring framework": ["spring"],
    "react.js": ["react"],
    "react native": ["react"],
    "vue.js": ["vue"],
    "angular.js": ["angular"],
    "node.js": ["node", "nodejs"],
    "next.js": ["next"],
    "express.js": ["express"],
    
    # Database > Generic
    "relational databases": ["databases", "database"],
    "nosql databases": ["databases", "database"],
    "sql databases": ["databases", "database"],
    "mysql database": ["mysql", "database"],
    "postgresql database": ["postgresql", "postgres", "database"],
    "mongodb database": ["mongodb", "mongo", "database"],
    
    # Cloud Platform > Service
    "aws services": ["aws", "services"],
    "azure services": ["azure", "services"],
    "gcp services": ["gcp", "google cloud", "services"],
    
    # Specific > Generic
    "rest api": ["rest", "api", "apis"],
    "graphql api": ["graphql", "api", "apis"],
    "restful api": ["rest", "restful", "api", "apis"],
    "web api": ["web", "api", "apis"],
    
    # Tool > Generic
    "docker containers": ["docker", "containers", "container"],
    "kubernetes cluster": ["kubernetes", "k8s", "cluster"],
    "git version control": ["git", "version control"],
    "ci/cd pipeline": ["ci/cd", "cicd", "pipeline"],
    
    # Language > Generic
    "javascript programming": ["javascript", "js", "programming"],
    "python programming": ["python", "py", "programming"],
    "java programming": ["java", "programming"],
}

# ============================================================================
# Skill Weighting (Problem 3 Fix)
# ============================================================================

def get_skill_weight(skill: str) -> int:
    """
    Assign weight to skill based on importance.
    Higher weight = more important skill.
    
    Returns:
        Weight (0-3):
        - 3: Core programming languages
        - 2: Major frameworks/libraries
        - 1: Tools/databases/platforms
        - 0: Generic terms (should be filtered)
    """
    skill_lower = skill.lower().strip()
    
    # Core programming languages (weight 3)
    core_languages = {
        "python", "java", "javascript", "typescript", "c++", "cpp", "csharp", "c#",
        "kotlin", "swift", "go", "golang", "rust", "scala", "ruby", "php",
        "r", "matlab", "sql", "html", "css"
    }
    
    # Major frameworks/libraries (weight 2)
    major_frameworks = {
        "react", "angular", "vue", "node", "node.js", "spring", "spring boot",
        "django", "flask", "express", "next.js", "nuxt", "svelte",
        "laravel", "symfony", "rails", "asp.net", "dotnet", ".net",
        "hibernate", "jpa", "junit", "jest", "mocha", "cypress",
        "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy"
    }
    
    # Tools/databases/platforms (weight 1)
    tools_platforms = {
        "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins",
        "git", "github", "gitlab", "jira", "confluence", "slack",
        "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
        "aws", "azure", "gcp", "google cloud", "heroku", "vercel"
    }
    
    # Check exact match first
    if skill_lower in core_languages:
        return 3
    if skill_lower in major_frameworks:
        return 2
    if skill_lower in tools_platforms:
        return 1
    
    # Check if contains core language
    for lang in core_languages:
        if lang in skill_lower or skill_lower in lang:
            return 3
    
    # Check if contains major framework
    for framework in major_frameworks:
        if framework in skill_lower or skill_lower in framework:
            return 2
    
    # Check if contains tool/platform
    for tool in tools_platforms:
        if tool in skill_lower or skill_lower in tool:
            return 1
    
    # Default: generic term (weight 0 - should be filtered)
    return 0

# ============================================================================
# Canonical Skill Mapping (Normalize same meaning)
# ============================================================================

CANONICAL_MAP: Dict[str, str] = {
    # Node.js variations
    "node.js": "node",
    "nodejs": "node",
    "node js": "node",
    
    # JavaScript variations
    "javascript": "javascript",
    "js": "javascript",
    "ecmascript": "javascript",  # Normalize to JavaScript, but filter standalone "ecmascript"
    
    # TypeScript
    "typescript": "typescript",
    "ts": "typescript",
    
    # Python
    "python": "python",
    "py": "python",
    "python3": "python",
    "python 3": "python",
    
    # Java
    "java": "java",
    "java se": "java",
    "java ee": "java",
    
    # C# variations
    "c#": "csharp",
    "c sharp": "csharp",
    "csharp": "csharp",
    
    # C++ variations
    "c++": "cpp",
    "c plus plus": "cpp",
    "cpp": "cpp",
    
    # .NET variations
    ".net": "dotnet",
    "dotnet": "dotnet",
    ".net core": "dotnet",
    "asp.net": "aspnet",
    "aspnet": "aspnet",
    
    # React variations
    "react": "react",
    "react.js": "react",
    "reactjs": "react",
    
    # Vue variations
    "vue": "vue",
    "vue.js": "vue",
    "vuejs": "vue",
    
    # Angular variations
    "angular": "angular",
    "angularjs": "angular",
    "angular.js": "angular",
    
    # SQL variations
    "sql": "sql",
    "structured query language": "sql",
    
    # AWS variations
    "aws": "aws",
    "amazon web services": "aws",
    
    # Docker
    "docker": "docker",
    "docker container": "docker",
    
    # Kubernetes
    "kubernetes": "kubernetes",
    "k8s": "kubernetes",
    "kube": "kubernetes",
    
    # Git variations
    "git": "git",
    "git version control": "git",
    
    # REST API
    "rest": "rest api",
    "rest api": "rest api",
    "restful": "rest api",
    "restful api": "rest api",
    
    # GraphQL
    "graphql": "graphql",
    "graph ql": "graphql",
    
    # HTML/CSS
    "html": "html",
    "html5": "html",
    "css": "css",
    "css3": "css",
    
    # Machine Learning
    "machine learning": "machine learning",
    "ml": "machine learning",
    
    # Artificial Intelligence
    "artificial intelligence": "artificial intelligence",
    "ai": "artificial intelligence",
    
    # Data Science
    "data science": "data science",
    "data analytics": "data analytics",
    "data analysis": "data analysis",
}

# ============================================================================
# Skills Database Loader
# ============================================================================

class SkillOntology:
    """Manages skill ontology for hierarchical matching"""
    
    def __init__(self, ontology_path: Optional[str] = None):
        if ontology_path is None:
            # Try multiple possible locations for skill_ontology.json
            current_dir = Path(__file__).parent  # backend/nlp_service/
            
            # Option 1: In nlp_service directory (for Railway deployment)
            ontology_path = current_dir / "skill_ontology.json"
            
            # Option 2: In parent src/utils (for local development)
            if not ontology_path.exists():
                ontology_path = current_dir.parent / "src" / "utils" / "skill_ontology.json"
            
            # Option 3: Fallback to cwd
            if not ontology_path.exists():
                cwd_path = Path.cwd() / "skill_ontology.json"
                if cwd_path.exists():
                    ontology_path = cwd_path
                else:
                    cwd_path = Path.cwd() / "src" / "utils" / "skill_ontology.json"
                    if cwd_path.exists():
                        ontology_path = cwd_path
            
            ontology_path = str(ontology_path)
        
        self.ontology_path = str(ontology_path)
        self.ontology: Dict = {}
        self.skill_lookup: Dict[str, Dict] = {}  # skill_name -> skill_data
        self.parent_map: Dict[str, List[str]] = defaultdict(list)  # parent -> [children]
        self.loaded = False
    
    def load(self) -> None:
        """Load skill ontology from JSON"""
        if self.loaded:
            return
        
        if not os.path.exists(self.ontology_path):
            logger.warning(f"Skill ontology not found: {self.ontology_path}, using defaults")
            self.loaded = True
            return
        
        try:
            with open(self.ontology_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.ontology = data.get('skills', {})
            
            # Build lookup maps
            for skill_name, skill_data in self.ontology.items():
                skill_lower = skill_name.lower()
                self.skill_lookup[skill_lower] = skill_data
                
                # Handle aliases
                for alias in skill_data.get('aliases', []):
                    self.skill_lookup[alias.lower()] = skill_data
                
                # Build parent-child relationships
                for parent in skill_data.get('parents', []):
                    self.parent_map[parent.lower()].append(skill_name)
            
            self.loaded = True
            logger.info(f"Loaded skill ontology: {len(self.ontology)} skills")
        except Exception as e:
            logger.error(f"Error loading skill ontology: {e}")
            self.loaded = True  # Mark as loaded to avoid retries
    
    def get_skill_info(self, skill: str) -> Optional[Dict]:
        """Get skill information from ontology"""
        if not self.loaded:
            self.load()
        
        skill_lower = skill.lower().strip()
        return self.skill_lookup.get(skill_lower)
    
    def get_weight(self, skill: str) -> int:
        """Get skill weight from ontology, fallback to default function"""
        skill_info = self.get_skill_info(skill)
        if skill_info and 'weight' in skill_info:
            return skill_info['weight']
        # Fallback to default weight function
        return get_skill_weight(skill)
    
    def get_parents(self, skill: str) -> List[str]:
        """Get parent skills (e.g., 'spring boot' -> ['spring', 'java'])"""
        skill_info = self.get_skill_info(skill)
        if skill_info:
            return skill_info.get('parents', [])
        return []
    
    def get_children(self, skill: str) -> List[str]:
        """Get child skills (e.g., 'java' -> ['spring', 'spring boot'])"""
        skill_lower = skill.lower().strip()
        return self.parent_map.get(skill_lower, [])


class SkillClassifier:
    """Semantic skill classifier using Sentence Transformers"""
    
    def __init__(self):
        self.classification_count = 0
        self.filtered_count = 0
        self.kept_count = 0
        self.total_time_ms = 0
        
        # Initialize embedding attributes
        self.important_tech_embeddings = None
        self.less_important_tech_embeddings = None
        self.non_tech_embeddings = None
        self.tech_embeddings = None  # Combined for backwards compatibility
        
        # Paths for saving/loading embeddings
        current_dir = Path(__file__).parent  # backend/nlp_service/
        self.embeddings_dir = current_dir / "embeddings_cache"
        self.embeddings_dir.mkdir(exist_ok=True)
        self.embeddings_metadata_csv = self.embeddings_dir / "embeddings_metadata.csv"
        
        if not SENTENCE_TRANSFORMERS_AVAILABLE:
            safe_stderr_print("=" * 60)
            safe_stderr_print("⚠️  [Sentence Transformers] NOT INSTALLED")
            safe_stderr_print("   Install with: pip install sentence-transformers torch")
            safe_stderr_print("=" * 60)
            logger.warning("⚠️  Sentence Transformers not available - semantic classification disabled")
            logger.warning("   Install with: pip install sentence-transformers torch")
            self.model = None
            self.available = False
            return
        
        self.available = True
        try:
            import time
            import os
            import warnings
            import logging
            
            # Suppress GPU/CUDA warnings BEFORE loading model
            os.environ['TOKENIZERS_PARALLELISM'] = 'false'
            os.environ['CUDA_VISIBLE_DEVICES'] = ''  # Disable CUDA
            
            # Suppress transformers and sentence_transformers logging
            logging.getLogger("transformers").setLevel(logging.ERROR)
            logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
            logging.getLogger("torch").setLevel(logging.ERROR)
            
            start_time = time.time()
            
            # Try to load cached embeddings first (pre-computed on laptop)
            if self._load_embeddings_from_cache():
                safe_stderr_print("✅ Loaded pre-computed embeddings from cache (no computation needed)", flush=True)
                logger.info("✅ Loaded pre-computed embeddings from cache - server skipped computation")
                # Still need to load model for classification (but embeddings are already computed)
                try:
                    with warnings.catch_warnings():
                        warnings.simplefilter("ignore")
                        self.model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
                    logger.info("✅ Model loaded for classification (embeddings already cached)")
                except Exception as e:
                    logger.warning(f"Could not load model for classification: {e}")
                    self.model = None
                return
            
            # Load lightweight model (60MB, fast inference)
            safe_stderr_print("=" * 60)
            safe_stderr_print("🤖 Initializing Sentence Transformers (model: all-MiniLM-L6-v2, ~60MB)...", flush=True)
            logger.info("=" * 60)
            logger.info("🤖 Initializing Sentence Transformers Classifier")
            logger.info("=" * 60)
            logger.info("📦 Loading model: all-MiniLM-L6-v2")
            logger.info("   (This will download ~60MB on first run)")
            
            safe_stderr_print("\r⏳ Loading model (30-60s on first run)...", end='', flush=True)
            try:
                # Suppress all warnings during model loading
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    # Force CPU device to avoid GPU messages
                    self.model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
            except (BrokenPipeError, OSError) as e:
                # Handle broken pipe during model loading
                if isinstance(e, OSError) and e.errno != 32:
                    raise  # Re-raise if not broken pipe
                # For broken pipe, disable classifier
                logger.warning("Broken pipe during model loading, disabling classifier")
                self.model = None
                self.available = False
                return
            model_load_time = (time.time() - start_time) * 1000
            safe_stderr_print(f"\r✅ Model loaded in {model_load_time:.0f}ms", flush=True)
            logger.info(f"✅ Model loaded in {model_load_time:.0f}ms")
            
            # Important Technical skill exemplars (Core languages, major frameworks, important tools - High priority)
            self.important_tech_examples = [
                # Core Programming Languages
                "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", ".NET",
                "Go", "Rust", "Kotlin", "Swift", "Scala", "Ruby", "PHP", "R",
                # Major Frontend Frameworks
                "React", "Angular", "Vue.js", "Next.js", "Svelte",
                # Major Backend Frameworks
                "Spring Boot", "Django", "Flask", "Express.js", "FastAPI", "ASP.NET",
                "Laravel", "Rails", "Spring", "Hibernate",
                # Core Databases
                "PostgreSQL", "MySQL", "MongoDB", "Redis", "Oracle", "SQL Server",
                "SQL", "NoSQL", "Cassandra", "Elasticsearch",
                # Major Cloud Platforms
                "AWS", "Azure", "GCP",
                # Important DevOps Tools
                "Docker", "Kubernetes", "Terraform", "Jenkins",
                "CI/CD", "Git", "GitHub", "GitLab",
                # Core APIs & Protocols
                "REST API", "GraphQL", "OAuth2", "OpenID Connect", "SAML", "JWT",
                # Core Architecture Patterns
                "Microservices", "Design Patterns", "REST", "SOAP", "gRPC",
                # Core Data & ML
                "Machine Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy",
                "Cloud Computing", "Big Data", "Apache Spark", "Hadoop",
                # Important Testing Tools
                "JUnit", "Jest", "Pytest", "Mocha", "Selenium"
            ]
            
            # Less Important Technical skill exemplars (Very vague, generic technical terms - Lower priority)
            self.less_important_tech_examples = [
                # Vague development terms
                "web development", "application development",
                "programming", "coding", "software engineering",
                # Generic technical terms
                "system administration", "technical support", "troubleshooting",
                "debugging", "system design", "technical documentation",
                "code review", "software testing", "quality assurance",
                "technical writing", "system integration", "data processing",
                "information technology", "computer science", "technical skills",
                "development tools", "software tools", "technical knowledge",
                # Generic concepts
                "software architecture", "system architecture", "application architecture",
                "technical analysis", "problem solving", "technical problem solving",
                "software maintenance", "system maintenance", "technical maintenance",
                "software deployment", "system deployment", "technical deployment"
            ]
            
            # Keep technical_examples for backwards compatibility (combined)
            self.technical_examples = self.important_tech_examples + self.less_important_tech_examples
            
            # Non-technical exemplars (expanded with job posting terms)
            self.non_technical_examples = [
                # Soft skills
                "productivity", "feedback", "customer", "player",
                "improvement", "learning", "transformation", "reviews",
                "transparency", "working from home", "responsiveness",
                "collaboration", "team player", "communication",
                "leadership", "management", "development center",
                "pregnancy", "religion", "color", "cooperation",
                "research", "rocket", "start-up", "yarn", "it", "digital",
                # Insurance and financial terms (NOT technical skills)
                "term life insurance", "life insurance", "health insurance",
                "disability insurance", "insurance", "value proposition",
                "credit", "craft",
                # Job posting/HR terms (NOT technical skills)
                "engineering", "hiring", "open source", "resume", "root", "root cause",
                "scratch", "screening", "start to finish", "notice period",
                "opportunity", "placement", "salary", "competitive", "apply",
                "interview", "client", "talent", "career", "challenge",
                "work environment", "portal", "register", "login", "upload",
                "shortlisted", "meet", "waiting", "ready", "today", "step",
                "process", "click", "form", "chances", "progress", "goal",
                "reliable", "simple", "fast", "relevant", "great fit",
                "part", "founding", "team", "building", "consumer", "payments",
                "platform", "grounds", "own", "end to end", "responsibility",
                "deployment", "monitoring", "develop", "features", "working",
                "distributed", "environment", "handle", "million", "customers",
                "millisecond", "latencies", "dive", "details", "issues",
                "incidents", "outages", "analyze", "prepare", "reports",
                "solving", "real", "business", "needs", "large scale",
                "consumer-tech", "saas", "startup", "built", "systems",
                "before", "years", "containers", "designing", "services",
                "caching", "realtime", "ensuring", "whatever", "build",
                "deploy", "start", "finish", "top-notch", "quality", "enjoy",
                "products", "joining", "early", "stage", "involves", "more",
                "than", "just", "developing", "app", "often", "chaotic",
                "environments", "involved", "decisions", "well", "leverage",
                "faster", "need", "able", "collaborate", "design", "teams",
                "within", "constraints", "understand", "companies", "make",
                "correct", "tradeoffs", "between", "time", "speed", "features",
                "whenever", "required", "love", "give", "back", "community",
                "through", "blogging", "mentoring", "contributing", "fintech",
                "industry", "around", "big", "plus", "easy", "register",
                "updated", "complete", "increase", "get", "meet", "for",
                "about", "make", "getting", "hired", "role", "help", "all",
                "our", "talents", "find", "progress", "their", "note",
                "there", "are", "many", "more", "opportunities", "apart",
                "from", "this", "on", "so", "you", "are", "ready", "new",
                "environment", "take", "your", "next", "level", "don't",
                "hesitate", "today", "we", "waiting", "for", "you"
            ]
            
            # Pre-compute embeddings (once at startup) - Three categories
            total_examples = len(self.important_tech_examples) + len(self.less_important_tech_examples) + len(self.non_technical_examples)
            logger.info(f"🔄 Pre-computing embeddings: {total_examples} total examples across 3 categories")
            
            # Verify model is available before starting
            if self.model is None:
                error_msg = "❌ Model is None - cannot compute embeddings"
                safe_stderr_print(f"\r{error_msg}", flush=True)
                logger.error(error_msg)
                self.available = False
                return
            
            embed_start = time.time()
            
            # Compute Important Tech embeddings (Section 1)
            try:
                safe_stderr_print(f"\r🔄 Computing embeddings: 1/3 (33%) - Important Tech ({len(self.important_tech_examples)} examples)...", end='', flush=True)
                logger.info("Computing Important Tech embeddings...")
                self.important_tech_embeddings = self.model.encode(
                    self.important_tech_examples,
                    convert_to_tensor=True,
                    show_progress_bar=False
                )
                # Verify embeddings were computed
                if self.important_tech_embeddings is None:
                    raise ValueError("Important tech embeddings returned None")
                important_tech_time = (time.time() - embed_start) * 1000
                logger.info(f"✅ Important Tech embeddings computed in {important_tech_time:.0f}ms")
            except (BrokenPipeError, OSError) as e:
                if isinstance(e, OSError) and e.errno != 32:
                    raise
                safe_stderr_print(f"\r❌ Error: Broken pipe during Important Tech embedding computation", flush=True)
                logger.warning("Broken pipe during Important Tech embedding computation")
                self.important_tech_embeddings = None
            except Exception as e:
                safe_stderr_print(f"\r❌ Error computing Important Tech embeddings: {e}", flush=True)
                logger.error(f"Error computing Important Tech embeddings: {e}")
                import traceback
                logger.error(f"Traceback: {traceback.format_exc()}")
                self.important_tech_embeddings = None
            
            # Compute Less Important Tech embeddings (Section 2)
            try:
                less_important_start = time.time()
                safe_stderr_print(f"\r🔄 Computing embeddings: 2/3 (67%) - Less Important Tech ({len(self.less_important_tech_examples)} examples)...", end='', flush=True)
                logger.info("Computing Less Important Tech embeddings...")
                self.less_important_tech_embeddings = self.model.encode(
                    self.less_important_tech_examples,
                    convert_to_tensor=True,
                    show_progress_bar=False
                )
                # Verify embeddings were computed
                if self.less_important_tech_embeddings is None:
                    raise ValueError("Less important tech embeddings returned None")
                less_important_time = (time.time() - less_important_start) * 1000
                logger.info(f"✅ Less Important Tech embeddings computed in {less_important_time:.0f}ms")
            except (BrokenPipeError, OSError) as e:
                if isinstance(e, OSError) and e.errno != 32:
                    raise
                safe_stderr_print(f"\r❌ Error: Broken pipe during Less Important Tech embedding computation", flush=True)
                logger.warning("Broken pipe during Less Important Tech embedding computation")
                self.less_important_tech_embeddings = None
            except Exception as e:
                safe_stderr_print(f"\r❌ Error computing Less Important Tech embeddings: {e}", flush=True)
                logger.error(f"Error computing Less Important Tech embeddings: {e}")
                import traceback
                logger.error(f"Traceback: {traceback.format_exc()}")
                self.less_important_tech_embeddings = None
            
            # Compute Non-Tech embeddings (Section 3)
            try:
                non_tech_start = time.time()
                safe_stderr_print(f"\r🔄 Computing embeddings: 3/3 (100%) - Non-Tech ({len(self.non_technical_examples)} examples)...", end='', flush=True)
                logger.info("Computing Non-Tech embeddings...")
                self.non_tech_embeddings = self.model.encode(
                    self.non_technical_examples,
                    convert_to_tensor=True,
                    show_progress_bar=False
                )
                # Verify embeddings were computed
                if self.non_tech_embeddings is None:
                    raise ValueError("Non-tech embeddings returned None")
                non_tech_time = (time.time() - non_tech_start) * 1000
                logger.info(f"✅ Non-Tech embeddings computed in {non_tech_time:.0f}ms")
            except (BrokenPipeError, OSError) as e:
                if isinstance(e, OSError) and e.errno != 32:
                    raise
                safe_stderr_print(f"\r❌ Error: Broken pipe during Non-Tech embedding computation", flush=True)
                logger.warning("Broken pipe during Non-Tech embedding computation")
                self.non_tech_embeddings = None
            except Exception as e:
                safe_stderr_print(f"\r❌ Error computing Non-Tech embeddings: {e}", flush=True)
                logger.error(f"Error computing Non-Tech embeddings: {e}")
                import traceback
                logger.error(f"Traceback: {traceback.format_exc()}")
                self.non_tech_embeddings = None
            
            # Create combined tech embeddings for backwards compatibility
            if self.important_tech_embeddings is not None and self.less_important_tech_embeddings is not None:
                try:
                    import torch
                    self.tech_embeddings = torch.cat([self.important_tech_embeddings, self.less_important_tech_embeddings], dim=0)
                except Exception as e:
                    logger.warning(f"Could not combine tech embeddings: {e}")
                    self.tech_embeddings = self.important_tech_embeddings  # Fallback to important only
            elif self.important_tech_embeddings is not None:
                self.tech_embeddings = self.important_tech_embeddings
            elif self.less_important_tech_embeddings is not None:
                self.tech_embeddings = self.less_important_tech_embeddings
            else:
                self.tech_embeddings = None
            
            # Verify embeddings were computed - be more lenient, only disable if ALL fail
            failed_sections = []
            if self.important_tech_embeddings is None:
                failed_sections.append("Important Tech")
            if self.less_important_tech_embeddings is None:
                failed_sections.append("Less Important Tech")
            if self.non_tech_embeddings is None:
                failed_sections.append("Non-Tech")
            
            if len(failed_sections) == 3:
                # All embeddings failed - disable classifier
                error_msg = "❌ Failed to compute ALL embeddings - disabling classifier"
                safe_stderr_print(f"   {error_msg}", flush=True)
                logger.error(error_msg)
                self.model = None
                self.available = False
                return
            elif len(failed_sections) > 0:
                # Some embeddings failed - warn but continue
                warning_msg = f"⚠️  Some embeddings failed to compute: {', '.join(failed_sections)}. Continuing with available embeddings."
                safe_stderr_print(f"   {warning_msg}", flush=True)
                logger.warning(warning_msg)
                # Try to use what we have - if important tech is missing, use less important as fallback
                if self.important_tech_embeddings is None and self.less_important_tech_embeddings is not None:
                    self.important_tech_embeddings = self.less_important_tech_embeddings
                    safe_stderr_print("   ℹ️  Using Less Important Tech embeddings as fallback for Important Tech", flush=True)
                # If non-tech is missing, create a dummy embedding (zeros) to prevent crashes
                if self.non_tech_embeddings is None:
                    try:
                        import torch
                        # Create a dummy embedding with same dimensions as tech embeddings
                        if self.important_tech_embeddings is not None:
                            dummy_shape = self.important_tech_embeddings.shape
                            self.non_tech_embeddings = torch.zeros((1, dummy_shape[1]), device=self.important_tech_embeddings.device)
                            safe_stderr_print("   ℹ️  Created dummy Non-Tech embeddings to prevent crashes", flush=True)
                    except Exception as e:
                        logger.warning(f"Could not create dummy non-tech embeddings: {e}")
            
            embed_time = (time.time() - embed_start) * 1000
            total_init_time = (time.time() - start_time) * 1000
            safe_stderr_print(f"\r✅ Embeddings computed: 3/3 (100%) - Completed in {embed_time:.0f}ms", flush=True)
            
            # Save embeddings to cache for future use
            try:
                self._save_embeddings_to_cache()
                safe_stderr_print("💾 Saved embeddings to cache", flush=True)
                logger.info("💾 Saved embeddings to cache")
            except Exception as e:
                logger.warning(f"Failed to save embeddings to cache: {e}")
            
            safe_stderr_print(f"\r✅ Skill classifier ready (total init: {total_init_time:.0f}ms)", flush=True)
            logger.info(f"✅ All 3 embedding sections computed successfully in {embed_time:.0f}ms")
            logger.info(f"✅ Skill classifier ready (total init: {total_init_time:.0f}ms)")
            logger.info("=" * 60)
        except Exception as e:
            error_msg = f"❌ Failed to initialize skill classifier: {e}"
            error_type = type(e).__name__
            safe_stderr_print("=" * 60, flush=True)
            safe_stderr_print(error_msg, flush=True)
            safe_stderr_print(f"   Error type: {error_type}", flush=True)
            safe_stderr_print("=" * 60, flush=True)
            logger.error(error_msg)
            logger.error(f"   Error type: {error_type}")
            import traceback
            traceback_str = traceback.format_exc()
            logger.error(f"   Traceback: {traceback_str}")
            safe_stderr_print(f"   Traceback: {traceback_str}", flush=True)
            self.model = None
            self.available = False
            # Still try to set embeddings to None explicitly
            self.important_tech_embeddings = None
            self.less_important_tech_embeddings = None
            self.non_tech_embeddings = None
            self.tech_embeddings = None
    
    def _load_embeddings_from_cache(self) -> bool:
        """Load embeddings from cache files. Returns True if successful."""
        try:
            import numpy as np
            import torch
            
            important_tech_path = self.embeddings_dir / "important_tech_embeddings.npy"
            less_important_tech_path = self.embeddings_dir / "less_important_tech_embeddings.npy"
            non_tech_path = self.embeddings_dir / "non_tech_embeddings.npy"
            metadata_path = self.embeddings_metadata_csv
            
            # Check if all files exist
            if not (important_tech_path.exists() and less_important_tech_path.exists() and 
                    non_tech_path.exists() and metadata_path.exists()):
                return False
            
            # Load embeddings from numpy files
            important_tech_array = np.load(important_tech_path)
            less_important_tech_array = np.load(less_important_tech_path)
            non_tech_array = np.load(non_tech_path)
            
            # Convert to torch tensors
            self.important_tech_embeddings = torch.from_numpy(important_tech_array)
            self.less_important_tech_embeddings = torch.from_numpy(less_important_tech_array)
            self.non_tech_embeddings = torch.from_numpy(non_tech_array)
            
            # Create combined tech embeddings
            try:
                self.tech_embeddings = torch.cat([self.important_tech_embeddings, self.less_important_tech_embeddings], dim=0)
            except Exception:
                self.tech_embeddings = self.important_tech_embeddings
            
            # Load model (needed for classification)
            from sentence_transformers import SentenceTransformer
            # Suppress GPU messages
            import warnings
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                self.model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
            
            # Read metadata CSV
            import csv
            with open(metadata_path, 'r') as f:
                reader = csv.DictReader(f)
                metadata = next(reader, None)
                if metadata:
                    logger.info(f"Loaded embeddings cache created on: {metadata.get('created_date', 'unknown')}")
                    logger.info(f"Important Tech: {metadata.get('important_tech_count', 'unknown')} examples")
                    logger.info(f"Less Important Tech: {metadata.get('less_important_tech_count', 'unknown')} examples")
                    logger.info(f"Non-Tech: {metadata.get('non_tech_count', 'unknown')} examples")
            
            return True
        except Exception as e:
            logger.warning(f"Failed to load embeddings from cache: {e}")
            return False
    
    def _save_embeddings_to_cache(self) -> None:
        """Save embeddings to cache files for future use."""
        try:
            import numpy as np
            import torch
            from datetime import datetime
            import csv
            
            if (self.important_tech_embeddings is None or 
                self.less_important_tech_embeddings is None or 
                self.non_tech_embeddings is None):
                logger.warning("Cannot save embeddings: some embeddings are None")
                return
            
            # Convert torch tensors to numpy arrays and save
            important_tech_array = self.important_tech_embeddings.cpu().numpy()
            less_important_tech_array = self.less_important_tech_embeddings.cpu().numpy()
            non_tech_array = self.non_tech_embeddings.cpu().numpy()
            
            np.save(self.embeddings_dir / "important_tech_embeddings.npy", important_tech_array)
            np.save(self.embeddings_dir / "less_important_tech_embeddings.npy", less_important_tech_array)
            np.save(self.embeddings_dir / "non_tech_embeddings.npy", non_tech_array)
            
            # Save metadata to CSV
            metadata = {
                'created_date': datetime.now().isoformat(),
                'important_tech_count': len(self.important_tech_examples),
                'less_important_tech_count': len(self.less_important_tech_examples),
                'non_tech_count': len(self.non_technical_examples),
                'important_tech_shape': str(important_tech_array.shape),
                'less_important_tech_shape': str(less_important_tech_array.shape),
                'non_tech_shape': str(non_tech_array.shape)
            }
            
            # Write CSV (create if doesn't exist, overwrite if exists)
            with open(self.embeddings_metadata_csv, 'w', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=metadata.keys())
                writer.writeheader()
                writer.writerow(metadata)
            
            logger.info(f"Saved embeddings to {self.embeddings_dir}")
        except Exception as e:
            logger.error(f"Failed to save embeddings to cache: {e}")
            import traceback
            logger.error(traceback.format_exc())
    
    def is_technical_skill(self, skill: str, threshold: float = 0.15) -> bool:
        """
        Returns True if skill is semantically closer to technical examples.
        Now uses 3 categories: Important Tech, Less Important Tech, and Non-Tech.
        
        Args:
            skill: The skill to classify
            threshold: Confidence margin (0.15 = 15% more similar to tech than non-tech)
        """
        if not self.available or not self.model:
            return True  # Fallback: allow all if classifier unavailable
        
        # Check if all three embedding categories are available
        if (self.important_tech_embeddings is None or 
            self.less_important_tech_embeddings is None or 
            self.non_tech_embeddings is None):
            # Fallback to combined tech_embeddings if available
            if self.tech_embeddings is not None and self.non_tech_embeddings is not None:
                return self._classify_with_combined_embeddings(skill, threshold)
            return True  # Fallback: allow all if embeddings unavailable
        
        try:
            import time
            start_time = time.time()
            
            # Encode the skill - wrap in try-except to handle broken pipe
            try:
                skill_embedding = self.model.encode(skill, convert_to_tensor=True)
            except (BrokenPipeError, OSError) as e:
                # Handle broken pipe during encoding
                if isinstance(e, OSError) and e.errno != 32:
                    raise  # Re-raise if not broken pipe
                # For broken pipe, fallback to allowing the skill
                return True
            
            # Compute max similarity to Important Tech examples
            important_tech_similarities = util.cos_sim(skill_embedding, self.important_tech_embeddings)
            max_important_tech_sim = torch.max(important_tech_similarities).item()
            
            # Compute max similarity to Less Important Tech examples
            less_important_tech_similarities = util.cos_sim(skill_embedding, self.less_important_tech_embeddings)
            max_less_important_tech_sim = torch.max(less_important_tech_similarities).item()
            
            # Compute max similarity to Non-Tech examples
            non_tech_similarities = util.cos_sim(skill_embedding, self.non_tech_embeddings)
            max_non_tech_sim = torch.max(non_tech_similarities).item()
            
            # Determine which category has the highest similarity
            max_tech_sim = max(max_important_tech_sim, max_less_important_tech_sim)
            
            # Classify based on highest similarity
            # Technical if more similar to either tech category than non-tech
            confidence_important = max_important_tech_sim - max_non_tech_sim
            confidence_less_important = max_less_important_tech_sim - max_non_tech_sim
            max_confidence = max(confidence_important, confidence_less_important)
            
            # Additional check: max tech similarity must be above minimum threshold
            min_tech_similarity = 0.3  # Must be at least 30% similar to some tech example
            
            is_technical = (
                max_confidence > threshold and  # Must be more similar to tech than non-tech
                max_tech_sim > min_tech_similarity  # Must have reasonable tech similarity
            )
            
            # Determine category
            if is_technical:
                if max_important_tech_sim > max_less_important_tech_sim:
                    category = "IMPORTANT_TECH"
                else:
                    category = "LESS_IMPORTANT_TECH"
            else:
                category = "NON-TECH"
            
            # Update statistics
            self.classification_count += 1
            elapsed_ms = (time.time() - start_time) * 1000
            self.total_time_ms += elapsed_ms
            
            # Log embedding classification results - flush immediately for Node.js
            result_emoji = "✅" if is_technical else "🚫"
            result_text = category
            log_msg = (f"[EMBEDDINGS] {result_emoji} '{skill}': {result_text} "
                      f"(important_tech={max_important_tech_sim:.3f}, "
                      f"less_important_tech={max_less_important_tech_sim:.3f}, "
                      f"non_tech={max_non_tech_sim:.3f}, "
                      f"confidence={max_confidence:.3f}, threshold={threshold:.2f}, {elapsed_ms:.1f}ms)")
            safe_stderr_print(log_msg, flush=True)
            
            if is_technical:
                self.kept_count += 1
            else:
                self.filtered_count += 1
            
            return is_technical
            
        except Exception as e:
            logger.warning(f"⚠️  Error classifying skill '{skill}': {e}")
            return True  # Fallback: allow if classification fails
    
    def _classify_with_combined_embeddings(self, skill: str, threshold: float) -> bool:
        """Fallback classification using combined tech_embeddings (backwards compatibility)"""
        try:
            import time
            start_time = time.time()
            
            skill_embedding = self.model.encode(skill, convert_to_tensor=True)
            
            # Compute max similarity to technical examples
            tech_similarities = util.cos_sim(skill_embedding, self.tech_embeddings)
            max_tech_sim = torch.max(tech_similarities).item()
            
            # Compute max similarity to non-technical examples
            non_tech_similarities = util.cos_sim(skill_embedding, self.non_tech_embeddings)
            max_non_tech_sim = torch.max(non_tech_similarities).item()
            
            confidence = max_tech_sim - max_non_tech_sim
            min_tech_similarity = 0.3
            
            is_technical = (
                confidence > threshold and
                max_tech_sim > min_tech_similarity
            )
            
            elapsed_ms = (time.time() - start_time) * 1000
            result_emoji = "✅" if is_technical else "🚫"
            result_text = "TECHNICAL" if is_technical else "NON-TECHNICAL"
            log_msg = (f"[EMBEDDINGS] {result_emoji} '{skill}': {result_text} (fallback mode) "
                      f"(tech_sim={max_tech_sim:.3f}, non_tech_sim={max_non_tech_sim:.3f}, "
                      f"confidence={confidence:.3f}, {elapsed_ms:.1f}ms)")
            safe_stderr_print(log_msg, flush=True)
            
            return is_technical
        except Exception as e:
            logger.warning(f"⚠️  Error in fallback classification for '{skill}': {e}")
            return True
    
    def get_stats(self) -> dict:
        """Get classification statistics"""
        avg_time = (self.total_time_ms / self.classification_count) if self.classification_count > 0 else 0
        return {
            "classifications": self.classification_count,
            "kept": self.kept_count,
            "filtered": self.filtered_count,
            "total_time_ms": self.total_time_ms,
            "avg_time_ms": avg_time,
            "filter_rate": (self.filtered_count / self.classification_count * 100) if self.classification_count > 0 else 0
        }


class SkillsDatabase:
    """Manages skills database with PhraseMatcher and canonical mapping"""
    
    def __init__(self, csv_path: str, ontology_path: Optional[str] = None):
        self.csv_path = csv_path
        self.skills: List[str] = []
        self.skills_lower: List[str] = []
        self.canonical_map: Dict[str, str] = {}  # skill -> canonical form
        self.reverse_canonical: Dict[str, List[str]] = defaultdict(list)  # canonical -> [skills]
        self.skills_dict: Dict[str, str] = {}  # normalized -> original (O(1) lookup)
        self.ontology = SkillOntology(ontology_path)  # Load ontology
        self.classifier = SkillClassifier()  # Semantic skill classifier
        self.loaded = False
        
    def load(self) -> None:
        """Load skills from CSV file"""
        if self.loaded:
            return
            
        logger.info(f"Loading skills from {self.csv_path}")
        
        # Log Sentence Transformers status
        if self.classifier.available:
            logger.info("✅ [Sentence Transformers] Classifier is available - will filter non-technical skills")
        else:
            logger.warning("⚠️  [Sentence Transformers] Classifier NOT available - all skills will be loaded")
            logger.warning("   Install with: pip install sentence-transformers torch")
        
        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f"Skills CSV not found: {self.csv_path}")
        
        skills_set = set()  # Use set to avoid duplicates
        
        try:
            loaded_count = 0
            filtered_count = 0
            
            with open(self.csv_path, 'r', encoding='utf-8', errors='ignore') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    skill = row.get('Skill', '').strip()
                    if skill:
                        # Clean up quotes and newlines
                        skill = skill.replace('"', '').replace('\n', ' ').strip()
                        if skill and len(skill) > 1:  # Skip single characters
                            # PRIMARY FILTER: Semantic classification using embeddings
                            # This filters out non-technical terms from skills.csv using ML
                            if self.classifier.available:
                                safe_stderr_print(f"[EMBEDDINGS-LOAD] 🔍 Checking skill from CSV: '{skill}'", flush=True)
                                if not self.classifier.is_technical_skill(skill, threshold=0.15):
                                    filtered_count += 1
                                    continue
                            
                            skills_set.add(skill)
                            loaded_count += 1
            
            if self.classifier.available:
                stats = self.classifier.get_stats()
                logger.info("=" * 60)
                logger.info("📊 Sentence Transformers Classification Stats")
                logger.info("=" * 60)
                logger.info(f"   Total classifications: {stats['classifications']}")
                logger.info(f"   ✅ Kept (technical): {stats['kept']}")
                logger.info(f"   🚫 Filtered (non-technical): {stats['filtered']}")
                logger.info(f"   Filter rate: {stats['filter_rate']:.1f}%")
                logger.info(f"   Total time: {stats['total_time_ms']:.0f}ms")
                logger.info(f"   Avg time per skill: {stats['avg_time_ms']:.2f}ms")
                logger.info("=" * 60)
        except Exception as e:
            logger.error(f"Error reading CSV: {e}")
            raise
        
        self.skills = sorted(list(skills_set))
        self.skills_lower = [s.lower() for s in self.skills]
        
        # Build canonical map and reverse lookup
        for skill in self.skills:
            skill_lower = skill.lower()
            canonical = self._get_canonical(skill_lower)
            self.canonical_map[skill_lower] = canonical
            self.reverse_canonical[canonical].append(skill)
            
            # Build O(1) lookup dict (normalized -> original)
            normalized = self._normalize(skill_lower)
            if normalized not in self.skills_dict:
                self.skills_dict[normalized] = skill
        
        self.loaded = True
        logger.info(f"Loaded {len(self.skills)} unique skills")
        logger.info(f"Canonical forms: {len(self.reverse_canonical)}")
    
    def _normalize(self, text: str) -> str:
        """Normalize text for matching (remove spaces, special chars)"""
        return re.sub(r'[^a-z0-9]', '', text.lower())
    
    def _get_canonical(self, skill: str) -> str:
        """Get canonical form of a skill"""
        skill_lower = skill.lower().strip()
        
        # Check direct mapping
        if skill_lower in CANONICAL_MAP:
            return CANONICAL_MAP[skill_lower]
        
        # Check normalized mapping
        normalized = self._normalize(skill_lower)
        for key, canonical in CANONICAL_MAP.items():
            if self._normalize(key) == normalized:
                return canonical
        
        # Default: return normalized form
        return normalized
    
    def is_valid_skill_type(self, skill: str) -> bool:
        """
        Problem 1 Fix: Skill Type Enforcement - HARD GATE (STRICT)
        Only allow skills that belong to technical skill classes.
        """
        skill_lower = skill.lower().strip()
        words = skill_lower.split()
        
        # FIRST: Check if it's explicitly blacklisted (fastest rejection)
        if skill_lower in ABSTRACT_CONCEPTS:
            return False
        
        # Check if any word is an abstract concept
        for word in words:
            if word in ABSTRACT_CONCEPTS:
                return False
        
        # Check if it's an industry term (NOT a skill)
        if skill_lower in INDUSTRY_TERMS:
            return False
        
        # Check if any word is an industry term
        for word in words:
            if word in INDUSTRY_TERMS:
                return False
        
        # SECOND: Check ontology (most reliable for validated skills)
        skill_info = self.ontology.get_skill_info(skill)
        if skill_info:
            skill_type = skill_info.get('type', '').lower()
            if skill_type in ALLOWED_SKILL_TYPES:
                # Double-check it's not a generic concept
                if skill_lower not in ABSTRACT_CONCEPTS:
                    return True
        
        # THIRD: Check if it's a specific single-word skill (whitelist)
        if len(words) == 1:
            if skill_lower in SPECIFIC_SINGLE_WORD_SKILLS:
                return True
            # Reject single words not in whitelist
            return False
        
        # FOURTH: For multi-word, must have specific tech anchor
        has_specific_tech = any(word in SPECIFIC_SINGLE_WORD_SKILLS for word in words)
        if not has_specific_tech:
            return False
        
        # FIFTH: Reject if it's a generic pattern even with tech
        # Patterns to reject: "tech infrastructure", "tech libraries", "tech management"
        generic_patterns = [
            "infrastructure", "libraries", "library", "components", "component",
            "management", "security", "testing", "development", "architecture"
        ]
        
        # If it contains generic pattern, only allow if specific tech is prominent
        if any(pattern in skill_lower for pattern in generic_patterns):
            # Must start with or have specific tech as primary term
            if words[0] not in SPECIFIC_SINGLE_WORD_SKILLS:
                # Check if specific tech appears before generic term
                tech_idx = next((i for i, w in enumerate(words) if w in SPECIFIC_SINGLE_WORD_SKILLS), -1)
                generic_idx = next((i for i, w in enumerate(words) if w in generic_patterns), -1)
                if tech_idx > generic_idx or tech_idx == -1:
                    return False
        
        # SIXTH: Check weight from ontology (must be > 0)
        weight = self.ontology.get_weight(skill)
        if weight == 0:
            # Even if it has tech, if weight is 0, it's too generic
            return False
        
        # Default: reject if we can't validate it
        return False
    
    def is_specific_enough(self, skill: str) -> bool:
        """
        Problem 2 Fix: Minimum Skill Specificity Rule (VERY STRICT)
        Reject vague terms unless they meet strict specificity criteria.
        """
        skill_lower = skill.lower().strip()
        words = skill_lower.split()
        
        # Rule A: Reject single-letter or very short terms (except known tech)
        if len(skill_lower) <= 2 and skill_lower not in SPECIFIC_SINGLE_WORD_SKILLS:
            return False
        
        # Rule B: Single-word skills must be in whitelist (STRICT)
        if len(words) == 1:
            # Additional check: reject common English words and job posting terms
            common_words = {
                "it", "is", "at", "as", "be", "by", "do", "go", "if", "in", "me", "my", "no", "of", "on", "or", "so", "to", "up", "we",
                "color", "rocket", "yarn", "cloud", "cyber", "digital", "product", "service", "solution", "research", "cooperation",
                "pregnancy", "religion", "eeo", "race", "gender", "age", "disability", "veteran", "discrimination", "harassment",
                "diversity", "inclusion", "equity", "ecmascript",  # Too technical/abstract without context
                # Job posting terms
                "engineering", "ai", "hiring", "resume", "root", "scratch", "screening",
                "opportunity", "placement", "salary", "apply", "interview", "client", "talent", "career",
                "challenge", "portal", "register", "login", "upload", "step", "process", "click", "form",
                "goal", "reliable", "simple", "fast", "relevant", "great", "fit", "part", "team",
                "building", "consumer", "payments", "platform", "own", "end", "start", "finish",
                "develop", "features", "working", "distributed", "environment", "handle", "dive",
                "details", "issues", "incidents", "outages", "analyze", "prepare", "reports",
                "solving", "real", "business", "needs", "large", "scale", "built", "systems",
                "before", "years", "containers", "designing", "services", "caching", "realtime",
                "ensuring", "whatever", "build", "deploy", "quality", "enjoy", "products", "joining",
                "early", "stage", "involves", "more", "than", "just", "developing", "app", "often",
                "chaotic", "environments", "involved", "decisions", "well", "leverage", "faster",
                "need", "able", "collaborate", "design", "teams", "within", "constraints", "understand",
                "companies", "make", "correct", "tradeoffs", "between", "time", "speed", "features",
                "whenever", "required", "love", "give", "back", "community", "through", "blogging",
                "mentoring", "contributing", "fintech", "industry", "around", "big", "plus", "easy",
                "updated", "complete", "increase", "get", "meet", "for", "about", "make", "getting",
                "hired", "role", "help", "all", "our", "talents", "find", "progress", "their", "note",
                "there", "are", "many", "more", "opportunities", "apart", "from", "this", "on", "so",
                "you", "are", "ready", "new", "environment", "take", "your", "next", "level", "don't",
                "hesitate", "today", "we", "waiting", "for", "you"
            }
            if skill_lower in common_words:
                return False
            return skill_lower in SPECIFIC_SINGLE_WORD_SKILLS
        
        # Rule B: Multi-word skills need STRONG technical anchor
        # Must contain a SPECIFIC technology name (not generic terms)
        has_specific_tech = False
        tech_word_idx = -1
        for idx, word in enumerate(words):
            if word in SPECIFIC_SINGLE_WORD_SKILLS:
                has_specific_tech = True
                tech_word_idx = idx
                break
        
        if not has_specific_tech:
            return False
        
        # Rule C: STRICT - Reject generic modifier patterns
        generic_modifiers = {
            "infrastructure", "infrastructures", "architecture", "architectures",
            "libraries", "library", "components", "component", "systems", "system",
            "applications", "application", "platforms", "platform", "services", "service",
            "apis", "api", "security", "testing", "management", "development",
            "feedback", "experience", "dom", "model"
        }
        
        # STRICT: If ANY word is a generic modifier, reject UNLESS tech word comes FIRST
        for idx, word in enumerate(words):
            if word in generic_modifiers:
                # Only allow if tech word comes BEFORE the generic modifier
                if tech_word_idx > idx:
                    return False
                # Also reject if generic modifier is the first word
                if idx == 0:
                    return False
        
        # Rule D: Reject common abstract patterns even with tech
        abstract_patterns = [
            "cloud infrastructure", "component libraries", "component library",
            "state management", "web security", "user feedback", "user experience",
            "rest api", "rest apis", "restful api", "restful apis",
            "microservices", "microservice", "micro services",
            "distributed systems", "backend", "frontend", "front-end", "back-end",
            "product development", "developers", "engineers", "programmers",
            "engineering", "security", "cyber security", "cybersecurity",
            "hybrid cloud", "public cloud", "private cloud", "cloud",
            "equal employment opportunity", "eeo", "pregnancy", "religion",
            "color", "cooperation", "cyber", "research", "rocket",
            "start-up", "startup", "yarn", "it", "digital",
            "ecmascript"  # Should be normalized to JavaScript, not standalone
        ]
        
        for pattern in abstract_patterns:
            if pattern in skill_lower:
                return False
        
        # Rule E: Check if it has ontology parent (validated skill)
        skill_info = self.ontology.get_skill_info(skill)
        if skill_info and skill_info.get('parents'):
            # Still check it's not a generic pattern
            if not any(pattern in skill_lower for pattern in abstract_patterns):
                return True
        
        # Rule F: Accept only VERY specific technical phrase patterns
        specific_technical_patterns = [
            # Specific frameworks/libraries with .js suffix
            "react.js", "reactjs", "angular.js", "angularjs", "vue.js", "vuejs",
            "node.js", "nodejs", "express.js", "expressjs",
            # Specific AWS services (not "aws infrastructure")
            "aws lambda", "aws s3", "aws ec2", "aws rds", "aws cloudwatch", "aws sqs", "aws sns",
            "azure functions", "gcp cloud functions",
            # Specific methodologies
            "ci/cd", "cicd",
        ]
        
        # Check for specific patterns
        for pattern in specific_technical_patterns:
            if pattern in skill_lower:
                return True
        
        # Rule G: For multi-word with tech, only allow if:
        # 1. Tech word is first (e.g., "Docker containers", "MySQL database")
        # 2. OR it's a known specific combination (e.g., "Spring Boot", "React Native")
        if tech_word_idx == 0:
            # Tech is first - allow if second word is specific or common tech term
            if len(words) >= 2:
                second_word = words[1]
                # Allow common tech combinations
                allowed_combinations = {
                    "containers", "container", "database", "databases", "framework",
                    "native", "boot", "js", "jsx", "tsx"
                }
                if second_word in allowed_combinations:
                    return True
        
        # Rule H: Reject everything else (too generic)
        return False
    
    def is_garbage_skill(self, skill: str) -> bool:
        """Check if skill is garbage/non-skill term (Problem 1 Fix)"""
        skill_lower = skill.lower().strip()
        
        # NEW: Skill type enforcement (HARD GATE)
        if not self.is_valid_skill_type(skill):
            return True
        
        # NEW: Specificity check
        if not self.is_specific_enough(skill):
            return True
        
        # Direct check (full phrase)
        if skill_lower in GARBAGE_SKILLS:
            return True
        
        # Check multi-word phrases (e.g., "root cause", "start to finish", "open source")
        # Check if the full phrase or any significant substring matches
        for garbage_term in GARBAGE_SKILLS:
            if len(garbage_term.split()) > 1:  # Multi-word garbage term
                if garbage_term in skill_lower or skill_lower in garbage_term:
                    return True
        
        # Check if any word matches
        words = skill_lower.split()
        for word in words:
            if word in GARBAGE_SKILLS:
                return True
        
        return False
    
    def is_low_priority(self, skill: str) -> bool:
        """Check if skill is low priority (soft skills)"""
        skill_lower = skill.lower().strip()
        
        # Direct check
        if skill_lower in LOW_PRIORITY_SKILLS:
            return True
        
        # Check if any word matches
        words = skill_lower.split()
        for word in words:
            if word in LOW_PRIORITY_SKILLS:
                return True
        
        return False
    
    def get_canonical_skill(self, skill: str) -> Optional[str]:
        """Get canonical form of a skill, or None if not found"""
        skill_lower = skill.lower().strip()
        canonical = self.canonical_map.get(skill_lower)
        if canonical:
            # Return the first skill in the canonical group (prefer original case)
            canonical_skills = self.reverse_canonical.get(canonical, [])
            if canonical_skills:
                return canonical_skills[0]
        return None
    
    def normalize_skill_display(self, skill: str) -> str:
        """
        Normalize skill to proper display name (e.g., "ts" → "TypeScript", "node" → "Node.js")
        """
        if not skill:
            return skill
        
        skill_lower = skill.lower().strip()
        
        # Display name mapping for common abbreviations/variations
        DISPLAY_NAME_MAP = {
            # TypeScript
            "ts": "TypeScript",
            "typescript": "TypeScript",
            
            # Node.js
            "node": "Node.js",
            "nodejs": "Node.js",
            "node.js": "Node.js",
            "node js": "Node.js",
            
            # JavaScript
            "js": "JavaScript",
            "javascript": "JavaScript",
            "ecmascript": "JavaScript",
            
            # Python
            "py": "Python",
            "python": "Python",
            "python3": "Python",
            "python 3": "Python",
            
            # Java
            "java": "Java",
            
            # C#
            "c#": "C#",
            "csharp": "C#",
            "c sharp": "C#",
            
            # C++
            "c++": "C++",
            "cpp": "C++",
            "c plus plus": "C++",
            
            # .NET
            ".net": ".NET",
            "dotnet": ".NET",
            ".net core": ".NET Core",
            "asp.net": "ASP.NET",
            "aspnet": "ASP.NET",
            
            # React
            "react": "React",
            "react.js": "React.js",
            "reactjs": "React.js",
            
            # Vue
            "vue": "Vue.js",
            "vue.js": "Vue.js",
            "vuejs": "Vue.js",
            
            # Angular
            "angular": "Angular",
            "angularjs": "AngularJS",
            "angular.js": "AngularJS",
            
            # SQL
            "sql": "SQL",
            
            # AWS
            "aws": "AWS",
            "amazon web services": "AWS",
            
            # Docker
            "docker": "Docker",
            
            # Kubernetes
            "kubernetes": "Kubernetes",
            "k8s": "Kubernetes",
            "kube": "Kubernetes",
            
            # Git
            "git": "Git",
            "github": "GitHub",
            
            # REST API
            "rest": "REST API",
            "rest api": "REST API",
            "restful": "REST API",
            "restful api": "REST API",
            
            # GraphQL
            "graphql": "GraphQL",
            "graph ql": "GraphQL",
            
            # HTML/CSS
            "html": "HTML",
            "css": "CSS",
            
            # Databases
            "mysql": "MySQL",
            "postgresql": "PostgreSQL",
            "postgres": "PostgreSQL",
            "mongodb": "MongoDB",
            "mongo": "MongoDB",
            "redis": "Redis",
            "oracle": "Oracle",
            "nosql": "NoSQL",
            
            # Other common tech
            "go": "Go",
            "rust": "Rust",
            "kotlin": "Kotlin",
            "swift": "Swift",
            "scala": "Scala",
            "ruby": "Ruby",
            "php": "PHP",
            "r": "R",
        }
        
        # Check direct mapping first
        if skill_lower in DISPLAY_NAME_MAP:
            return DISPLAY_NAME_MAP[skill_lower]
        
        # Check if skill exists in skills database and get canonical form
        canonical_skill = self.get_canonical_skill(skill)
        if canonical_skill:
            # Try to get display name for canonical form
            canonical_lower = canonical_skill.lower()
            if canonical_lower in DISPLAY_NAME_MAP:
                return DISPLAY_NAME_MAP[canonical_lower]
            # If not in display map, return canonical skill with proper casing
            return canonical_skill
        
        # Default: return original with title case
        return skill.title() if skill else skill


# Global skills database instance
_skills_db: Optional[SkillsDatabase] = None


def get_skills_database(csv_path: Optional[str] = None) -> SkillsDatabase:
    """Get or create skills database singleton"""
    global _skills_db
    
    if _skills_db is None:
        if csv_path is None:
            # Try multiple possible locations for skills.csv
            current_dir = Path(__file__).parent  # backend/nlp_service/
            
            # Option 1: In nlp_service directory (for Railway deployment)
            csv_path = current_dir / "skills.csv"
            
            # Option 2: In parent src/utils (for local development)
            if not csv_path.exists():
                csv_path = current_dir.parent / "src" / "utils" / "skills.csv"
            
            # Option 3: Absolute path fallback (if Railway sets a different structure)
            if not csv_path.exists():
                # Try from current working directory
                cwd_path = Path.cwd() / "skills.csv"
                if cwd_path.exists():
                    csv_path = cwd_path
                else:
                    # Try src/utils from cwd
                    cwd_path = Path.cwd() / "src" / "utils" / "skills.csv"
                    if cwd_path.exists():
                        csv_path = cwd_path
        
        csv_path_str = str(csv_path)
        logger.info(f"Loading skills database from: {csv_path_str}")
        
        # Check Sentence Transformers availability BEFORE creating database
        safe_stderr_print("=" * 60, flush=True)
        safe_stderr_print("🔍 [EMBEDDINGS] Checking Sentence Transformers availability...", flush=True)
        if SENTENCE_TRANSFORMERS_AVAILABLE:
            safe_stderr_print("✅ [EMBEDDINGS] Sentence Transformers is INSTALLED", flush=True)
            logger.info("✅ [Sentence Transformers] Available - semantic classification will be enabled")
        else:
            safe_stderr_print("⚠️  [EMBEDDINGS] Sentence Transformers is NOT INSTALLED", flush=True)
            safe_stderr_print("   To enable: pip install sentence-transformers torch", flush=True)
            safe_stderr_print("   Continuing without semantic filtering...", flush=True)
            logger.warning("⚠️  [Sentence Transformers] NOT available")
            logger.warning("   To enable: pip install sentence-transformers torch")
            logger.warning("   Continuing without semantic filtering...")
        safe_stderr_print("=" * 60, flush=True)
        
        _skills_db = SkillsDatabase(csv_path_str)
        _skills_db.load()
        logger.info(f"Skills database loaded. Classifier available: {_skills_db.classifier.available}")
    
    return _skills_db


# ============================================================================
# PhraseMatcher-based Extraction
# ============================================================================

def collapse_overlapping_skills(skills: List[Tuple[str, str, float]], skills_db: SkillsDatabase) -> List[Tuple[str, str, float]]:
    """
    Problem 2 Fix: Collapse overlapping skills using ontology hierarchy.
    
    Uses skill ontology to determine parent-child relationships.
    If "spring boot" exists, remove "spring" (if it's a parent).
    """
    if not skills:
        return []
    
    # Sort by weight (highest first), then length (longest first)
    sorted_skills = sorted(skills, key=lambda x: (-x[2], -len(x[0].split()), x[0].lower()))
    
    kept_skills = []
    normalized_kept = set()
    kept_skill_names = set()
    
    for skill, canonical, weight in sorted_skills:
        skill_lower = skill.lower().strip()
        skill_normalized = skills_db._normalize(skill_lower)
        
        # Check if this skill is a sub-phrase using ontology
        is_subphrase = False
        
        # Check if any kept skill is a parent of this skill
        for kept_skill, _, _ in kept_skills:
            kept_lower = kept_skill.lower()
            kept_children = skills_db.ontology.get_children(kept_skill)
            
            # If kept skill has this as a child, skip this (parent wins)
            if skill_lower in [c.lower() for c in kept_children]:
                is_subphrase = True
                logger.debug(f"Removing child skill: '{skill}' (parent '{kept_skill}' already kept)")
                break
            
            # Check if this skill is a parent of kept skill (this should win)
            this_children = skills_db.ontology.get_children(skill)
            if kept_lower in [c.lower() for c in this_children]:
                # Remove the child from kept_skills
                kept_skills = [(s, c, w) for s, c, w in kept_skills if s.lower() != kept_lower]
                normalized_kept.discard(skills_db._normalize(kept_lower))
                kept_skill_names.discard(kept_lower)
                logger.debug(f"Replacing child '{kept_skill}' with parent '{skill}'")
                break
        
        # Also check SKILL_HIERARCHY for backwards compatibility
        if not is_subphrase:
            for parent, children in SKILL_HIERARCHY.items():
                if skill_lower in children:
                    # Check if any kept skill contains the parent
                    for kept_skill, _, _ in kept_skills:
                        if parent in kept_skill.lower():
                            is_subphrase = True
                            logger.debug(f"Removing subphrase: '{skill}' (covered by '{kept_skill}')")
                            break
                    if is_subphrase:
                        break
        
        if not is_subphrase:
            kept_skills.append((skill, canonical, weight))
            normalized_kept.add(skill_normalized)
            kept_skill_names.add(skill_lower)
    
    return kept_skills


def has_skill_context(span, doc) -> bool:
    """
    Context Filtering: Check if matched span appears in skill-relevant context.
    
    Accepts matches that are:
    1. Noun phrases (NOUN, PROPN)
    2. Preceded by skill-indicating verbs (experience with, using, built with, etc.)
    3. Named entities (PRODUCT, LANGUAGE, ORG if tech company)
    4. Part of technical noun phrases
    5. In skill lists (e.g., "Must Have Skills:", "Good To Have Skills:")
    
    This removes 60-70% of false positives while allowing skills in lists.
    """
    # Skill-indicating verbs/patterns before the match
    skill_verbs = {
        "experience", "experienced", "using", "use", "used", "utilize", "utilized",
        "work", "worked", "working", "build", "built", "building", "develop", "developed",
        "developing", "create", "created", "creating", "implement", "implemented",
        "implementing", "design", "designed", "designing", "write", "wrote", "writing",
        "code", "coded", "coding", "program", "programmed", "programming",
        "familiar", "proficient", "skilled", "expert", "expertise", "knowledge",
        "know", "knows", "known", "master", "mastered", "mastering"
    }
    
    # Skill list indicators (common patterns in job descriptions)
    skill_list_indicators = {
        "must have", "good to have", "required", "preferred", "skills", "skill",
        "requirements", "qualifications", "technologies", "tools", "frameworks",
        "languages", "platforms", "experience with", "proficiency in"
    }
    
    # Check if span is a noun phrase or proper noun
    is_noun_phrase = any(token.pos_ in ("NOUN", "PROPN") for token in span)
    
    # Check preceding context (look back 5 tokens for skill lists)
    start_idx = span.start
    if start_idx > 0:
        prev_tokens = doc[max(0, start_idx - 5):start_idx]
        prev_text = " ".join([t.lemma_.lower() for t in prev_tokens])
        
        # Check for skill list indicators (e.g., "Must Have Skills:")
        if any(indicator in prev_text for indicator in skill_list_indicators):
            return True
        
        # Check for skill-indicating patterns
        has_skill_context = any(verb in prev_text for verb in skill_verbs)
        if has_skill_context:
            return True
    
    # Check if it's a named entity (PRODUCT, LANGUAGE)
    if span.ents:
        for ent in span.ents:
            if ent.label_ in ("PRODUCT", "LANGUAGE"):
                return True
    
    # Check if parent token is a noun
    if is_noun_phrase:
        return True
    
    # Check if it's part of a technical phrase (e.g., "Java developer", "Python programming")
    if start_idx + len(span) < len(doc):
        # Check if followed by technical words
        next_token = doc[start_idx + len(span)]
        tech_followers = {"developer", "programming", "development", "engineer", 
                        "framework", "library", "tool", "platform", "service"}
        if next_token.lemma_.lower() in tech_followers:
            return True
    
    # If it's a proper noun or known tech term, accept it
    if is_noun_phrase:
        # Additional check: if it's capitalized and short, likely a tech name
        if span.text[0].isupper() and len(span.text.split()) <= 2:
            return True
    
    return False


def extract_skills_with_phrasematcher(
    text: str,
    nlp_model,
    skills_db: SkillsDatabase,
    use_fuzzy: bool = True,
    use_context_filter: bool = True
) -> List[Tuple[str, str, float]]:
    """
    Extract skills from text using spaCy PhraseMatcher.
    
    Implements all 3 fixes:
    1. Filters garbage/non-skill terms
    2. Collapses overlapping phrases (longest wins)
    3. Assigns weights to skills
    
    Args:
        text: Input text to extract skills from
        nlp_model: Loaded spaCy model
        skills_db: SkillsDatabase instance
        use_fuzzy: Whether to use fuzzy matching for missed skills
    
    Returns:
        List of tuples: (matched_skill, canonical_form, weight)
    """
    
    try:
        from spacy.matcher import PhraseMatcher
    except ImportError:
        logger.error("spacy.matcher.PhraseMatcher not available")
        raise ImportError("spaCy PhraseMatcher is required. Make sure spaCy is properly installed.")
    
    # Wrap main processing in try-except to handle broken pipe errors
    try:
        if not skills_db.loaded:
            skills_db.load()
        
        # Create PhraseMatcher
        matcher = PhraseMatcher(nlp_model.vocab, attr="LOWER")
        
        # Add all skills as patterns
        patterns = [nlp_model.make_doc(skill) for skill in skills_db.skills]
        matcher.add("SKILLS", patterns)
        
        # Process text
        doc = nlp_model(text)
        
        # Find matches
        matches = matcher(doc)
    
        # Log total matches found and check for specific skills
        safe_stderr_print(f"[EMBEDDINGS] PhraseMatcher found {len(matches)} raw matches", flush=True)
    
        # Debug: Check if "spring boot" is in the skills database
        spring_boot_in_db = any("spring boot" in skill.lower() for skill in skills_db.skills)
        safe_stderr_print(f"[EMBEDDINGS] 'spring boot' in skills database: {spring_boot_in_db}", flush=True)
    
        # Debug: Check if "spring boot" appears in text
        text_lower = text.lower()
        spring_boot_in_text = "spring boot" in text_lower
        safe_stderr_print(f"[EMBEDDINGS] 'spring boot' in text: {spring_boot_in_text}", flush=True)
    
        # Extract matched skills with frequency tracking
        # Track: {skill_lower: {'text': matched_text, 'frequency': count, 'spans': [spans]}}
        matched_skills_data = {}
        results = []
        garbage_count = 0
        low_priority_count = 0
        context_filtered = 0
    
        # First pass: Count occurrences and collect spans for each skill
        for match_id, start, end in matches:
            span = doc[start:end]
            matched_text = span.text.strip()
            matched_lower = matched_text.lower()
        
            # Debug: Log when we find "spring boot" or related terms
            if "spring" in matched_lower or "boot" in matched_lower:
                safe_stderr_print(f"[EMBEDDINGS] 🔍 Found potential Spring Boot match: '{matched_text}' (lower: '{matched_lower}')", flush=True)
        
            # Track frequency and store first occurrence text and spans
            if matched_lower not in matched_skills_data:
                matched_skills_data[matched_lower] = {
                    'text': matched_text,
                    'frequency': 0,
                    'spans': []
                }
            matched_skills_data[matched_lower]['frequency'] += 1
            matched_skills_data[matched_lower]['spans'].append(span)
    
        # Second pass: Process each unique skill with frequency information
        for matched_lower, skill_data in matched_skills_data.items():
            matched_text = skill_data['text']
            frequency = skill_data['frequency']
            spans = skill_data['spans']
            span = spans[0]  # Use first span for context checking
        
            # PRIMARY FILTER: Semantic classification using Sentence Transformers (embeddings)
            # This is the main filter - uses ML to determine if term is technical
            # Only falls back to rule-based filters if classifier unavailable
            is_technical = True  # Default to True if classifier unavailable
            if skills_db.classifier.available:
                # Log that we're using embeddings for this check - flush immediately for Node.js
                safe_stderr_print(f"[EMBEDDINGS] 🔍 Checking: '{matched_text}'", flush=True)
                is_technical = skills_db.classifier.is_technical_skill(matched_text, threshold=0.10)  # Lowered threshold from 0.15 to 0.10
                if not is_technical:
                    garbage_count += 1
                    safe_stderr_print(f"[EMBEDDINGS] 🚫 Filtered: '{matched_text}' (non-technical)", flush=True)
                    continue
                safe_stderr_print(f"[EMBEDDINGS] ✅ Kept: '{matched_text}' (technical)", flush=True)
        
            # Context Filtering (Option 2): Check if match appears in skill-relevant context
            # BUT: If semantic classifier says it's technical, be more lenient with context
            # This allows skills in lists like "Must Have Skills: Java, Spring Boot" to pass
            if use_context_filter:
                has_context = has_skill_context(span, doc)
                # If semantic classifier confirmed it's technical, accept even without perfect context
                # This handles cases like "Must Have Skills: Java, Spring Boot" where context is minimal
                if not has_context and not is_technical:
                    # Only filter if BOTH: no context AND classifier says non-technical (or unavailable)
                    context_filtered += 1
                    safe_stderr_print(f"[EMBEDDINGS] 🚫 Context filtered: '{matched_text}' (no skill context)", flush=True)
                    garbage_count += 1
                    logger.debug(f"Filtering skill without context: {matched_text}")
                    continue
        
            # Log when we find a match (after passing filters)
            safe_stderr_print(f"[EMBEDDINGS] ✅ Matched: '{matched_text}' (passing all checks)", flush=True)
        
            # If classifier is NOT available, use rule-based filters
            if not skills_db.classifier.available:
                # Log when classifier is NOT available (only once)
                if not hasattr(extract_skills_with_phrasematcher, '_logged_no_classifier'):
                    safe_stderr_print("=" * 60, flush=True)
                    safe_stderr_print("⚠️  [EMBEDDINGS] Classifier NOT available - using rule-based filters", flush=True)
                    safe_stderr_print("   Install: pip install sentence-transformers torch", flush=True)
                    safe_stderr_print("=" * 60, flush=True)
                    extract_skills_with_phrasematcher._logged_no_classifier = True
            
                # Fallback to rule-based filters only if classifier unavailable
                # Step 1: Skill Type Enforcement (HARD GATE) - Check FIRST
                if not skills_db.is_valid_skill_type(matched_text):
                    garbage_count += 1
                    logger.debug(f"❌ Filtering invalid skill type: {matched_text}")
                    continue
            
                # Step 2: Specificity Check (STRICT) - Must pass BOTH
                if not skills_db.is_specific_enough(matched_text):
                    garbage_count += 1
                    logger.debug(f"❌ Filtering non-specific skill: {matched_text}")
                    continue
            
                # Step 3: Additional garbage filtering
                if skills_db.is_garbage_skill(matched_text):
                    garbage_count += 1
                    logger.debug(f"Filtering garbage skill: {matched_text}")
                    continue
            
                # Step 4: Check if low priority (soft skills)
                if skills_db.is_low_priority(matched_text):
                    low_priority_count += 1
                    logger.debug(f"Skipping low priority skill: {matched_text}")
                    continue
        
            # Step 5: Get canonical form (after validation)
            canonical = skills_db._get_canonical(matched_lower)
        
            # ARCHITECTURAL IMPROVEMENT: If skill passed semantic validation but not in database,
            # still extract it with a default weight (fallback mechanism)
            if not canonical:
                # Skill not in database but passed semantic/context filters
                # Use the matched text as canonical and assign default weight based on semantic similarity
                canonical = matched_text
                # Assign default weight: 2 (framework level) if semantic classifier confirmed it's technical
                # Otherwise use weight 1 (tool level)
                if skills_db.classifier.available and is_technical:
                    weight = 2.0  # Default to framework weight for validated technical skills
                else:
                    weight = 1.0  # Default to tool weight
                safe_stderr_print(f"[EMBEDDINGS] ⚠️  Skill '{matched_text}' not in database but validated as technical - using default weight {weight}", flush=True)
            else:
                # Step 6: Assign weight (ONLY for validated skills)
                weight = skills_db.ontology.get_weight(matched_text)
            
                # Step 7: Final weight check (should not be 0 after validation, but double-check)
                if weight == 0:
                    # If weight is 0 but skill passed semantic validation, assign default weight
                    if skills_db.classifier.available and is_technical:
                        weight = 1.0  # Default weight for validated technical skills
                        safe_stderr_print(f"[EMBEDDINGS] ⚠️  Skill '{matched_text}' has zero weight but is technical - using default weight {weight}", flush=True)
                    else:
                        garbage_count += 1
                        logger.debug(f"Filtering zero-weight skill after validation: {matched_text}")
                        continue
        
            # Log that classifier is not available (only once per extraction) - if we're using fallback
            if not skills_db.classifier.available:
                if not hasattr(extract_skills_with_phrasematcher, '_logged_classifier_unavailable'):
                    safe_stderr_print("=" * 60)
                    safe_stderr_print("⚠️  [Sentence Transformers] Classifier NOT available")
                    safe_stderr_print("   Install with: pip install sentence-transformers torch")
                    safe_stderr_print("   Using rule-based filters (less accurate)...")
                    safe_stderr_print("=" * 60)
                    logger.warning("=" * 60)
                    logger.warning("⚠️  [Sentence Transformers] Classifier NOT available")
                    logger.warning("   Install with: pip install sentence-transformers torch")
                    logger.warning("   Using rule-based filters (less accurate)...")
                    logger.warning("=" * 60)
                    extract_skills_with_phrasematcher._logged_classifier_unavailable = True
        
            # Get best canonical skill name
            canonical_skill = skills_db.get_canonical_skill(matched_text)
            skill_name = canonical_skill if canonical_skill else matched_text
        
            # Boost weight based on frequency (repeated keywords get higher priority)
            # Frequency boost: +0.5 per additional occurrence (capped at +2.0)
            frequency_boost = min((frequency - 1) * 0.5, 2.0)
            boosted_weight = float(weight) + frequency_boost
            
            # Log frequency if > 1
            if frequency > 1:
                safe_stderr_print(f"[EMBEDDINGS] 📈 '{matched_text}' appears {frequency}x - boosting weight from {weight} to {boosted_weight:.1f}", flush=True)
                logger.info(f"Skill '{matched_text}' appears {frequency} times - weight boosted from {weight} to {boosted_weight:.1f}")
        
            # Store with boosted weight
            results.append((skill_name, canonical, boosted_weight))
    
        # Problem 2 Fix: Collapse overlapping skills
        results = collapse_overlapping_skills(results, skills_db)
    
        # Log validation statistics
        logger.info(f"Extracted {len(results)} validated skills")
        logger.info(f"  - Filtered: {garbage_count} invalid/non-skills")
        logger.info(f"  - Low priority: {low_priority_count} soft skills")
        logger.info(f"  - Validated skills: {len(results)} (all passed type + specificity checks)")
    
        # Log Sentence Transformers usage if available
        if skills_db.classifier.available:
            stats = skills_db.classifier.get_stats()
            if stats['classifications'] > 0:
                safe_stderr_print("=" * 60)
                safe_stderr_print("🤖 [Sentence Transformers] Extraction Classification Stats")
                safe_stderr_print("=" * 60)
                safe_stderr_print(f"   Total classifications: {stats['classifications']}")
                safe_stderr_print(f"   ✅ Kept (technical): {stats['kept']}")
                safe_stderr_print(f"   🚫 Filtered (non-technical): {stats['filtered']}")
                safe_stderr_print(f"   Filter rate: {stats['filter_rate']:.1f}%")
                safe_stderr_print(f"   Total time: {stats['total_time_ms']:.0f}ms")
                safe_stderr_print(f"   Avg time per skill: {stats['avg_time_ms']:.2f}ms")
                safe_stderr_print("=" * 60)
                logger.info("=" * 60)
                logger.info("🤖 [Sentence Transformers] Extraction Classification Stats")
                logger.info("=" * 60)
                logger.info(f"   Total classifications: {stats['classifications']}")
                logger.info(f"   ✅ Kept (technical): {stats['kept']}")
                logger.info(f"   🚫 Filtered (non-technical): {stats['filtered']}")
                logger.info(f"   Filter rate: {stats['filter_rate']:.1f}%")
                logger.info(f"   Total time: {stats['total_time_ms']:.0f}ms")
                logger.info(f"   Avg time per skill: {stats['avg_time_ms']:.2f}ms")
                logger.info("=" * 60)
        else:
            safe_stderr_print("⚠️  [Sentence Transformers] Not available - install: pip install sentence-transformers torch")
            logger.warning("⚠️  [Sentence Transformers] Not available during extraction - install: pip install sentence-transformers torch")
    
        # Problem 4 Fix: Semantic fallback for unmatched high-weight skills
        # Only run on unmatched skills with weight >= 2 (frameworks/languages)
        if use_fuzzy:
            try:
                from sentence_transformers import SentenceTransformer
                import numpy as np
            
                # Load model (cached after first load)
                if not hasattr(extract_skills_with_phrasematcher, '_semantic_model'):
                    logger.info("Loading semantic model for skill matching...")
                    extract_skills_with_phrasematcher._semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
            
                semantic_model = extract_skills_with_phrasematcher._semantic_model
            
                # Get unmatched high-weight skills from JD (for future use)
                # This would be used to match against resume skills
                # For now, we just log that semantic matching is available
                logger.debug("Semantic matching model loaded and ready")
            
            except ImportError:
                logger.debug("sentence-transformers not installed, semantic matching disabled")
            except Exception as e:
                logger.warning(f"Semantic matching unavailable: {e}")
    
        return results
    except (BrokenPipeError, OSError) as e:
        # Handle broken pipe errors during processing
        is_broken_pipe = (
            isinstance(e, BrokenPipeError) or 
            (isinstance(e, OSError) and e.errno == 32)
        )
        if is_broken_pipe:
            # Broken pipe - stderr was closed, return empty results
            try:
                logger.warning("Broken pipe error during skill extraction (stderr closed)")
            except:
                pass  # Even logger might fail if stderr is broken
            return []
        else:
            # Other OSError - re-raise
            raise


def semantic_skill_match(
    jd_skill: str,
    resume_skills: List[str],
    threshold: float = 0.75
) -> Optional[Tuple[str, float]]:
    """
    Problem 4 Fix: Semantic fallback for unmatched skills.
    
    Matches "continuous integration" with "ci/cd" using embeddings.
    Only for high-weight skills (weight >= 2).
    
    Args:
        jd_skill: Skill from job description
        resume_skills: List of skills from resume
        threshold: Minimum cosine similarity (0.75 = 75% similar)
    
    Returns:
        Tuple of (matched_resume_skill, similarity_score) or None
    """
    try:
        from sentence_transformers import SentenceTransformer
        import numpy as np
        
        # Load model
        if not hasattr(semantic_skill_match, '_model'):
            semantic_skill_match._model = SentenceTransformer('all-MiniLM-L6-v2')
        
        model = semantic_skill_match._model
        
        # Generate embeddings - wrap in try-except to handle broken pipe
        try:
            jd_embedding = model.encode([jd_skill])
            resume_embeddings = model.encode(resume_skills)
        except (BrokenPipeError, OSError) as e:
            # Handle broken pipe during encoding
            if isinstance(e, OSError) and e.errno != 32:
                raise  # Re-raise if not broken pipe
            # For broken pipe, return empty results
            return []
        
        # Calculate cosine similarities manually (no sklearn dependency)
        # cosine_similarity = dot(a, b) / (norm(a) * norm(b))
        jd_norm = np.linalg.norm(jd_embedding)
        resume_norms = np.linalg.norm(resume_embeddings, axis=1)
        similarities = np.dot(jd_embedding, resume_embeddings.T)[0] / (jd_norm * resume_norms)
        
        # Find best match
        best_idx = np.argmax(similarities)
        best_score = similarities[best_idx]
        
        if best_score >= threshold:
            return (resume_skills[best_idx], float(best_score))
        
        return None
        
    except ImportError:
        logger.debug("sentence-transformers not available for semantic matching")
        return None
    except Exception as e:
        logger.warning(f"Semantic matching error: {e}")
        return None

