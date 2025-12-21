# Railway Deployment Guide for FastAPI + Node.js Backend

## Overview
Your application has two services:
1. **Node.js/Express Backend** (main API) - Port 3000
2. **FastAPI NLP Service** - Port 8001

## Easiest Deployment Method: Two Separate Services

### Option 1: Deploy as Two Separate Railway Services (Recommended)

#### Service 1: Node.js Backend

1. **Create a new Railway project** from GitHub repo
2. **Select the `backend` folder** as the root directory
3. **Railway will auto-detect** Node.js
4. **Set environment variables** in Railway dashboard:
   - `PORT` (Railway sets this automatically)
   - `DATABASE_URL` (if using Prisma)
   - `API_KEY` or other secrets
   - `NLP_SERVICE_URL=http://your-nlp-service.railway.app` (after deploying service 2)

5. **Start command**: Railway auto-detects `npm start` from package.json

#### Service 2: FastAPI NLP Service

1. **Add a new service** in the same Railway project
2. **Set root directory** to `backend/nlp_service`
3. **Railway will auto-detect** Python
4. **Create `requirements.txt`** at `backend/nlp_service/requirements.txt` (already exists ✅)
5. **Set startup command** in Railway:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
   Note: Railway sets `$PORT` automatically

6. **Set environment variables**:
   - `PORT` (Railway sets automatically)
   - `TOKENIZERS_PARALLELISM=false`
   - `CUDA_VISIBLE_DEVICES=`

7. **Download spaCy model** - Add to startup command or create init script:
   ```
   python -m spacy download en_core_web_sm && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Option 2: Single Service with Process Manager (Alternative)

If you want both services in one Railway service, use a process manager like `foreman` or `concurrently`.

## Step-by-Step Deployment

### Prerequisites
1. GitHub repository with your code
2. Railway account (sign up at railway.app)

### Steps

1. **Push code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Deploy Node.js Backend**:
   - Go to Railway.app → New Project → Deploy from GitHub
   - Select your repository
   - In project settings, set **Root Directory** to `backend`
   - Railway will auto-detect Node.js and run `npm install` + `npm start`
   - Add environment variables in the Variables tab

3. **Deploy FastAPI Service**:
   - In the same Railway project, click **+ New Service** → **GitHub Repo**
   - Select the same repository
   - Set **Root Directory** to `backend/nlp_service`
   - Railway will auto-detect Python
   - Go to **Settings** → **Deploy** → Set **Start Command**:
     ```
     python -m spacy download en_core_web_sm && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - Add environment variables

4. **Get Service URLs**:
   - Each service gets a unique Railway URL
   - Update your Node.js backend's `NLP_SERVICE_URL` to point to the FastAPI service URL

5. **Update Frontend**:
   - Update your frontend API base URL to point to the Node.js backend Railway URL

## Important Files to Create/Check

### 1. `backend/nlp_service/requirements.txt` ✅ (Already exists)

### 2. `backend/nlp_service/runtime.txt` (Optional - specify Python version)
```
python-3.12.0
```

### 3. Update `backend/nlp_service/main.py` startup
Make sure it uses `$PORT` from environment:
```python
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

### 4. `.railwayignore` (Optional - exclude files from deployment)
```
venv/
__pycache__/
*.pyc
node_modules/
.env
.DS_Store
embeddings_cache/*.npy
```

## Environment Variables Checklist

### Node.js Backend:
- `PORT` (auto-set by Railway)
- `DATABASE_URL` (if using database)
- `NLP_SERVICE_URL` (URL of FastAPI service)
- Any API keys or secrets

### FastAPI Service:
- `PORT` (auto-set by Railway)
- `TOKENIZERS_PARALLELISM=false`
- `CUDA_VISIBLE_DEVICES=`

## Troubleshooting

1. **FastAPI service not starting**:
   - Check logs in Railway dashboard
   - Ensure `requirements.txt` is in `backend/nlp_service/`
   - Verify startup command uses `0.0.0.0` not `127.0.0.1`

2. **spaCy model missing**:
   - Add `python -m spacy download en_core_web_sm` to startup command

3. **Port binding errors**:
   - Always use `$PORT` environment variable
   - Use `0.0.0.0` as host, not `127.0.0.1`

4. **Large dependencies (torch, sentence-transformers)**:
   - Railway has build time limits
   - Consider using Railway's Nixpacks or Dockerfile for better caching

## Quick Start Commands

### For Node.js Backend:
```bash
railway init
railway link
railway up
```

### For FastAPI Service:
```bash
cd backend/nlp_service
railway init
railway link
railway up
```

## Cost Considerations

- Railway free tier: $5 credit/month
- Each service counts separately
- Consider deploying both services in one if you want to save credits

## Alternative: Docker Deployment

If you prefer Docker, create a `Dockerfile` for each service and Railway will use it automatically.

