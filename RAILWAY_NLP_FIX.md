# Railway NLP Service Fix

## Problem
The Node.js backend was trying to spawn a local Python process to run the NLP service, but on Railway:
- Python is not available in the Node.js service container
- The NLP service runs as a separate Railway service
- We should use HTTP requests to the remote NLP service instead

## Changes Made

### 1. Remote Service Detection
Added `isRemoteNlpService()` function to both controllers:
- Detects if `NLP_SERVICE_URL` is a remote URL (not localhost/127.0.0.1)
- If remote, skips local spawn logic and just waits for health check

### 2. URL Normalization
Fixed health check URL construction to handle trailing slashes:
- Removes trailing slashes from `serviceUrl`
- Prevents `//health` double-slash issue

### 3. Updated Files
- `backend/src/controllers/keywords.js`
- `backend/src/controllers/uploadResume.js`

## How It Works Now

1. **Local Development** (localhost/127.0.0.1):
   - Tries to spawn local Python process
   - Falls back to health check if spawn fails

2. **Production/Railway** (remote URL):
   - Detects remote URL
   - Skips spawn entirely
   - Only performs health checks
   - Waits for remote service to become available

## Environment Variable

Make sure `NLP_SERVICE_URL` is set in Railway:
```
NLP_SERVICE_URL=https://your-nlp-service.railway.app
```

**Important**: Don't include trailing slash or `/health` - just the base URL.

## Testing

After deploying:
1. Check Node.js backend logs - should see "Remote service detected"
2. Verify health checks succeed
3. Test keyword extraction and resume upload

