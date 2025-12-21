# NLP Keyword Extraction Service

A FastAPI-based microservice that extracts relevant keywords from job descriptions using spaCy's natural language processing capabilities.

## Features

- **Smart Keyword Extraction**: Uses spaCy NLP to extract meaningful keywords from text
- **Technology Detection**: Recognizes special tech terms like C++, .NET, Node.js, AWS, etc.
- **Generic Term Filtering**: Automatically filters out common business jargon and stopwords
- **Multi-Strategy Extraction**: Combines pattern matching, noun phrase extraction, and named entity recognition
- **RESTful API**: Simple HTTP API for easy integration
- **Auto-Download**: Automatically downloads the spaCy model if not present

## Installation

### Prerequisites

- Python 3.9+
- pip

### Setup

1. **Create and activate a virtual environment** (if not already done):
```bash
cd ../../
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
cd backend/nlp_service
pip install -r requirements.txt
```

3. **Download the spaCy model** (optional, will auto-download on first use):
```bash
python -m spacy download en_core_web_sm
```

## Usage

### Starting the Service

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

Or with auto-reload for development:
```bash
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

### API Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "spacy_model_loaded": true,
  "model_name": "en_core_web_sm"
}
```

#### Extract Keywords
```http
POST /extract
Content-Type: application/json

{
  "text": "We are looking for a Python developer with SQL and AWS experience."
}
```

**Response:**
```json
{
  "keywords": ["python", "developer", "sql", "aws", "experience"],
  "count": 5
}
```

### Using with Node.js Backend

The service is automatically managed by the Node.js backend in `backend/src/controllers/keywords.js`. It will:
1. Check if the service is already running
2. Start it automatically if needed
3. Manage the Python process lifecycle

## Keyword Extraction Strategies

The service uses multiple strategies to extract high-quality keywords:

### 1. Technology Pattern Matching
Regex patterns detect special technology terms that need careful handling:
- Programming languages: C++, C#, .NET, F#
- JavaScript ecosystem: Node.js, React.js, Vue.js, Angular.js
- BI Tools: Power BI, Tableau, Looker
- Databases: SQL, MySQL, PostgreSQL, MongoDB
- Cloud platforms: AWS, Azure, GCP
- Big Data: Spark, Hadoop, Snowflake, Databricks
- DevOps: Docker, Kubernetes, Airflow, Terraform
- ML/Data Science: TensorFlow, PyTorch, scikit-learn, pandas

### 2. Single-Token Keywords
Extracts individual nouns and proper nouns:
- Filters out generic terms (skills, experience, responsibilities)
- Uses lemmatization for better normalization
- Only includes meaningful tokens

### 3. Multi-Word Noun Phrases
Identifies skill-related phrases:
- "data analysis", "machine learning", "financial modeling"
- Must contain skill-related head words
- Limited to 1-4 tokens for relevance

### 4. Named Entity Recognition
Extracts organizations, products, and technologies:
- Company names: Google, Microsoft, Amazon
- Products: Excel, Tableau, SAP
- Technologies: Python, Java, React

## Configuration

### Environment Variables

- `NLP_SERVICE_URL`: Service URL (default: `http://127.0.0.1:8001`)
- `PYTHON_BIN`: Python executable path (default: `python3`)

### Stopwords

The service filters out generic business terms defined in `GENERIC_STOPWORDS`:
- Job description boilerplate (requirements, qualifications, responsibilities)
- Time references (years, months, days)
- Generic business terms (team, work, company, role)
- Adjectives (strong, proven, excellent)
- Common pronouns and articles

### Skill Head Words

Multi-word phrases are included if they contain these skill-related words:
- analysis, analytics, modeling, management
- engineering, architecture, development, design
- reporting, visualization, forecasting, optimization

## Testing

### Run Unit Tests
```bash
python test_unit.py
```

Tests include:
- Keyword normalization
- Generic word detection
- Technology pattern matching
- Keyword extraction from sample text
- Edge cases (empty text, short text)
- Configuration validation

### Run Integration Tests
```bash
# Start the service first
python -m uvicorn main:app --host 127.0.0.1 --port 8001 &

# Run tests
python test_service.py
```

## Performance

- **First Request**: 2-5 seconds (model loading)
- **Subsequent Requests**: 100-500ms
- **Memory Usage**: ~200-300 MB (spaCy model)
- **Model**: en_core_web_sm (12 MB download)

## Troubleshooting

### spaCy Model Not Found
```bash
python -m spacy download en_core_web_sm
```

### Port Already in Use
Change the port in the command:
```bash
uvicorn main:app --host 127.0.0.1 --port 8002
```

Update `NLP_SERVICE_URL` in the Node.js backend accordingly.

### Memory Issues
The service loads the spaCy model into memory (~200MB). Ensure sufficient RAM is available.

## Architecture

```
┌─────────────────┐
│  Node.js API    │
│  (keywords.js)  │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  NLP Service    │
│  (FastAPI)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  spaCy NLP      │
│  en_core_web_sm │
└─────────────────┘
```

## Dependencies

- **fastapi**: Modern web framework for building APIs
- **uvicorn**: ASGI server for FastAPI
- **spacy**: Industrial-strength NLP library
- **pydantic**: Data validation using Python type annotations

## Development

### Code Structure

- `main.py`: Main application file with all logic
- `requirements.txt`: Python dependencies
- `test_unit.py`: Unit tests
- `test_service.py`: Integration tests
- `README.md`: This documentation

### Adding New Technology Patterns

Edit `TECH_PATTERNS` in `main.py`:
```python
TECH_PATTERNS.append(
    re.compile(r"\bnew-technology\b", re.IGNORECASE)
)
```

### Adding Stopwords

Edit `GENERIC_STOPWORDS` in `main.py`:
```python
GENERIC_STOPWORDS.add("generic-term")
```

### Adding Skill Head Words

Edit `SKILL_HEAD_WORDS` in `main.py`:
```python
SKILL_HEAD_WORDS.add("new-skill-area")
```

## License

Part of the MentorqueAI HR Extension project.

## Version

**2.0.0** - Rebuilt from scratch with improved architecture and extraction logic

