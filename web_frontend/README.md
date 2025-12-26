# Web Frontend Tester (React)

React web interface for testing the NLP backend services.

## Setup

1. **Install dependencies:**
   ```bash
   cd web_frontend
   npm install
   ```

2. **Make sure the backend is running on `http://localhost:3000`**

3. **Start the React dev server:**
   ```bash
   npm run dev
   ```

4. **Open the app** - It will automatically open in your browser (usually `http://localhost:5173`)

## Features

- **Keywords Analysis Tab**: Paste LinkedIn job description, optionally add skills, analyze keywords
- **Resume Extraction Tab**: Paste resume content, extract skills and structured data
- **No configuration needed**: API key and backend URL are hardcoded

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Features

### Keywords Analysis Tab
- Paste LinkedIn job description
- Optionally enter your skills (or extract from resume first)
- Click "Analyze Keywords" to:
  - Extract keywords from job description
  - Match with your skills
  - Show matched and missing skills

### Resume Extraction Tab
- Paste resume content (text)
- Click "Extract Resume" to parse and extract:
  - Skills
  - Experience
  - Education
  - Summary
- Extracted skills can be auto-filled in Keywords Analysis tab

## API Endpoints Used

- `POST /api/keywords` - Keywords analysis
- `POST /api/upload-resume` - Resume extraction

## Notes

- API key is saved in browser localStorage
- Backend URL is hardcoded to `http://localhost:3000`
- For production, update the fetch URLs in the JavaScript

