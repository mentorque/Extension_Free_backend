# Backend Setup Guide

This guide will help you set up and run the backend server with the integrated NLP service for keyword extraction.

## Prerequisites

- **Node.js** (v14 or higher)
- **Python 3.9+** (for NLP service)
- **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Install Node.js Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Python Environment for NLP Service

The NLP service requires Python dependencies. You can either:

#### Option A: Use a Virtual Environment (Recommended)

```bash
# From the backend directory
cd ..
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
cd backend/nlp_service
pip install -r requirements.txt

# Download the spaCy language model
python -m spacy download en_core_web_sm
```

#### Option B: Install Globally (Not Recommended)

```bash
cd backend/nlp_service
pip3 install -r requirements.txt
python3 -m spacy download en_core_web_sm
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
touch .env
```

Add the following to `.env`:

```env
# Server Configuration
PORT=3000

# NLP Service Configuration (optional - defaults shown)
NLP_SERVICE_URL=http://127.0.0.1:8001
PYTHON_BIN=python3

# Database (if using Prisma)
DATABASE_URL=your_database_url_here

# API Keys (for other features)
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_custom_search_engine_id_here
```

**Note:** The NLP service will be automatically started by the backend when needed. You don't need to run it manually.

### 4. Run the Backend Server

#### Development Mode (with auto-reload):

```bash
cd backend
npm run dev
```

#### Production Mode:

```bash
cd backend
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## How It Works

1. **Backend starts** on port 3000
2. **When keywords endpoint is called**, the backend will:
   - Check if NLP service is running on port 8001
   - If not running, automatically start it
   - Make HTTP requests to the NLP service for keyword extraction
   - Process and return the results

## Testing the Setup

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Should return: `{"status":"ok"}`

### 2. Test Keywords Endpoint

```bash
curl -X POST http://localhost:3000/keywords \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "jobDescription": "We are looking for a Python developer with SQL and AWS experience.",
    "skills": ["Python", "JavaScript", "React"]
  }'
```

## Troubleshooting

### NLP Service Won't Start

**Problem:** Python not found or wrong path

**Solution:** 
- Make sure Python 3.9+ is installed: `python3 --version`
- If using venv, ensure it's activated
- Set `PYTHON_BIN` in `.env` to your Python path

### spaCy Model Not Found

**Problem:** `OSError: Can't find model 'en_core_web_sm'`

**Solution:**
```bash
# Activate your venv if using one
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Download the model
python -m spacy download en_core_web_sm
```

### Port Already in Use

**Problem:** Port 8001 (NLP service) or 3000 (backend) is already in use

**Solution:**
- Change `NLP_SERVICE_URL` in `.env` to use a different port
- Change `PORT` in `.env` for the backend

### Module Not Found Errors

**Problem:** Python dependencies not installed

**Solution:**
```bash
cd backend/nlp_service
pip install -r requirements.txt
```

## Manual NLP Service Testing (Optional)

If you want to test the NLP service independently:

```bash
# Activate venv if using one
source venv/bin/activate

# Start the NLP service manually
cd backend/nlp_service
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

Then test it:
```bash
curl -X POST http://127.0.0.1:8001/extract \
  -H "Content-Type: application/json" \
  -d '{"text": "We need a Python developer with AWS experience."}'
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── keywords.js      # Main keywords controller (uses NLP service)
│   ├── routes.js
│   └── utils/
├── nlp_service/              # Python FastAPI service
│   ├── main.py              # NLP service code
│   ├── requirements.txt     # Python dependencies
│   └── README.md
├── package.json
├── .env                     # Environment variables
└── server.js                # Entry point
```

## Next Steps

- The backend is now ready to handle keyword extraction requests
- The NLP service will automatically start when needed
- All keyword extraction now uses spaCy NLP instead of Gemini API
- No manual intervention needed for the NLP service






