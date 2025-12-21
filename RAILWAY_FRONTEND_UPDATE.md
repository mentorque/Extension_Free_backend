# Frontend Railway URL Update

## Changes Made

### 1. Frontend API Configuration (`frontend/src/config/index.js`)
- **Updated**: Default API base URL changed from `http://localhost:3000/api` to `https://nodejs-service-production-e9b3.up.railway.app/api`
- **Note**: Can still be overridden with `VITE_API_BASE_URL` environment variable

### 2. Backend CORS Configuration (`backend/app.js`)
- **Added**: Railway domain to allowed origins: `https://nodejs-service-production-e9b3.up.railway.app`
- **Added**: Wildcard support for all Railway domains (`*.up.railway.app`)
- **Existing**: Chrome extension origins (`chrome-extension://*`) were already allowed

## How It Works

1. **Frontend** → Uses `config.apiBaseUrl` from `frontend/src/config/index.js`
2. **API Client** → Makes requests through `background.js` (Chrome extension service worker)
3. **Background Script** → Uses `fetch()` to call Railway backend
4. **Backend CORS** → Allows:
   - Chrome extensions (`chrome-extension://*`)
   - Railway domains (`*.up.railway.app`)
   - Specific production domains

## Testing

After rebuilding the extension:
1. Build frontend: `cd frontend && npm run build`
2. Load extension in Chrome
3. Check browser console for API calls to Railway URL
4. Verify CORS headers in Network tab

## Environment Variable Override

To use a different backend URL during development:
- Set `VITE_API_BASE_URL` in `.env` file
- Example: `VITE_API_BASE_URL=http://localhost:3000/api`

## Next Steps

1. ✅ Frontend config updated
2. ✅ Backend CORS updated
3. ⏳ Rebuild frontend extension
4. ⏳ Test API calls from extension
5. ⏳ Verify CORS headers in production

