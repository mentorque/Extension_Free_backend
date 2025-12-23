// src/controllers/uploadResume.js
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// ============================================================================
// Configuration
// ============================================================================

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://127.0.0.1:8001';
const NLP_SERVICE_PORT = new URL(NLP_SERVICE_URL).port || '8001';
const NLP_SERVICE_TIMEOUT = 120000; // 2 minutes

/**
 * Normalize URL by removing trailing slashes
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL without trailing slash
 */
function normalizeUrl(url) {
  return url.replace(/\/+$/, '');
}

// ============================================================================
// NLP Service Management (reuse from keywords.js logic)
// ============================================================================

let nlpProcess = null;
let nlpStarting = false;

function resolvePythonBinary() {
  try {
    const possibleVenvPaths = [
      path.resolve(__dirname, '../../venv', 'bin', 'python'),
      path.resolve(__dirname, '../../../venv', 'bin', 'python'),
      path.resolve(__dirname, '../../../.venv', 'bin', 'python'),
      path.resolve(__dirname, '../../nlp_service', '.venv', 'bin', 'python'),
    ];
    
    for (const venvPython of possibleVenvPaths) {
      if (fs.existsSync(venvPython)) {
        console.log(`[uploadResume] Using venv Python: ${venvPython}`);
        return venvPython;
      }
    }
  } catch (error) {
    console.warn('[uploadResume] Error checking for venv:', error.message);
  }
  
  const pythonBin = process.env.PYTHON_BIN || 'python3';
  console.log(`[uploadResume] Using Python: ${pythonBin}`);
  return pythonBin;
}

async function waitForServiceHealth(serviceUrl, timeoutMs = 15000) {
  const startTime = Date.now();
  const pollInterval = 500;
  let attemptCount = 0;
  
  // Normalize URL (remove trailing slash)
  const normalizedUrl = normalizeUrl(serviceUrl);
  const healthUrl = `${normalizedUrl}/health`;
  
  while (Date.now() - startTime < timeoutMs) {
    attemptCount++;
    try {
      const response = await axios.get(healthUrl, { 
        timeout: 2000,
        validateStatus: (status) => status === 200
      });
      
      if (response.status === 200 && response.data?.status === 'healthy') {
        return true;
      }
    } catch (error) {
      if (attemptCount % 5 === 0) {
        const elapsed = Date.now() - startTime;
        console.log(`[uploadResume] ⏳ Waiting for NLP service... (attempt ${attemptCount}, ${elapsed}ms)`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  return false;
}

/**
 * Check if NLP service URL is remote (not localhost)
 * @param {string} serviceUrl - Base URL of the NLP service
 * @returns {boolean} True if remote URL
 */
function isRemoteNlpService(serviceUrl) {
  try {
    const url = new URL(serviceUrl);
    const hostname = url.hostname.toLowerCase();
    return !(hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0');
  } catch (error) {
    return false;
  }
}

async function ensureNlpService(serviceUrl) {
  if (await waitForServiceHealth(serviceUrl, 1500)) {
    console.log(`[uploadResume] ✅ NLP service is already running`);
    return;
  }
  
  // If using remote service (Railway, etc.), don't try to spawn locally
  if (isRemoteNlpService(serviceUrl)) {
    console.log(`[uploadResume] 🌐 Remote service detected, waiting for it to become available...`);
    const isHealthy = await waitForServiceHealth(serviceUrl, 15000);
    if (!isHealthy) {
      throw new Error(`Remote NLP service at ${serviceUrl} is not available. Please ensure it is deployed and running.`);
    }
    console.log(`[uploadResume] ✅ Remote service is available`);
    return;
  }
  
  if (nlpStarting) {
    const isHealthy = await waitForServiceHealth(serviceUrl, 15000);
    if (!isHealthy) {
      throw new Error('NLP service failed to start within timeout period');
    }
    return;
  }
  
  nlpStarting = true;
  
  try {
    console.log('\n========================================');
    console.log('[uploadResume] 🚀 Starting NLP Service');
    console.log('[uploadResume] ⚠️  This uses NLP (spaCy), NOT LLM/Gemini');
    console.log('========================================\n');
    
    const backendRoot = path.resolve(__dirname, '../../');
    const nlpServiceDir = path.join(backendRoot, 'nlp_service');
    
    if (!fs.existsSync(nlpServiceDir)) {
      throw new Error(`NLP service directory not found: ${nlpServiceDir}`);
    }
    
    const pythonBin = resolvePythonBinary();
    const args = [
      '-m', 'uvicorn',
      'main:app',
      '--host', '127.0.0.1',
      '--port', NLP_SERVICE_PORT
    ];
    
    // Set environment variables to prevent broken pipe errors
    const env = {
      ...process.env,
      PYTHONUNBUFFERED: '1',  // Disable Python output buffering
      PYTHONIOENCODING: 'utf-8',  // Set encoding
      PYTHONWARNINGS: 'ignore'  // Suppress warnings that might cause issues
    };
    
    nlpProcess = spawn(pythonBin, args, {
      cwd: nlpServiceDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
      env: env
    });
    
    // Handle stdout with error handling to prevent broken pipe
    nlpProcess.stdout?.on('error', (err) => {
      // Ignore EPIPE (broken pipe) errors - they're expected when Node.js closes the pipe
      if (err.code !== 'EPIPE') {
        console.error(`[NLP Service] stdout pipe error: ${err.message}`);
      }
    });
    
    nlpProcess.stdout?.on('data', (data) => {
      try {
        const output = data.toString().trim();
        if (output) {
          console.log(`[NLP Service Output] ${output}`);
        }
      } catch (err) {
        // Ignore errors when reading stdout
      }
    });
    
    // Handle stderr with error handling to prevent broken pipe
    nlpProcess.stderr?.on('error', (err) => {
      // Ignore EPIPE (broken pipe) errors - they're expected when Node.js closes the pipe
      if (err.code !== 'EPIPE') {
        console.error(`[NLP Service] stderr pipe error: ${err.message}`);
      }
    });
    
    nlpProcess.stderr?.on('data', (data) => {
      try {
        const error = data.toString().trim();
        if (error && !error.includes('INFO:')) {
          console.error(`[NLP Service Error] ${error}`);
        }
      } catch (err) {
        // Ignore errors when processing stderr data
      }
    });
    
    nlpProcess.unref();
    
    const isHealthy = await waitForServiceHealth(serviceUrl, 15000);
    if (!isHealthy) {
      throw new Error('NLP service failed to become healthy within timeout period');
    }
    
    console.log(`[uploadResume] ✅ NLP service started successfully\n`);
    
  } catch (error) {
    console.error('[uploadResume] ❌ Failed to start NLP service:', error.message);
    throw error;
  } finally {
    nlpStarting = false;
  }
}

// ============================================================================
// Resume Parsing with NLP
// ============================================================================

/**
 * Simple resume parser using NLP to extract skills and basic info
 * Uses NLP service to extract keywords/skills from resume text
 */
function parseResumeWithNLP(resumeText) {
  // Simple regex-based parsing for name and position
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l);
  
  let name = '';
  let position = '';
  const skills = [];
  const experience = [];
  
  // Try to extract name (usually first line or after "Name:")
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length > 0 && line.length < 50 && !line.toLowerCase().includes('resume') && !line.toLowerCase().includes('cv')) {
      name = line;
      break;
    }
  }
  
  // Try to extract position (look for keywords like "Software Engineer", "Developer", etc.)
  const positionKeywords = ['engineer', 'developer', 'manager', 'analyst', 'specialist', 'architect', 'consultant', 'lead', 'senior', 'junior'];
  for (const line of lines.slice(0, 20)) {
    const lower = line.toLowerCase();
    if (positionKeywords.some(kw => lower.includes(kw))) {
      position = line;
      break;
    }
  }

  // Experience parsing - look for company names and dates
  let currentCompany = null;
  let currentPosition = null;
  let currentDescription = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for experience section
    if (line.toLowerCase().includes('experience') || line.toLowerCase().includes('employment')) {
      // Parse subsequent lines
      for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
        const expLine = lines[j];
        
        // Check if this looks like a company/position line
        if (expLine.length > 0 && expLine.length < 100) {
          // If we have accumulated description, save previous experience
          if (currentCompany && currentDescription.length > 0) {
            experience.push({
              company: currentCompany,
              position: currentPosition || '',
              description: currentDescription
            });
            currentDescription = [];
          }
          
          currentCompany = expLine;
          currentPosition = null;
        } else if (expLine.length > 0) {
          currentDescription.push(expLine);
        }
      }
      break;
    }
  }
  
  // Save last experience if any
  if (currentCompany && currentDescription.length > 0) {
    experience.push({
      company: currentCompany,
      position: currentPosition || '',
      description: currentDescription
    });
  }
  
  return {
    name: name || 'Unknown',
    position: position || 'Unknown',
    experience: experience,
    skills: skills // Will be populated by NLP extraction
  };
}

const uploadResume = async (req, res, next) => {
  const startedAt = Date.now();
  try {
    console.log('\n========================================');
    console.log('[uploadResume] 📄 Resume Upload Request');
    console.log('[uploadResume] ⚠️  Using NLP (spaCy), NOT LLM/Gemini');
    console.log('========================================\n');
    
    console.log('[uploadResume] Incoming request', {
      hasFile: !!req.file,
      contentType: req.headers['content-type'],
      bodyKeys: Object.keys(req.body || {}),
    });

    let resumeText = '';

    if (typeof req.body?.resumeText === 'string') {
      resumeText = req.body.resumeText;
      console.log('[uploadResume] Using resumeText from JSON body, length:', resumeText.length);
    } else {
      console.warn('[uploadResume] No resumeText provided');
      return res.status(400).json({ error: 'No resume provided. Please provide resumeText.' });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      console.warn('[uploadResume] Empty resume text after extraction');
      return res.status(400).json({ error: 'Empty resume text' });
    }

    // Clean and normalize resume text for better NLP processing (same as keywords analysis)
    // Remove excessive whitespace, normalize line breaks, and clean common artifacts
    const cleanedResumeText = resumeText
      .replace(/[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g, ' ') // Normalize all whitespace
      .replace(/\s*[•·▪▫]\s*/g, ' ') // Remove bullet points
      .replace(/\s*[–—]\s*/g, ' ') // Normalize dashes
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
    
    // Check if resume text is too short after cleaning
    if (!cleanedResumeText || cleanedResumeText.length < 10) {
      console.warn('[uploadResume] Resume text is too short after cleaning');
      return res.status(400).json({ 
        error: 'Invalid resume',
        message: 'Resume text must contain substantial content (at least 10 characters)'
      });
    }
    
    console.log(`[uploadResume] 📝 Text cleaning: ${resumeText.length} chars → ${cleanedResumeText.length} chars`);

    // Ensure NLP service is running
    console.log('[uploadResume] 🔍 Checking NLP service...');
    try {
      await ensureNlpService(NLP_SERVICE_URL);
      console.log('[uploadResume] ✅ NLP service is ready\n');
    } catch (error) {
      console.error('[uploadResume] ❌ Failed to ensure NLP service:', error.message);
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'NLP service could not be started. Please ensure Python dependencies are installed.'
      });
    }
    
    // Extract skills from resume using NLP service with PhraseMatcher
    // Use the SAME endpoint and parameters as keywords analysis for consistency
    const normalizedServiceUrl = normalizeUrl(NLP_SERVICE_URL);
    const extractSkillsUrl = `${normalizedServiceUrl}/extract-skills`;
    console.log('[uploadResume] 🔍 Extracting skills using PhraseMatcher + skills.csv...');
    console.log(`[uploadResume]   Endpoint: ${extractSkillsUrl}`);
    console.log(`[uploadResume]   Using: spaCy PhraseMatcher with 38k skills from skills.csv`);
    console.log(`[uploadResume]   Text length: ${cleanedResumeText.length} chars (cleaned)`);
    console.log(`[uploadResume]   Custom keywords: Enabled (same as keywords analysis)\n`);
    
    const nlpCallStartTime = Date.now();
    let extractResponse;
    try {
      extractResponse = await axios.post(
        extractSkillsUrl,
        { 
          text: cleanedResumeText, // Use cleaned text (same as keywords analysis)
          use_fuzzy: true
        },
        { 
          timeout: NLP_SERVICE_TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const nlpCallDuration = Date.now() - nlpCallStartTime;
      console.log(`[uploadResume] ✅ NLP extraction completed in ${nlpCallDuration}ms`);
    } catch (error) {
      console.error('[uploadResume] ❌ Error calling NLP service:', error.message);
      console.error('[uploadResume]   Error details:', {
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Could not connect to NLP service. The service may need to be restarted.'
        });
      }
      
      if (error.response?.status === 404) {
        console.error('[uploadResume] ⚠️  /extract-skills endpoint not found. Service may need restart.');
        return res.status(503).json({
          error: 'Service endpoint not available',
          message: 'The /extract-skills endpoint is not available. Please restart the NLP service or check server logs.',
          hint: 'The NLP service may be running an old version. It should auto-restart on next request.'
        });
      }
      
      if (error.response?.status === 503) {
        return res.status(503).json({
          error: 'Skills matcher unavailable',
          message: error.response.data?.detail || 'Skills matcher module not available. Check server logs.'
        });
      }
      
      throw error;
    }
    
    // Get extracted skills with 3-section classification
    // Skills are normalized: "ts" → "TypeScript", "node" → "Node.js"
    // IMPORTANT: Use the SAME response structure as keywords analysis
    const extractedSkills = Array.isArray(extractResponse.data?.skills) 
      ? extractResponse.data.skills 
      : [];
    
    // Get 3-section classification (with fallback if not present)
    // This matches the exact same logic as keywords.js
    const importantSkills = Array.isArray(extractResponse.data?.important_skills)
      ? extractResponse.data.important_skills
      : (Array.isArray(extractResponse.data?.skills) ? extractResponse.data.skills : []);
    const lessImportantSkills = Array.isArray(extractResponse.data?.less_important_skills)
      ? extractResponse.data.less_important_skills
      : [];
    const nonTechnicalSkills = Array.isArray(extractResponse.data?.non_technical_skills)
      ? extractResponse.data.non_technical_skills
      : [];
    
    // Log response structure for debugging (same as keywords analysis)
    console.log('[uploadResume] 📋 Response structure:', {
      has_important_skills: Array.isArray(extractResponse.data?.important_skills),
      has_less_important_skills: Array.isArray(extractResponse.data?.less_important_skills),
      has_non_technical_skills: Array.isArray(extractResponse.data?.non_technical_skills),
      total_skills: extractedSkills.length,
      response_keys: Object.keys(extractResponse.data || {})
    });
    
    // Log custom keywords detection (if available in response)
    if (extractResponse.data?.stats) {
      console.log('[uploadResume] 🔑 Custom keywords: Enabled (same extraction logic as keywords analysis)');
    }
    
    const stats = extractResponse.data?.stats || {};
    
    console.log(`[uploadResume] 📊 Skills Extraction Results (3-Section Classification):`);
    console.log(`[uploadResume]   ┌─────────────────────────────────────────┐`);
    console.log(`[uploadResume]   │ EXTRACTION STATISTICS                 │`);
    console.log(`[uploadResume]   ├─────────────────────────────────────────┤`);
    console.log(`[uploadResume]   │ Total matches:        ${String(stats.total_matches || 0).padStart(6)} │`);
    console.log(`[uploadResume]   │ Unique skills:       ${String(extractedSkills.length).padStart(6)} │`);
    console.log(`[uploadResume]   │ Important Tech:      ${String(importantSkills.length).padStart(6)} │`);
    console.log(`[uploadResume]   │ Less Important Tech: ${String(lessImportantSkills.length).padStart(6)} │`);
    console.log(`[uploadResume]   │ Non-Technical:       ${String(nonTechnicalSkills.length).padStart(6)} │`);
    console.log(`[uploadResume]   └─────────────────────────────────────────┘`);
    console.log(`[uploadResume]   ✅ Skills normalized (e.g., "ts" → "TypeScript", "node" → "Node.js")`);
    
    // Parse resume structure (name, position, experience)
    console.log('[uploadResume] 🔍 Parsing resume structure...');
    const parsedResume = parseResumeWithNLP(resumeText);
    // Store ALL extracted skills in the main skills field (for consistency with keywords analysis)
    // This ensures resume extraction shows the same skills as keywords analysis
    parsedResume.skills = extractedSkills; // All extracted skills (same as keywords endpoint)
    // Store all categories for localStorage
    parsedResume.skills_classified = {
      important: importantSkills,
      less_important: lessImportantSkills,
      non_technical: nonTechnicalSkills,
      all: extractedSkills // Include all skills for consistency
    };
    
    console.log('[uploadResume] ✅ Resume parsed successfully');
    console.log(`[uploadResume]   - Name: ${parsedResume.name}`);
    console.log(`[uploadResume]   - Position: ${parsedResume.position}`);
    console.log(`[uploadResume]   - Experience entries: ${parsedResume.experience.length}`);
    console.log(`[uploadResume]   - Skills: ${parsedResume.skills.length}`);
    
    const totalDuration = Date.now() - startedAt;
    console.log(`[uploadResume] ⏱️  Completed in ${totalDuration}ms`);
    console.log('========================================\n');

    // Return in the expected format: { result: { formatted_resume: {...} } }
    // This matches what the frontend expects and will be saved to localStorage
    // skills field contains only Important skills (for display)
    // skills_classified contains all 3 categories (for localStorage storage)
    const response = {
      result: {
        formatted_resume: {
          name: parsedResume.name,
          position: parsedResume.position,
          experience: parsedResume.experience,
          skills: parsedResume.skills, // Only Important skills (for display)
          skills_classified: parsedResume.skills_classified // All 3 categories (for storage)
        }
      }
    };
    
    console.log('[uploadResume] 💾 Response structure ready for localStorage save');
    res.json(response);

  } catch (error) {
    console.error('[uploadResume] ❌ Unhandled error:', error?.message, error);
    next(error);
  } finally {
    console.log('[uploadResume] Completed in ms:', Date.now() - startedAt);
  }
};

module.exports = { uploadResume };