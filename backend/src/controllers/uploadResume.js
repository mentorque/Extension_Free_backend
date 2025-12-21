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
    
    // Extract keywords from resume using comprehensive keyword extraction
    const normalizedServiceUrl = normalizeUrl(NLP_SERVICE_URL);
    const extractResumeKeywordsUrl = `${normalizedServiceUrl}/extract-resume-keywords`;
    const extractKeywordsUrl = `${normalizedServiceUrl}/extract`;  // Fallback: NLP keyword extraction
    
    console.log('[uploadResume] 🔍 Extracting keywords from resume text...');
    console.log(`[uploadResume]   Using: Comprehensive keyword extraction (keywords database + NLP patterns)`);
    console.log(`[uploadResume]   Endpoint: ${extractResumeKeywordsUrl}`);
    
    const nlpCallStartTime = Date.now();
    let keywordsResponse;
    let extractResponse;
    
    // Primary: Extract keywords using comprehensive keyword database
    try {
      keywordsResponse = await axios.post(
        extractResumeKeywordsUrl,
        { 
          text: resumeText
        },
        { 
          timeout: NLP_SERVICE_TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log(`[uploadResume] ✅ Keyword extraction completed`);
    } catch (error) {
      console.warn('[uploadResume] ⚠️  Comprehensive keyword extraction failed, trying fallback:', error.message);
      
      // Fallback: Use NLP keyword extraction
      try {
        keywordsResponse = await axios.post(
          extractKeywordsUrl,
          { 
            text: resumeText
          },
          { 
            timeout: NLP_SERVICE_TIMEOUT,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        console.log(`[uploadResume] ✅ Fallback keyword extraction completed`);
      } catch (fallbackError) {
        console.warn('[uploadResume] ⚠️  Fallback keyword extraction also failed:', fallbackError.message);
        keywordsResponse = { data: { keywords: [] } };
      }
    }
    
    // Also extract skills using PhraseMatcher (for 3-section classification)
    const extractSkillsUrl = `${normalizedServiceUrl}/extract-skills`;
    console.log('[uploadResume] 🔍 Also extracting skills using PhraseMatcher for classification...');
    console.log(`[uploadResume]   Endpoint: ${extractSkillsUrl}`);
    console.log(`[uploadResume]   Using: spaCy PhraseMatcher with skills.csv for 3-section classification`);
    
    try {
      extractResponse = await axios.post(
        extractSkillsUrl,
        { 
          text: resumeText,
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
      console.warn('[uploadResume] ⚠️  Skills extraction failed (classification may be incomplete):', error.message);
      extractResponse = { 
        data: { 
          skills: [],
          important_skills: [],
          less_important_skills: [],
          non_technical_skills: []
        } 
      };
    }
    
    // Get extracted keywords (comprehensive keyword extraction)
    const extractedKeywords = Array.isArray(keywordsResponse.data?.keywords) 
      ? keywordsResponse.data.keywords 
      : [];
    
    // Get extracted skills with 3-section classification (for classification only)
    const extractedSkills = Array.isArray(extractResponse?.data?.skills) 
      ? extractResponse.data.skills 
      : [];
    
    // Combine both: keywords + skills (remove duplicates, case-insensitive)
    const allKeywordsSet = new Set();
    extractedKeywords.forEach(kw => allKeywordsSet.add(kw.toLowerCase()));
    extractedSkills.forEach(skill => allKeywordsSet.add(skill.toLowerCase()));
    
    // Create combined list (prefer normalized skills over raw keywords when available)
    const combinedKeywords = [];
    const skillLowerMap = new Map(extractedSkills.map(s => [s.toLowerCase(), s]));
    const keywordLowerMap = new Map(extractedKeywords.map(k => [k.toLowerCase(), k]));
    
    for (const key of allKeywordsSet) {
      // Prefer normalized skill name if available, otherwise use keyword
      const normalized = skillLowerMap.get(key) || keywordLowerMap.get(key);
      if (normalized) {
        combinedKeywords.push(normalized);
      }
    }
    
    console.log(`[uploadResume] 📊 Combined extraction: ${extractedKeywords.length} keywords + ${extractedSkills.length} skills = ${combinedKeywords.length} unique terms`);
    
    // Get 3-section classification from skills (with fallback)
    const importantSkills = Array.isArray(extractResponse?.data?.important_skills)
      ? extractResponse.data.important_skills
      : (Array.isArray(extractResponse?.data?.skills) ? extractResponse.data.skills : []);
    const lessImportantSkills = Array.isArray(extractResponse?.data?.less_important_skills)
      ? extractResponse.data.less_important_skills
      : [];
    const nonTechnicalSkills = Array.isArray(extractResponse?.data?.non_technical_skills)
      ? extractResponse.data.non_technical_skills
      : [];
    
    // For display, use combined keywords (all extracted terms)
    const displaySkills = combinedKeywords;
    
    // Log response structure for debugging
    console.log('[uploadResume] 📋 Response structure:', {
      keywords_count: extractedKeywords.length,
      skills_count: extractedSkills.length,
      combined_count: displaySkills.length,
      has_important_skills: Array.isArray(extractResponse?.data?.important_skills),
      has_less_important_skills: Array.isArray(extractResponse?.data?.less_important_skills),
      has_non_technical_skills: Array.isArray(extractResponse?.data?.non_technical_skills)
    });
    
    const stats = extractResponse?.data?.stats || {};
    
    console.log(`[uploadResume] 📊 Extraction Results:`);
    console.log(`[uploadResume]   ┌─────────────────────────────────────────┐`);
    console.log(`[uploadResume]   │ EXTRACTION STATISTICS                 │`);
    console.log(`[uploadResume]   ├─────────────────────────────────────────┤`);
    console.log(`[uploadResume]   │ Keywords extracted:   ${String(extractedKeywords.length).padStart(6)} │`);
    console.log(`[uploadResume]   │ Skills matched:      ${String(extractedSkills.length).padStart(6)} │`);
    console.log(`[uploadResume]   │ Combined unique:     ${String(displaySkills.length).padStart(6)} │`);
    console.log(`[uploadResume]   │ Important Tech:      ${String(importantSkills.length).padStart(6)} │`);
    console.log(`[uploadResume]   │ Less Important Tech: ${String(lessImportantSkills.length).padStart(6)} │`);
    console.log(`[uploadResume]   │ Non-Technical:       ${String(nonTechnicalSkills.length).padStart(6)} │`);
    console.log(`[uploadResume]   └─────────────────────────────────────────┘`);
    console.log(`[uploadResume]   ✅ Using keyword extraction (all relevant terms from text)`);
    
    // Parse resume structure (name, position, experience)
    console.log('[uploadResume] 🔍 Parsing resume structure...');
    const parsedResume = parseResumeWithNLP(resumeText);
    // Store all extracted keywords/skills (for display)
    parsedResume.skills = displaySkills; // All extracted keywords and skills
    // Store all categories for localStorage
    parsedResume.skills_classified = {
      important: importantSkills,
      less_important: lessImportantSkills,
      non_technical: nonTechnicalSkills
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