# Railway Deployment Setup - Quick Guide

## ⚠️ Important: This is a Monorepo

Your repository contains multiple services. **You MUST set the Root Directory in Railway dashboard for each service.**

## Step-by-Step Deployment

### Service 1: Node.js Backend

1. **In Railway Dashboard:**
   - Go to your project → **Settings** → **Service Settings**
   - Set **Root Directory** to: `backend`
   - Railway will auto-detect Node.js from `backend/package.json`
   - Start command will be: `npm start` (from package.json)

2. **Environment Variables:**
   ```
   PORT=3000 (auto-set by Railway)
   DATABASE_URL=your_database_url
   NLP_SERVICE_URL=http://your-nlp-service.railway.app
   ```

### Service 2: FastAPI NLP Service

1. **Add New Service in Railway:**
   - Click **+ New Service** → **GitHub Repo**
   - Select the same repository
   - In **Settings** → **Service Settings**:
     - Set **Root Directory** to: `backend/nlp_service`
   - Railway will auto-detect Python from `backend/nlp_service/requirements.txt`

2. **Set Start Command:**
   - Go to **Settings** → **Deploy**
   - Set **Start Command** to:
     ```
     python -m spacy download en_core_web_sm && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

3. **Environment Variables:**
   ```
   PORT=8001 (auto-set by Railway)
   TOKENIZERS_PARALLELISM=false
   CUDA_VISIBLE_DEVICES=
   ```

## Why This is Needed

Railway's Railpack builder analyzes the root directory and can't determine which service to build when there are multiple subdirectories. By setting the **Root Directory** in Railway dashboard, you tell Railway which part of your monorepo to deploy.

## Alternative: Use Railway CLI

If you prefer CLI, you can specify the root directory:

```bash
# For Node.js backend
cd backend
railway init
railway up

# For FastAPI service (in a new terminal)
cd backend/nlp_service
railway init
railway up
```

## Troubleshooting

- **"Railpack could not determine how to build"**: Make sure you set Root Directory in Railway dashboard
- **Dockerfile skipped**: Railway only uses Dockerfiles at the root. For monorepos, use Root Directory instead
- **Service not starting**: Check logs in Railway dashboard and verify Root Directory is set correctly

