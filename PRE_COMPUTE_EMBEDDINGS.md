# Pre-compute Embeddings on Your Laptop

## Why?

Your Railway server is weak, but your laptop is powerful. Instead of computing embeddings on the server (which takes time and resources), compute them once on your laptop and upload them to git.

## How It Works

1. **On your laptop**: Run the pre-compute script (takes 1-2 minutes)
2. **Commit to git**: The `.npy` files are saved to `embeddings_cache/`
3. **Railway**: Automatically loads pre-computed embeddings (instant!)

## Steps

### 1. Run Pre-compute Script

**Option A: Using the shell script (easiest)**
```bash
cd backend/nlp_service
./precompute_embeddings.sh
```

**Option B: Using Python directly**
```bash
cd backend/nlp_service
python3 precompute_embeddings.py
```

**Option C: With venv activated**
```bash
cd backend
source venv/bin/activate
cd nlp_service
python precompute_embeddings.py
```

### 2. Verify Files Were Created

Check that these files exist:
```bash
ls -lh backend/nlp_service/embeddings_cache/*.npy
```

You should see:
- `important_tech_embeddings.npy` (~500KB)
- `less_important_tech_embeddings.npy` (~250KB)
- `non_tech_embeddings.npy` (~1.5MB)
- `embeddings_metadata.csv`

### 3. Commit to Git

```bash
git add backend/nlp_service/embeddings_cache/*.npy
git add backend/nlp_service/embeddings_cache/embeddings_metadata.csv
git commit -m "Add pre-computed embeddings (computed on laptop)"
git push
```

### 4. Deploy to Railway

Railway will automatically:
- ✅ Load pre-computed embeddings from cache
- ✅ Skip embedding computation (saves 1-2 minutes startup time)
- ✅ Start immediately with cached embeddings

## When to Re-run

Re-run the pre-compute script if you:
- Change the example skills in `skills_matcher.py`
- Update the Sentence Transformers model
- Modify the embedding categories

## File Sizes

The `.npy` files are relatively small (~2-3MB total) and safe to commit to git.

## Troubleshooting

**Error: "sentence-transformers not found"**
```bash
pip install sentence-transformers torch
```

**Error: "Model download failed"**
- Check internet connection
- Model is ~60MB, will download on first run

**Files not appearing in git**
- Make sure `.gitignore` doesn't exclude `*.npy`
- Check that files are in `backend/nlp_service/embeddings_cache/`

