/**
 * Keywords Controller
 * ===================
 * Manages keyword extraction from job descriptions using the NLP service.
 * Compares extracted keywords with user skills to identify matches and gaps.
 */

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const Fuse = require('fuse.js');

// ============================================================================
// Configuration
// ============================================================================

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://127.0.0.1:8001';
const NLP_SERVICE_PORT = new URL(NLP_SERVICE_URL).port || '8001';
const NLP_SERVICE_TIMEOUT = parseInt(process.env.NLP_SERVICE_TIMEOUT) || 120000; // 2 minutes (allows time for model download)
const HEALTH_CHECK_TIMEOUT = parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 120000; // 120 seconds (allows time for Sentence Transformers model download on first run)
const MAX_PRESENT_SKILLS = 15; // Maximum number of present skills to show

/**
 * Normalize URL by removing trailing slashes
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL without trailing slash
 */
function normalizeUrl(url) {
  return url.replace(/\/+$/, '');
}

// Utility function for normalizing text for matching
function normalizeForMatching(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Remove spaces, dots, dashes, etc.
}

// Load skills database for fuzzy matching - OPTIMIZED FOR 17K+ SKILLS
let skillsDatabase = null;
let skillsFuse = null;
let skillsNormalizedMap = null; // Fast O(1) lookup for exact matches
let skillsLoaded = false;

function loadSkillsDatabase() {
  if (skillsLoaded) {
    return; // Already loaded
  }
  
  const loadStartTime = Date.now();
  
  try {
    // Try to load from text file first (17k skills), fallback to JSON
    const textFilePath = path.resolve(__dirname, '../utils/skills.txt');
    const jsonFilePath = path.resolve(__dirname, '../utils/skillsDatabase.json');
    
    let allSkills = [];
    
    // Check if text file exists (for 17k skills)
    if (fs.existsSync(textFilePath)) {
      const fileContent = fs.readFileSync(textFilePath, 'utf8');
      const lines = fileContent.split('\n');
      
      // Parse each line (one skill per line) - optimized loop
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) { // Skip empty lines and comments
          allSkills.push({
            name: trimmed,
            category: 'general', // Default category for text file
            normalized: normalizeForMatching(trimmed),
            source: 'skills.txt' // Track source for logging
          });
        }
      }
    } else if (fs.existsSync(jsonFilePath)) {
      // Fallback to JSON format
      const skillsData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
      
      // Flatten all skills into a single array with categories
      for (const [category, skills] of Object.entries(skillsData)) {
        for (const skill of skills) {
          allSkills.push({
            name: skill,
            category: category,
            normalized: normalizeForMatching(skill)
          });
        }
      }
    } else {
      throw new Error(`Neither skills.txt nor skillsDatabase.json found`);
    }
    
    skillsDatabase = allSkills;
    
    // OPTIMIZATION 1: Create fast O(1) lookup map for exact matches
    // This avoids expensive fuzzy search for exact matches
    skillsNormalizedMap = new Map();
    for (const skill of allSkills) {
      const normalized = skill.normalized;
      // Store the best (first) match for each normalized form
      if (!skillsNormalizedMap.has(normalized)) {
        skillsNormalizedMap.set(normalized, skill.name);
      }
    }
    
    // OPTIMIZATION 2: Initialize Fuse.js with optimized settings for large datasets
    // Only create if we have skills (skip if empty)
    if (allSkills.length > 0) {
      skillsFuse = new Fuse(allSkills, {
        keys: ['name', 'normalized'],
        threshold: 0.35, // Slightly stricter for better performance (0.0 = exact, 1.0 = anything)
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        shouldSort: true,
        // Performance optimizations for large datasets
        findAllMatches: false, // Stop after finding good matches
        useExtendedSearch: false, // Disable extended search for speed
        distance: 100, // Limit search distance
      });
    }
    
    const loadDuration = Date.now() - loadStartTime;
    // Only log in development or if loading takes too long
    if (process.env.NODE_ENV === 'development' || loadDuration > 1000) {
      console.log(`[Keywords] ✅ Skills database loaded in ${loadDuration}ms (${allSkills.length} skills)`);
    }
    
    skillsLoaded = true;
  } catch (error) {
    console.warn(`[Keywords] ⚠️  Failed to load skills database: ${error.message}`);
    skillsDatabase = [];
    skillsNormalizedMap = new Map();
    skillsFuse = null;
    skillsLoaded = true; // Mark as loaded to prevent retry loops
  }
}
// Dynamic limit for missing skills based on matched count
// If user has 6+ matches, show only 2-4 most important missing keywords
const getMaxMissingSkills = (matchedCount) => {
  if (matchedCount >= 6) {
    return 4; // Show max 4 most important missing keywords
  } else if (matchedCount >= 3) {
    return 6; // Show up to 6 missing keywords
  } else {
    return 10; // Show up to 10 missing keywords if few matches
  }
};

// Keywords that are too generic and should be filtered out from results
const GENERIC_SKILL_KEYWORDS = new Set([
  'development', 'developer', 'engineering', 'engineer',
  'experience', 'knowledge', 'understanding', 'ability',
  'management', 'manager', 'work', 'working',
  'design', 'designer', 'analysis', 'analyst',
  'system', 'systems', 'application', 'applications',
  'solution', 'solutions', 'process', 'processes',
  'tool', 'tools', 'technology', 'technologies',
  'platform', 'platforms', 'service', 'services',
  'software', 'hardware', 'framework', 'frameworks',
  'implementation', 'deployment', 'integration',
  'communication', 'collaboration', 'documentation', 'presentation',
  'problem solving', 'critical thinking', 'team work', 'teamwork',
  'leadership', 'strategy', 'planning', 'organizational',
  'interpersonal', 'analytical', 'attention to detail',
  'multitasking', 'time management', 'self-motivated',
  'fast learner', 'team player', 'proactive'
]);

// Special cases for title casing
const TITLE_CASE_SPECIAL = new Map([
  // Programming languages
  ['c++', 'C++'],
  ['c#', 'C#'],
  ['.net', '.NET'],
  ['node.js', 'Node.js'],
  ['next.js', 'Next.js'],
  ['react.js', 'React.js'],
  ['vue.js', 'Vue.js'],
  ['angular.js', 'Angular.js'],
  ['express.js', 'Express.js'],
  
  // Cloud and infrastructure
  ['aws', 'AWS'],
  ['gcp', 'GCP'],
  ['ec2', 'EC2'],
  ['s3', 'S3'],
  
  // Data and databases
  ['sql', 'SQL'],
  ['nosql', 'NoSQL'],
  ['mysql', 'MySQL'],
  ['postgresql', 'PostgreSQL'],
  ['mongodb', 'MongoDB'],
  ['t-sql', 'T-SQL'],
  ['pl/sql', 'PL/SQL'],
  
  // BI Tools and Analytics
  ['power bi', 'Power BI'],
  ['tableau', 'Tableau'],
  ['dashboard', 'Dashboard'],
  ['dashboards', 'Dashboards'],
  ['kpi', 'KPI'],
  ['kpis', 'KPIs'],
  ['roi', 'ROI'],
  ['return on investment', 'Return on Investment'],
  ['data visualization', 'Data Visualization'],
  
  // Web technologies
  ['api', 'API'],
  ['rest', 'REST'],
  ['graphql', 'GraphQL'],
  ['html', 'HTML'],
  ['css', 'CSS'],
  ['json', 'JSON'],
  ['xml', 'XML'],
  
  // UI/UX
  ['ui', 'UI'],
  ['ux', 'UX'],
  ['ui/ux', 'UI/UX'],
  
  // DevOps
  ['ci/cd', 'CI/CD'],
  ['docker', 'Docker'],
  ['kubernetes', 'Kubernetes'],
  ['k8s', 'K8s'],
  
  // Salesforce
  ['salesforce', 'Salesforce'],
  ['salesforce service cloud', 'Salesforce Service Cloud'],
  ['salesforce sales cloud', 'Salesforce Sales Cloud'],
  ['salesforce experience cloud', 'Salesforce Experience Cloud'],
  ['salesforce marketing cloud', 'Salesforce Marketing Cloud'],
  ['salesforce knowledge', 'Salesforce Knowledge'],
  ['service cloud', 'Service Cloud'],
  ['experience cloud', 'Experience Cloud'],
  
  // Skills and practices
  ['data analytics', 'Data Analytics'],
  ['data analysis', 'Data Analysis'],
  ['business analysis', 'Business Analysis'],
  ['business analytics', 'Business Analytics'],
  ['project management', 'Project Management'],
  ['product management', 'Product Management'],
  ['agile', 'Agile'],
  ['scrum', 'Scrum'],
  ['kanban', 'Kanban'],
  
  // AI/ML
  ['ai', 'AI'],
  ['ml', 'ML'],
  ['ai/ml', 'AI/ML'],
  ['nlp', 'NLP'],
  ['llm', 'LLM'],
  ['generative ai', 'Generative AI'],
  ['prompt engineering', 'Prompt Engineering'],
  ['machine learning', 'Machine Learning'],
  ['deep learning', 'Deep Learning'],
  ['natural language processing', 'Natural Language Processing'],
  ['artificial intelligence', 'Artificial Intelligence'],
  
  // Certifications
  ['pmp', 'PMP'],
  ['csm', 'CSM'],
  ['itil', 'ITIL'],
  
  // Banking and Finance
  ['swift', 'SWIFT'],
  ['iso20022', 'ISO20022'],
  ['iso 20022', 'ISO 20022'],
  ['rdbms', 'RDBMS'],
  ['aml', 'AML'],
  ['kyc', 'KYC'],
  ['sepa', 'SEPA'],
  ['ach', 'ACH'],
  ['cash collections', 'Cash Collections'],
  ['cash collection', 'Cash Collection'],
  ['cheque collections', 'Cheque Collections'],
  ['cheque collection', 'Cheque Collection'],
  ['electronic collections', 'Electronic Collections'],
  ['electronic collection', 'Electronic Collection'],
  ['supply chain finance', 'Supply Chain Finance'],
  ['trade finance', 'Trade Finance'],
  ['liquidity management', 'Liquidity Management'],
  ['cash management', 'Cash Management'],
  ['treasury management', 'Treasury Management'],
  ['treasury operations', 'Treasury Operations'],
  ['channel banking', 'Channel Banking'],
  ['core banking', 'Core Banking'],
  ['internet banking', 'Internet Banking'],
  ['mobile banking', 'Mobile Banking'],
  ['online banking', 'Online Banking'],
  ['host-to-host', 'Host-to-Host'],
  ['host to host', 'Host-to-Host'],
  ['payment processing', 'Payment Processing'],
  ['payment gateway', 'Payment Gateway'],
  ['wire transfer', 'Wire Transfer'],
  ['real-time payments', 'Real-Time Payments'],
  ['instant payments', 'Instant Payments'],
  ['sweeps', 'Sweeps'],
  ['sweep', 'Sweep'],
  ['pooling', 'Pooling'],
  ['fraud detection', 'Fraud Detection'],
  ['anti-money laundering', 'Anti-Money Laundering'],
  ['know your customer', 'Know Your Customer'],
  
  // Business Analysis
  ['fsd', 'FSD'],
  ['frd', 'FRD'],
  ['functional specification', 'Functional Specification'],
  ['functional requirements', 'Functional Requirements'],
  ['user stories', 'User Stories'],
  ['requirement traceability', 'Requirement Traceability'],
  ['requirements traceability', 'Requirements Traceability'],
  ['requirement gathering', 'Requirement Gathering'],
  ['requirements gathering', 'Requirements Gathering'],
  ['requirement elicitation', 'Requirement Elicitation'],
  ['requirements elicitation', 'Requirements Elicitation'],
  ['elicitation', 'Elicitation'],
  ['root-cause analysis', 'Root-Cause Analysis'],
  ['root cause analysis', 'Root-Cause Analysis'],
  ['rca', 'RCA'],
  ['defect management', 'Defect Management'],
  ['bug tracking', 'Bug Tracking'],
  ['solution design', 'Solution Design'],
  ['functional design', 'Functional Design'],
  ['workflow design', 'Workflow Design'],
  ['process mapping', 'Process Mapping'],
  ['process modeling', 'Process Modeling'],
  ['flowcharts', 'Flowcharts'],
  ['flowchart', 'Flowchart'],
  ['uml diagrams', 'UML Diagrams'],
  ['uml', 'UML'],
  ['use cases', 'Use Cases'],
  ['use case', 'Use Case'],
  ['sequence diagrams', 'Sequence Diagrams'],
  ['activity diagrams', 'Activity Diagrams'],
  ['class diagrams', 'Class Diagrams'],
  ['bpmn', 'BPMN'],
  ['stakeholder management', 'Stakeholder Management'],
  ['stakeholder engagement', 'Stakeholder Engagement'],
  ['gap analysis', 'Gap Analysis'],
  ['fit-gap analysis', 'Fit-Gap Analysis'],
  
  // Enterprise Systems
  ['erp', 'ERP'],
  ['crm', 'CRM'],
  ['etl', 'ETL'],
  ['esb', 'ESB'],
  ['enterprise resource planning', 'Enterprise Resource Planning'],
  ['customer relationship management', 'Customer Relationship Management'],
  ['enterprise service bus', 'Enterprise Service Bus'],
  ['system integration', 'System Integration'],
  ['data integration', 'Data Integration'],
  ['application integration', 'Application Integration'],
  
  // Testing
  ['uat', 'UAT'],
  ['sit', 'SIT'],
  ['qa', 'QA'],
  ['user acceptance testing', 'User Acceptance Testing'],
  ['system integration testing', 'System Integration Testing'],
  ['regression testing', 'Regression Testing'],
  ['test cases', 'Test Cases'],
  ['test plan', 'Test Plan'],
  ['quality assurance', 'Quality Assurance'],
]);

// ============================================================================
// NLP Service Management
// ============================================================================

let nlpProcess = null;
let nlpStarting = false;

/**
 * Resolve the Python binary path, preferring project venv
 * @returns {string} Path to Python executable
 */
function resolvePythonBinary() {
  try {
    // Try multiple venv locations
    const possibleVenvPaths = [
      // Option 1: venv at backend level
      path.resolve(__dirname, '../../venv', 'bin', 'python'),
      // Option 2: venv at project root
      path.resolve(__dirname, '../../../venv', 'bin', 'python'),
      // Option 3: .venv at project root
      path.resolve(__dirname, '../../../.venv', 'bin', 'python'),
      // Option 4: venv in nlp_service
      path.resolve(__dirname, '../../nlp_service', '.venv', 'bin', 'python'),
    ];
    
    for (const venvPython of possibleVenvPaths) {
      if (fs.existsSync(venvPython)) {
        console.log(`[Keywords] Using venv Python: ${venvPython}`);
        return venvPython;
      }
    }
    
    console.log(`[Keywords] Venv not found, tried: ${possibleVenvPaths.join(', ')}`);
  } catch (error) {
    console.warn('[Keywords] Error checking for venv:', error.message);
  }
  
  // Fall back to environment variable or system Python
  const pythonBin = process.env.PYTHON_BIN || 'python3';
  console.log(`[Keywords] Using Python: ${pythonBin}`);
  return pythonBin;
}

/**
 * Wait for the NLP service to become healthy
 * @param {string} serviceUrl - Base URL of the NLP service
 * @param {number} timeoutMs - Maximum wait time in milliseconds
 * @returns {Promise<boolean>} True if service is healthy
 */
async function waitForServiceHealth(serviceUrl, timeoutMs = HEALTH_CHECK_TIMEOUT) {
  const startTime = Date.now();
  const pollInterval = 1000; // Increased to 1s between checks for better performance
  let attemptCount = 0;
  const isDev = process.env.NODE_ENV === 'development';
  
  // Normalize URL (remove trailing slash)
  const normalizedUrl = normalizeUrl(serviceUrl);
  const healthUrl = `${normalizedUrl}/health`;
  
  while (Date.now() - startTime < timeoutMs) {
    attemptCount++;
    try {
      const response = await axios.get(healthUrl, { 
        timeout: 5000,
        validateStatus: (status) => status === 200
      });
      
      if (response.status === 200 && response.data?.status === 'healthy') {
        const elapsed = Date.now() - startTime;
        if (isDev || attemptCount > 1) {
          console.log(`[NLP Service] ✅ Healthy (${elapsed}ms)`);
        }
        return true;
      }
    } catch (error) {
      // Only log every 5th attempt to reduce noise
      if (isDev && attemptCount % 5 === 0) {
        const elapsed = Date.now() - startTime;
        console.log(`[NLP Service] ⏳ Waiting... (${attemptCount} attempts, ${elapsed}ms)`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  const elapsed = Date.now() - startTime;
  console.error(`[NLP Service] ❌ Health check timeout (${attemptCount} attempts, ${elapsed}ms)`);
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

/**
 * Ensure the NLP service is running, starting it if necessary
 * @param {string} serviceUrl - Base URL of the NLP service
 * @throws {Error} If service cannot be started
 */
async function ensureNlpService(serviceUrl) {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Check if service is already running
  if (await waitForServiceHealth(serviceUrl, 1500)) {
    return;
  }
  
  // If using remote service (Railway, etc.), don't try to spawn locally
  if (isRemoteNlpService(serviceUrl)) {
    if (isDev) {
      console.log(`[NLP Service] 🌐 Remote service detected, waiting...`);
    }
    const isHealthy = await waitForServiceHealth(serviceUrl, HEALTH_CHECK_TIMEOUT);
    if (!isHealthy) {
      throw new Error(`Remote NLP service at ${serviceUrl} is not available. Please ensure it is deployed and running.`);
    }
    return;
  }
  
  // Prevent multiple simultaneous startup attempts
  if (nlpStarting) {
    const isHealthy = await waitForServiceHealth(serviceUrl, HEALTH_CHECK_TIMEOUT);
    if (!isHealthy) {
      throw new Error('NLP service failed to start within timeout period');
    }
    return;
  }
  
  nlpStarting = true;
  const isDev = process.env.NODE_ENV === 'development';
  
  try {
    if (isDev) {
      console.log('[NLP Service] 🚀 Starting NLP service...');
    }
    
    // Go up 2 levels from backend/src/controllers/ to backend root, then into nlp_service
    const backendRoot = path.resolve(__dirname, '../../');
    const nlpServiceDir = path.join(backendRoot, 'nlp_service');
    
    // Verify NLP service directory exists
    if (!fs.existsSync(nlpServiceDir)) {
      throw new Error(`NLP service directory not found: ${nlpServiceDir}`);
    }
    
    // Verify main.py exists
    const mainPyPath = path.join(nlpServiceDir, 'main.py');
    if (!fs.existsSync(mainPyPath)) {
      throw new Error(`NLP service main.py not found: ${mainPyPath}`);
    }
    
    const pythonBin = resolvePythonBinary();
    const args = [
      '-m', 'uvicorn',
      'main:app',
      '--host', '127.0.0.1',
      '--port', NLP_SERVICE_PORT
    ];
    
    // Spawn the NLP service process
    // Set environment variables to prevent broken pipe errors
    // Use .env values if set, otherwise use defaults
    const env = {
      ...process.env,
      PYTHONUNBUFFERED: process.env.PYTHONUNBUFFERED || '1',  // Disable Python output buffering
      PYTHONIOENCODING: process.env.PYTHONIOENCODING || 'utf-8',  // Set encoding
      PYTHONWARNINGS: process.env.PYTHONWARNINGS || 'ignore'  // Suppress warnings that might cause issues
    };
    
    // CRITICAL FIX: Redirect stderr to stdout in spawn to prevent broken pipe errors
    // Using 'pipe' for stdout and redirecting stderr to stdout (index 1)
    // This ensures stderr writes go to stdout, which is always consumed
    nlpProcess = spawn(pythonBin, args, {
      cwd: nlpServiceDir,
      stdio: ['ignore', 'pipe', 1], // stdin=ignore, stdout=pipe, stderr=stdout (redirect to stdout)
      detached: true,
      env: env
    });
    
    // Handle stdout (stderr is redirected to stdout via stdio: ['ignore', 'pipe', 1])
    // All output (stdout + stderr) will come through stdout, preventing broken pipe errors
    // CRITICAL: Continuously consume data to keep pipe alive
    let stdoutBuffer = '';
    nlpProcess.stdout?.setEncoding('utf8');
    nlpProcess.stdout?.on('data', (data) => {
      // Always consume stdout data to keep pipe alive (includes stderr since it's redirected)
      stdoutBuffer += data;
      // Process in chunks to avoid memory issues
      const lines = stdoutBuffer.split('\n');
      stdoutBuffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      // Only log errors and critical messages in production
      const isDev = process.env.NODE_ENV === 'development';
      for (const line of lines) {
        if (line.trim()) {
          try {
            const output = line.trim();
            // Only log errors in production, log more in development
            if (output.includes('ERROR:') || output.includes(' - ERROR - ') || output.includes('Traceback')) {
              console.error(`[NLP Service Error] ${output}`);
            } else if (isDev) {
              // In development, log important messages
              if (output.includes('[EMBEDDINGS]') || 
                  output.includes('[CUSTOM KEYWORDS]') ||
                  output.includes('Sentence Transformers') ||
                  output.includes('🤖') ||
                  output.includes('⚠️') ||
                  output.includes('✅')) {
                console.log(`[NLP Service] ${output}`);
              }
            }
          } catch (err) {
            // Ignore processing errors
          }
        }
      }
    });
    
    nlpProcess.stdout?.on('error', (err) => {
      // Ignore EPIPE (broken pipe) errors - they're expected when Node.js closes the pipe
      if (err.code !== 'EPIPE') {
        console.error(`[NLP Service] stdout pipe error: ${err.message}`);
      }
    });
    
    nlpProcess.on('error', (error) => {
      console.error(`[NLP Service] ❌ Failed to start process:`);
      console.error(`[NLP Service]   Error: ${error.message}`);
      console.error(`[NLP Service]   Python binary: ${pythonBin}`);
      console.error(`[NLP Service]   Working directory: ${nlpServiceDir}`);
      console.error(`[NLP Service]   Check if Python is installed and accessible`);
      nlpStarting = false;
    });
    
    nlpProcess.on('exit', (code, signal) => {
      if (code !== null && code !== 0) {
        console.error(`[NLP Service] ❌ Process exited with code ${code}`);
        if (signal) {
          console.error(`[NLP Service]   Signal: ${signal}`);
        }
        nlpStarting = false;
        // Don't throw here - let the health check timeout handle it
      }
    });
    
    // Allow the process to continue running independently
    nlpProcess.unref();
    
    // Clean up process on exit
    process.on('exit', () => {
      if (nlpProcess && !nlpProcess.killed) {
        try {
          process.kill(-nlpProcess.pid);
          console.log('[Keywords] NLP service process terminated');
        } catch (error) {
          console.warn('[Keywords] Error terminating NLP service:', error.message);
        }
      }
    });
    
    // Wait for service to become healthy
    const healthCheckStart = Date.now();
    const isHealthy = await waitForServiceHealth(serviceUrl, HEALTH_CHECK_TIMEOUT);
    const healthCheckDuration = Date.now() - healthCheckStart;
    
    if (!isHealthy) {
      throw new Error(`NLP service failed health check after ${healthCheckDuration}ms`);
    }
    
    if (isDev) {
      console.log(`[NLP Service] ✅ Started (${healthCheckDuration}ms)`);
    }
    
  } catch (error) {
    console.error(`[NLP Service] ❌ Failed to start: ${error.message}`);
    throw error;
  } finally {
    nlpStarting = false;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert a keyword to title case with special handling for acronyms and tech terms
 * @param {string} input - Input string to convert
 * @returns {string} Title-cased string
 */
function titleize(input) {
  if (!input) return '';
  
  const lower = String(input).toLowerCase().trim();
  
  // Check for special cases
  if (TITLE_CASE_SPECIAL.has(lower)) {
    return TITLE_CASE_SPECIAL.get(lower);
  }
  
  // Standard title case: capitalize first letter of each word
  return lower
    .split(/\s+/)
    .map(word => {
      if (!word) return word;
      // Check if individual word has special casing
      if (TITLE_CASE_SPECIAL.has(word)) {
        return TITLE_CASE_SPECIAL.get(word);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Validate and sanitize user skills array
 * @param {any} skills - Skills input from request
 * @returns {string[]} Array of valid skill strings
 */
function validateSkills(skills) {
  if (!Array.isArray(skills)) {
    return [];
  }
  
  return skills
    .filter(skill => typeof skill === 'string' && skill.trim().length > 0)
    .map(skill => skill.trim());
}

/**
 * Calculate importance score for a keyword (0-100)
 * Higher scores indicate more important/technical keywords
 * @param {string} keyword - Keyword to score
 * @returns {number} Importance score
 */
function calculateKeywordImportance(keyword) {
  const lower = keyword.toLowerCase();
  
  // Filter out generic keywords
  if (GENERIC_SKILL_KEYWORDS.has(lower)) {
    return 0;
  }
  
  // Very high priority: Programming languages and specific technologies
  const highPriorityPatterns = [
    /\b(python|java|javascript|typescript|c\+\+|c#|ruby|php|go|rust|kotlin|swift|scala)\b/i,
    /\b(react|angular|vue|node\.?js|django|flask|spring|express)\b/i,
    /\b(aws|azure|gcp|docker|kubernetes|terraform)\b/i,
    /\b(sql|mysql|postgresql|mongodb|redis|elasticsearch|oracle|rdbms)\b/i,
    /\b(git|github|gitlab|jira|jenkins|ci\/cd)\b/i,
    /\b(tensorflow|pytorch|scikit-learn|pandas|numpy)\b/i,
    /\b(rest|graphql|api|microservices|host[- ]?to[- ]?host)\b/i,
    
    // Banking and Finance specific
    /\b(swift|iso\s*20022|sepa|ach)\b/i,
    /\b(cash|cheque|electronic)\s+(collection|collections)\b/i,
    /\b(supply\s+chain|trade)\s+finance\b/i,
    /\b(liquidity|cash|treasury)\s+management\b/i,
    /\b(channel|core)\s+banking\b/i,
    /\b(payment\s+(processing|gateway)|wire\s+transfer)\b/i,
    /\b(real[- ]time|instant)\s+payments?\b/i,
    /\b(aml|kyc|fraud\s+detection)\b/i,
  ];
  
  for (const pattern of highPriorityPatterns) {
    if (pattern.test(keyword)) {
      return 100; // Highest priority
    }
  }
  
  // High priority: Specific tools and methodologies
  const mediumPriorityPatterns = [
    /\b(agile|scrum|kanban|devops|ci\/cd)\b/i,
    /\b(tableau|power\s*bi|looker|qlik)\b/i,
    /\b(salesforce|sap|oracle|workday)\b/i,
    /\b(machine learning|deep learning|ai|nlp|computer vision)\b/i,
    /\b(data\s+analysis|data\s+science|business\s+analysis)\b/i,
    /\b(project\s+management|product\s+management)\b/i,
    
    // Business Analysis and Requirements
    /\b(fsd|frd|functional\s+(specification|requirements?))\b/i,
    /\b(user\s+stor(y|ies)|use\s+case)\b/i,
    /\b(requirement|requirements)\s+(traceability|gathering|elicitation)\b/i,
    /\b(elicitation|root[- ]cause\s+analysis|rca)\b/i,
    /\b(defect|change)\s+management\b/i,
    /\b(solution|functional|workflow)\s+design\b/i,
    /\b(process\s+(mapping|modeling|modelling))\b/i,
    /\b(flowchart|uml|bpmn)\b/i,
    /\b(stakeholder\s+(management|engagement))\b/i,
    /\b(gap|fit[- ]gap)\s+analysis\b/i,
    
    // Testing and Integration
    /\b(uat|sit|qa|quality\s+assurance)\b/i,
    /\b(user\s+acceptance|system\s+integration|regression)\s+testing\b/i,
    /\b(test\s+(case|plan|strategy))\b/i,
    /\b(erp|crm|etl|esb)\b/i,
    /\b(system|data|application)\s+integration\b/i,
    /\b(enterprise\s+(resource\s+planning|service\s+bus))\b/i,
  ];
  
  for (const pattern of mediumPriorityPatterns) {
    if (pattern.test(keyword)) {
      return 80; // High priority
    }
  }
  
  // Medium priority: Domain-specific skills with modifiers
  if (keyword.includes(' ')) {
    const words = keyword.split(/\s+/).map(w => w.toLowerCase());
    
    // Check if any word in the phrase is generic
    for (const word of words) {
      if (GENERIC_SKILL_KEYWORDS.has(word)) {
        return 0; // Filter out phrases containing generic words
      }
    }
    
    // Multi-word skills are generally more specific
    if (words.length >= 2 && words.length <= 3) {
      return 60; // Medium priority
    }
  }
  
  // Low priority: Single generic words
  return 30;
}

// ============================================================================
// Main Controller Function
// ============================================================================

/**
 * Generate keywords from job description and compare with user skills
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const generateKeywords = async (req, res, next) => {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  
  // Only log detailed info in development
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log(`[Keywords] 🎯 Request received (ID: ${requestId})`);
  }
  
  try {
    const { jobDescription, skills } = req.body;

    // Only log details in development
    if (isDev) {
      console.log(`[Keywords] 📥 Job desc: ${jobDescription?.length || 0} chars, Skills: ${Array.isArray(skills) ? skills.length : 0}`);
    }
    
    // Validate input
    if (!jobDescription || typeof jobDescription !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'jobDescription must be a non-empty string'
      });
    }
    
    // Clean and normalize job description for better NLP processing
    // Remove excessive whitespace, normalize line breaks, and clean common artifacts
    const cleanedDescription = jobDescription
      .replace(/[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g, ' ') // Normalize all whitespace
      .replace(/\s*[•·▪▫]\s*/g, ' ') // Remove bullet points
      .replace(/\s*[–—]\s*/g, ' ') // Normalize dashes
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
    
    // Check if description is too short after cleaning
    if (!cleanedDescription || cleanedDescription.length < 10) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'jobDescription must contain substantial text (at least 10 characters)'
      });
    }
    
    // Use cleaned description for processing
    const finalDescription = cleanedDescription;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'skills must be an array'
      });
    }
    
    // Sanitize and validate skills
    const validatedSkills = validateSkills(skills);
    
    // Ensure NLP service is running
    try {
      await ensureNlpService(NLP_SERVICE_URL);
    } catch (error) {
      console.error(`[Keywords] ❌ NLP service error: ${error.message}`);
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'NLP service could not be started. Please ensure Python dependencies are installed. Check server logs for details.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Extract skills from job description using NLP service with PhraseMatcher
    const normalizedServiceUrl = normalizeUrl(NLP_SERVICE_URL);
    const extractSkillsUrl = `${normalizedServiceUrl}/extract-skills`;
    
    const nlpCallStartTime = Date.now();
    let extractResponse;
    try {
      extractResponse = await axios.post(
        extractSkillsUrl,
        { 
          text: finalDescription,
          use_fuzzy: true
        },
        { 
          timeout: NLP_SERVICE_TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (isDev) {
        const nlpCallDuration = Date.now() - nlpCallStartTime;
        console.log(`[Keywords] ✅ NLP responded in ${nlpCallDuration}ms`);
      }
    } catch (error) {
      const nlpCallDuration = Date.now() - nlpCallStartTime;
      console.error(`[Keywords] ❌ NLP error (${nlpCallDuration}ms): ${error.message}`);
      
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Could not connect to NLP service. The service may not be running.',
          hint: 'Check if Python dependencies are installed and the NLP service can start.'
        });
      }
      
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        return res.status(504).json({
          error: 'Request timeout',
          message: 'NLP service took too long to respond. This may happen on first request while the model loads.'
        });
      }
      
      if (error.response?.status === 404) {
        console.error(`[Keywords] ⚠️  /extract-skills endpoint not found. Service may need restart.`);
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
      
      if (error.response) {
        return res.status(error.response.status || 500).json({
          error: 'NLP service error',
          message: error.response.data?.detail || error.message
        });
      }
      
      throw error;
    }
    
    // Extract skills from response (already cleaned, canonicalized, weighted, and normalized)
    // Skills are normalized: "ts" → "TypeScript", "node" → "Node.js"
    const jdSkills = Array.isArray(extractResponse.data?.skills) 
      ? extractResponse.data.skills 
      : [];
    
    // Extract skill weights from matches
    const skillWeights = new Map();
    if (Array.isArray(extractResponse.data?.matches)) {
      extractResponse.data.matches.forEach(match => {
        if (match.skill && match.weight) {
          skillWeights.set(match.skill.toLowerCase(), match.weight);
        }
      });
    }
    
    const stats = extractResponse.data?.stats || {};
    
    // Extract 3-section classification from NLP service response
    const importantSkills = Array.isArray(extractResponse.data?.important_skills)
      ? extractResponse.data.important_skills
      : (Array.isArray(extractResponse.data?.skills) ? extractResponse.data.skills : []);
    const lessImportantSkills = Array.isArray(extractResponse.data?.less_important_skills)
      ? extractResponse.data.less_important_skills
      : [];
    const nonTechnicalSkills = Array.isArray(extractResponse.data?.non_technical_skills)
      ? extractResponse.data.non_technical_skills
      : [];
    
    // Check if classifier is available (has classification data)
    const classifierAvailable = (importantSkills.length > 0 || lessImportantSkills.length > 0 || nonTechnicalSkills.length > 0) &&
                                extractResponse.data?.classifier_available !== false;
    
    // Skills are already cleaned and canonicalized by NLP service
    // No additional cleanup needed - they're ready to use
    const cleanedKeywords = jdSkills;
    
    // Only log detailed stats in development
    if (isDev && jdSkills.length > 0) {
      console.log(`[Keywords] 📋 Extracted ${jdSkills.length} skills (matches: ${stats.total_matches || 0})`);
    }

    // Create normalized versions for matching (using cleaned skills with weights)
    const jdKeywordsNormalized = cleanedKeywords.map(skill => {
      const skillLower = String(skill || '').toLowerCase();
      const weight = skillWeights.get(skillLower) || 1; // Default weight 1 if not found
      return {
        original: skill,
        normalized: normalizeForMatching(skill),
        lower: skillLower,
        weight: weight
      };
    });
    
    const userSkillsNormalized = validatedSkills.map(skill => ({
      original: skill,
      normalized: normalizeForMatching(skill),
      lower: skill.toLowerCase()
    }));
    
    const getTechnologyFamily = (normalizedValue) => {
      if (!normalizedValue) {
        return normalizedValue;
      }

      const value = normalizedValue.toLowerCase();

      // Handle NoSQL indicators first to avoid being caught by generic SQL checks
      if (value.includes('nosql')) {
        return 'nosql';
      }

      const nosqlIndicators = [
        'mongodb',
        'cassandra',
        'dynamodb',
        'couchbase',
        'cosmosdb',
        'elasticsearch',
        'elastic',
        'firebase',
        'firestore',
        'redis'
      ];

      if (nosqlIndicators.some(indicator => value.includes(indicator))) {
        return 'nosql';
      }

      // Broad SQL family detection
      if (value === 'sql' || value.startsWith('sql') || value.endsWith('sql')) {
        return 'sql';
      }

      const sqlIndicators = [
        'mysql',
        'mssql',
        'sqlserver',
        'postgresql',
        'postgres',
        'postgre',
        'pgsql',
        'tsql',
        'plsql',
        'mariadb',
        'sqlite',
        'redshift',
        'snowflake',
        'synapse',
        'bigquery',
        'aurora',
        'aurorasql',
        'db2',
        'teradata',
        'vertica',
        'hana'
      ];

      if (sqlIndicators.some(indicator => value.includes(indicator))) {
        return 'sql';
      }

      return normalizedValue;
    };

    // Check if a skill matches a keyword (handles variations)
    const skillMatchesKeyword = (skillNorm, keywordNorm) => {
      // Exact match after normalization
      if (skillNorm === keywordNorm) return true;

      // Skip very short terms
      if (skillNorm.length < 2 || keywordNorm.length < 2) return false;

      // Handle common abbreviations and variations
      const commonMappings = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'rb': 'ruby',
        'cs': 'csharp',
        'c#': 'csharp',
        'cpp': 'cplusplus',
        'c++': 'cplusplus',
        'ml': 'machinelearning',
        'ai': 'artificialintelligence',
        'nlp': 'naturallanguageprocessing',
        'bi': 'businessintelligence',
        'ci': 'continuousintegration',
        'cd': 'continuousdeployment',
        'cicd': 'continuousintegration',
        'rdbms': 'relationaldatabase',
        'nosql': 'nosql',
        'ux': 'userinterface',
        'ui': 'userinterface',
        'qa': 'qualityassurance',
        'uat': 'useracceptancetesting',
        'sit': 'systemintegrationtesting',
        'sql': 'sql',
        'php': 'php',
        'html': 'html',
        'css': 'css',
        'mssql': 'sql',
        'mysql': 'sql',
        'postgresql': 'sql',
        'mongodb': 'nosql',
        'cassandra': 'nosql',
        'dynamodb': 'nosql'
      };

      // Special skill-to-keyword mappings (handles variations like "Agile Methodologies" → "Agile")
      const skillToKeywordMappings = {
        'agilemethodologies': 'agile',
        'agile': 'agile',
        'cicd': 'devops',
        'continuousintegration': 'devops',
        'continuousdeployment': 'devops',
        'devops': 'devops',
        'docker': 'containers',
        'container': 'containers',
        'kubernetes': 'containers',
        'k8s': 'containers',
        'restfulapis': 'restfulapis',
        'restapi': 'restfulapis',
        'restapis': 'restfulapis',
        'api': 'restfulapis',
        'javascript': 'javascript',
        'js': 'javascript',
        'typescript': 'javascript', // TypeScript is a JS framework
        'aspnet': 'aspnet',
        'aspdotnet': 'aspnet',
        'net': 'aspnet',
        'dotnet': 'aspnet',
        'csharp': 'csharp',
        'c#': 'csharp',
        'vb': 'csharp', // VB.NET is similar to C#
        'sql': 'sql',
        'mssql': 'sql',
        'nosql': 'nosql',
        'mongodb': 'nosql',
        'github': 'github',
        'git': 'github'
      };

      // Check if one is an abbreviation of the other
      const skillMapped = commonMappings[skillNorm] || skillNorm;
      const keywordMapped = commonMappings[keywordNorm] || keywordNorm;

      if (skillMapped === keywordMapped) return true;

      // Use special skill-to-keyword mappings for better matching
      const skillMappedToKeyword = skillToKeywordMappings[skillNorm] || skillNorm;
      const keywordMappedToKeyword = skillToKeywordMappings[keywordNorm] || keywordNorm;
      
      if (skillMappedToKeyword === keywordMappedToKeyword) return true;
      
      // Also check if skill maps to keyword directly
      if (skillToKeywordMappings[skillNorm] && skillToKeywordMappings[skillNorm] === keywordNorm) return true;
      if (skillToKeywordMappings[keywordNorm] && skillToKeywordMappings[keywordNorm] === skillNorm) return true;
      
      // Check reverse mappings
      if (skillMappedToKeyword === keywordMapped || keywordMappedToKeyword === skillMapped) return true;

      // Extract base words (remove common suffixes like "programming", "development", etc.)
      const extractBaseWord = (text) => {
        const commonSuffixes = ['programming', 'development', 'design', 'management', 'testing', 'analysis', 'engineering'];
        let base = text;
        for (const suffix of commonSuffixes) {
          if (base.endsWith(suffix)) {
            base = base.slice(0, -suffix.length).trim();
            break;
          }
        }
        return base;
      };

      const skillBase = extractBaseWord(skillNorm);
      const keywordBase = extractBaseWord(keywordNorm);

      // If base words match, they're the same skill
      if (skillBase === keywordBase && skillBase.length >= 3) {
        return true;
      }

      // One contains the other (handles variations like "mongodb" vs "mongo", "reactjs" vs "react")
      const longer = skillNorm.length >= keywordNorm.length ? skillNorm : keywordNorm;
      const shorter = skillNorm.length < keywordNorm.length ? skillNorm : keywordNorm;

      if (longer.includes(shorter)) {
        // Require at least 3 characters for the shorter term (except for common 2-letter tech terms)
        const techAbbreviations = new Set(['js', 'ts', 'py', 'rb', 'go', 'ai', 'ml', 'bi', 'ci', 'cd', 'ux', 'ui', 'qa', 'sql']);
        if (shorter.length < 3 && !techAbbreviations.has(shorter)) return false;

        // Don't match if the longer term is significantly longer (e.g., "php" should not match "php programming")
        // unless the shorter is at least 70% of the longer
        if (longer.length > shorter.length * 1.5) {
          // For multi-word phrases, require the shorter to be a complete word
          const longerWords = longer.split(/\s+/);
          const shorterWords = shorter.split(/\s+/);
          
          // If shorter is a single word and longer contains it as a word, allow match
          if (shorterWords.length === 1 && longerWords.includes(shorterWords[0])) {
            return true;
          }
          
          // Otherwise, require very high ratio
          const ratio = shorter.length / longer.length;
          return ratio >= 0.7;
        }

        // For similar-length terms, allow more flexible matching
        if (longer.length > 8) {
          // Must be at least 60% of the length for longer terms
          const ratio = shorter.length / longer.length;
          return ratio >= 0.6;
        } else {
          // For shorter terms, allow more flexible matching
          const ratio = shorter.length / longer.length;
          return ratio >= 0.5 || shorter.length >= 4;
        }
      }

      // Check reverse mapping (e.g., "javascript" contains "js")
      if ((skillMapped.includes(keywordNorm) || keywordMapped.includes(skillNorm)) &&
          Math.abs(skillNorm.length - keywordNorm.length) <= 3) {
        return true;
      }

      // Special cases for framework matching
      // "React", "Angular", "Next" should match "JavaScript frameworks" or "JavaScript"
      const jsFrameworks = ['react', 'angular', 'vue', 'next', 'nextjs'];
      if ((jsFrameworks.includes(skillNorm) && (keywordNorm === 'javascript' || keywordNorm.includes('javascript') || keywordNorm.includes('framework'))) ||
          (jsFrameworks.includes(keywordNorm) && (skillNorm === 'javascript' || skillNorm.includes('javascript') || skillNorm.includes('framework')))) {
        return true;
      }

      // ASP.NET and .NET matching
      if ((skillNorm.includes('aspnet') || skillNorm.includes('net') || skillNorm === 'dotnet') &&
          (keywordNorm.includes('aspnet') || keywordNorm.includes('net') || keywordNorm === 'dotnet')) {
        return true;
      }

      // C# and VB.NET matching
      if ((skillNorm === 'csharp' || skillNorm === 'c#') &&
          (keywordNorm === 'csharp' || keywordNorm === 'c#' || keywordNorm.includes('vb'))) {
        return true;
      }

      const skillFamily = getTechnologyFamily(skillNorm);
      const keywordFamily = getTechnologyFamily(keywordNorm);

      if (skillFamily === 'sql' && keywordFamily === 'sql') {
        return true;
      }

      if (skillFamily === 'nosql' && keywordFamily === 'nosql') {
        return true;
      }

      return false;
    };
    
    // Find skills that are present in the job description
    // Sort JD keywords by weight (importance) - most important first
    const sortedJdKeywords = [...jdKeywordsNormalized].sort((a, b) => {
      // Sort by weight (descending), then by original name
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }
      return a.original.localeCompare(b.original);
    });
    
    const matchedJdIndices = new Set();
    const presentSkillsWithScores = [];
    const matchedNormalizedKeywords = new Set(); // Track normalized keywords to prevent duplicates
    
    // Problem 3 Fix: Weighted matching instead of binary
    // Match against sorted JD keywords (most important first)
    validatedSkills.forEach(skill => {
      const skillNormalized = normalizeForMatching(skill);
      
      // Check if this skill matches any JD keyword (checking most important first)
      for (let jdKeyword of sortedJdKeywords) {
        // Find original index in jdKeywordsNormalized
        const originalIndex = jdKeywordsNormalized.findIndex(k => 
          k.original === jdKeyword.original && k.normalized === jdKeyword.normalized
        );
        
        if (originalIndex === -1 || matchedJdIndices.has(originalIndex)) {
          continue;
        }
        
        if (skillMatchesKeyword(skillNormalized, jdKeyword.normalized)) {
          const normalizedKeyword = jdKeyword.normalized;
          
          // Skip if we've already added this normalized keyword (prevents duplicates)
          if (matchedNormalizedKeywords.has(normalizedKeyword)) {
            continue;
          }
          
          matchedJdIndices.add(originalIndex); // Mark this JD keyword as matched
          matchedNormalizedKeywords.add(normalizedKeyword); // Track normalized form
          
          // Use JD keyword name (titleized) instead of user skill name for consistency
          presentSkillsWithScores.push({
            skill: titleize(jdKeyword.original), // Use JD keyword, not user skill
            normalized: normalizedKeyword,
            weight: jdKeyword.weight || 1
          });
          break; // Only match once per user skill
        }
      }
    });
    
    // Sort present skills by weight (descending) - most important first
    presentSkillsWithScores.sort((a, b) => {
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }
      return a.skill.localeCompare(b.skill);
    });
    
    // Helper function to shuffle array (Fisher-Yates algorithm)
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Helper function for subtle randomization (only swaps a few random pairs)
    const subtleShuffle = (array) => {
      if (array.length <= 1) return array;
      const shuffled = [...array];
      // Only do a few random swaps (about 20-30% of array length, but at least 2-3 swaps)
      const numSwaps = Math.max(2, Math.min(Math.floor(array.length * 0.25), 10));
      for (let i = 0; i < numSwaps; i++) {
        const idx1 = Math.floor(Math.random() * shuffled.length);
        const idx2 = Math.floor(Math.random() * shuffled.length);
        if (idx1 !== idx2) {
          [shuffled[idx1], shuffled[idx2]] = [shuffled[idx2], shuffled[idx1]];
        }
      }
      return shuffled;
    };

    // Split present skills into important (weight >= 2) and less important (weight < 2)
    let importantPresentSkills = presentSkillsWithScores
      .filter(item => (item.weight || 1) >= 2)
      .map(item => item.skill);
    let lessImportantPresentSkills = presentSkillsWithScores
      .filter(item => (item.weight || 1) < 2)
      .map(item => item.skill);
    
    const presentSkills = presentSkillsWithScores.map(item => item.skill);
    const presentWeight = presentSkillsWithScores.reduce((sum, item) => sum + (item.weight || 1), 0);
    
    // Find all keywords from JD that user doesn't have (excluding matched ones)
    // Sort by weight (descending) - most important missing skills first
    const missingSkills = jdKeywordsNormalized
      .filter((kw, index) => {
        // Exclude matched indices
        if (matchedJdIndices.has(index)) {
          return false;
        }
        // Exclude if normalized form was already matched
        if (matchedNormalizedKeywords.has(kw.normalized)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by weight (descending), then alphabetically
        if (b.weight !== a.weight) {
          return b.weight - a.weight;
        }
        return a.original.localeCompare(b.original);
      });
    
    // Split missing skills into important (weight >= 2) and less important (weight < 2)
    let importantMissingSkills = missingSkills
      .filter(kw => (kw.weight || 1) >= 2)
      .map(kw => titleize(kw.original));
    let lessImportantMissingSkills = missingSkills
      .filter(kw => (kw.weight || 1) < 2)
      .map(kw => titleize(kw.original));
    
    // Randomize the skills: subtle shuffle for matching, full shuffle for missing
    importantPresentSkills = subtleShuffle(importantPresentSkills);
    importantMissingSkills = shuffleArray(importantMissingSkills);
    lessImportantPresentSkills = subtleShuffle(lessImportantPresentSkills);
    lessImportantMissingSkills = shuffleArray(lessImportantMissingSkills);
    
    const allSkills = missingSkills.map(kw => titleize(kw.original));
    const missingWeight = missingSkills.reduce((sum, kw) => sum + (kw.weight || 1), 0);
    const totalWeight = presentWeight + missingWeight;
    
    // Problem 3 Fix: Calculate weighted match percentage
    const weightedMatchPercentage = totalWeight > 0
      ? Math.round((presentWeight / totalWeight) * 100)
      : 0;
    
    // Return response with weighted matching and bifurcated by importance
    const responseData = {
      present_skills: presentSkills, // Skills user has that match JD (all)
      missing_skills: allSkills, // All other skills found in JD (all)
      // Important keywords (weight >= 2)
      important_present_skills: importantPresentSkills,
      important_missing_skills: importantMissingSkills,
      // Less important keywords (weight < 2)
      less_important_present_skills: lessImportantPresentSkills,
      less_important_missing_skills: lessImportantMissingSkills,
      match_percentage: weightedMatchPercentage, // Weighted match percentage
      total_important_keywords: presentSkills.length + allSkills.length,
      present_count: presentSkills.length,
      // Weighted statistics
      present_weight: presentWeight,
      missing_weight: missingWeight,
      total_weight: totalWeight,
      bifurcated: true,
      // Step-by-step processing details
      processing_steps: {
        step1_phrasematcher: {
          name: "spaCy PhraseMatcher",
          description: "Extract skills using PhraseMatcher with 38k skills database",
          total_matches: stats.total_matches || 0,
          raw_matches: extractResponse.data?.matches?.slice(0, 20) || [], // First 20 matches
          stats: {
            total_matches: stats.total_matches || 0,
            garbage_filtered: stats.garbage_filtered || 0,
            low_priority_filtered: stats.low_priority_filtered || 0
          }
        },
        step2_semantic_classification: {
          name: "Semantic Classification (Sentence Transformers)",
          description: "Classify skills using embeddings into important/less important/non-technical",
          important_skills_count: importantSkills.length,
          less_important_skills_count: lessImportantSkills.length,
          non_technical_skills_count: nonTechnicalSkills.length,
          important_skills: importantSkills.slice(0, 20), // First 20
          less_important_skills: lessImportantSkills.slice(0, 20),
          non_technical_skills: nonTechnicalSkills.slice(0, 20),
          classifier_available: classifierAvailable
        },
        step3_normalization: {
          name: "Skill Normalization",
          description: "Normalize and canonicalize skill names",
          normalized_skills: jdSkills.slice(0, 20), // First 20 normalized skills
          total_normalized: jdSkills.length
        },
        step4_matching: {
          name: "Skill Matching",
          description: "Match user skills with extracted keywords",
          matched_count: presentSkills.length,
          missing_count: allSkills.length,
          match_percentage: weightedMatchPercentage
        }
      },
      // All extracted keywords for display
      extractedKeywords: jdSkills,
      matchedSkills: presentSkills,
      missingSkills: allSkills
    };
    
    // Final summary - only log in development or if slow
    const totalDuration = Date.now() - startTime;
    if (isDev || totalDuration > 2000) {
      console.log(`[Keywords] ✅ Completed in ${totalDuration}ms - Match: ${responseData.match_percentage}% (${responseData.present_count}/${responseData.total_important_keywords})`);
    }
    
    // Send response
    res.json({
      result: responseData
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[Keywords] ❌ Error (${totalDuration}ms): ${error.message}`);
    if (isDev) {
      console.error(`[Keywords] Stack: ${error.stack}`);
    }
    next(error);
  }
};

// ============================================================================
// Exports
// ============================================================================

module.exports = { generateKeywords };
