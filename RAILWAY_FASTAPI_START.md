# FastAPI Service Start Command for Railway

## Set in Railway Dashboard

Go to your FastAPI service → **Settings** → **Deploy** → **Start Command**

Set it to:
```
python -m spacy download en_core_web_sm && uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Why This Command?

1. **`python -m spacy download en_core_web_sm`** - Downloads the spaCy model (required for NLP)
2. **`&&`** - Runs the next command only if the first succeeds
3. **`uvicorn main:app --host 0.0.0.0 --port $PORT`** - Starts the FastAPI server
   - `--host 0.0.0.0` - Listens on all interfaces (required for Railway)
   - `--port $PORT` - Uses Railway's assigned port

## Alternative: If spaCy is already installed

If the model is already downloaded, you can use:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

But the first command is safer as it ensures the model is always available.

## Verify

After setting the start command and redeploying, check logs for:
- ✅ `Successfully loaded spaCy model: en_core_web_sm`
- ✅ `Uvicorn running on http://0.0.0.0:XXXX`
- ✅ `Application startup complete`

