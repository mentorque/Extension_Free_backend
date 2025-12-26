# How to Run NLP Service in .venv

## Option 1: Automatic (Recommended)
The Node.js backend automatically detects and uses the `.venv` if it exists. Just start your backend server and it will use the venv automatically.

## Option 2: Manual Setup and Run

### Step 1: Create/Activate Virtual Environment

```bash
cd backend/nlp_service

# Create venv if it doesn't exist
python3 -m venv .venv

# Activate venv
# On macOS/Linux:
source .venv/bin/activate

# On Windows:
# .venv\Scripts\activate
```

### Step 2: Install Dependencies

```bash
# Make sure venv is activated (you should see (.venv) in your prompt)
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm
```

### Step 3: Run the NLP Service

```bash
# Make sure venv is activated
# Run with uvicorn
uvicorn main:app --host 127.0.0.1 --port 8001

# Or with auto-reload for development:
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

### Step 4: Verify It's Running

Open another terminal and test:
```bash
curl http://127.0.0.1:8001/health
```

You should see:
```json
{"status":"healthy","spacy_model_loaded":true,"model_name":"en_core_web_sm"}
```

## Option 3: Using the Backend (Automatic)

The backend automatically:
1. Checks for `.venv/bin/python` in `backend/nlp_service/.venv/`
2. Uses it if found, otherwise falls back to system Python
3. Starts the NLP service automatically when needed

Just start your backend server - no manual setup needed!

## Troubleshooting

### Check if venv is being used:
Look for this in backend logs:
```
[Keywords] Using venv Python: /path/to/backend/nlp_service/.venv/bin/python
```

### If venv not detected:
1. Make sure `.venv` exists in `backend/nlp_service/`
2. Make sure `.venv/bin/python` exists (or `.venv/Scripts/python.exe` on Windows)
3. Check backend logs for which Python it's using

### Reinstall dependencies:
```bash
cd backend/nlp_service
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install --upgrade -r requirements.txt
```



