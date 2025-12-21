# 🚨 Railway Deployment Fix

## The Problem
Railway is trying to build from the root directory, but your repo has multiple services (backend, frontend, etc.). Railway can't determine which one to build.

## The Solution: Set Root Directory in Railway Dashboard

### For Node.js Backend Service:

1. Go to Railway Dashboard → Your Project → **Settings**
2. Scroll to **Service Settings**
3. Find **Root Directory** field
4. Set it to: `backend`
5. Save and redeploy

### For FastAPI NLP Service:

1. Add a **New Service** in Railway
2. Go to **Settings** → **Service Settings**
3. Set **Root Directory** to: `backend/nlp_service`
4. Go to **Settings** → **Deploy**
5. Set **Start Command** to:
   ```
   python -m spacy download en_core_web_sm && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. Save and redeploy

## Quick Steps in Railway Dashboard:

1. **Service 1 (Node.js):**
   - Settings → Root Directory: `backend`
   - Variables → Add your env vars

2. **Service 2 (FastAPI):**
   - + New Service → GitHub Repo
   - Settings → Root Directory: `backend/nlp_service`
   - Settings → Deploy → Start Command: `python -m spacy download en_core_web_sm && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Variables → Add env vars

## Why This Works

By setting the Root Directory, Railway will:
- Only analyze files in that directory
- Auto-detect the language (Node.js or Python)
- Use the correct build commands
- Deploy only that service

**You cannot deploy a monorepo from root without specifying Root Directory.**

