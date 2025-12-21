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

// ============================================================================
// Configuration
// ============================================================================

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://127.0.0.1:8001';
const NLP_SERVICE_PORT = new URL(NLP_SERVICE_URL).port || '8001';
const NLP_SERVICE_TIMEOUT = 120000; // 2 minutes (allows time for model download)
const HEALTH_CHECK_TIMEOUT = 15000; // 15 seconds
const MAX_PRESENT_SKILLS = 15; // Maximum number of present skills to show
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
      // Option 1: venv at MentorqueAIHRExtension-main level
      path.resolve(__dirname, '../../../venv', 'bin', 'python'),
      // Option 2: venv at TEST level (parent of MentorqueAIHRExtension-main)
      path.resolve(__dirname, '../../../../venv', 'bin', 'python'),
      // Option 3: .venv at TEST level
      path.resolve(__dirname, '../../../../.venv', 'bin', 'python'),
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
  const pollInterval = 300; // 300ms between checks
  
  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await axios.get(`${serviceUrl}/health`, { 
        timeout: 1500,
        validateStatus: (status) => status === 200
      });
      
      if (response.status === 200 && response.data?.status === 'healthy') {
        console.log('[Keywords] NLP service is healthy');
        return true;
      }
    } catch (error) {
      // Service not ready yet, continue polling
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  return false;
}

/**
 * Ensure the NLP service is running, starting it if necessary
 * @param {string} serviceUrl - Base URL of the NLP service
 * @throws {Error} If service cannot be started
 */
async function ensureNlpService(serviceUrl) {
  // Check if service is already running
  if (await waitForServiceHealth(serviceUrl, 1500)) {
    return;
  }
  
  // Prevent multiple simultaneous startup attempts
  if (nlpStarting) {
    console.log('[Keywords] NLP service startup already in progress, waiting...');
    const isHealthy = await waitForServiceHealth(serviceUrl, HEALTH_CHECK_TIMEOUT);
    if (!isHealthy) {
      throw new Error('NLP service failed to start within timeout period');
    }
    return;
  }
  
  nlpStarting = true;
  
  try {
    console.log('[Keywords] Starting NLP service...');
    
    // Go up 3 levels from backend/src/controllers/ to project root, then into backend/nlp_service
    const backendRoot = path.resolve(__dirname, '../../');
    const nlpServiceDir = path.join(backendRoot, 'nlp_service');
    
    // Verify NLP service directory exists
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
    
    console.log(`[Keywords] Spawning: ${pythonBin} ${args.join(' ')}`);
    
    // Spawn the NLP service process
    nlpProcess = spawn(pythonBin, args, {
      cwd: nlpServiceDir,
      stdio: ['ignore', 'pipe', 'pipe'], // Capture stdout and stderr
      detached: true
    });
    
    // Log output for debugging
    nlpProcess.stdout?.on('data', (data) => {
      console.log(`[NLP Service] ${data.toString().trim()}`);
    });
    
    nlpProcess.stderr?.on('data', (data) => {
      console.error(`[NLP Service Error] ${data.toString().trim()}`);
    });
    
    nlpProcess.on('error', (error) => {
      console.error(`[NLP Service] Failed to start:`, error);
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
    const isHealthy = await waitForServiceHealth(serviceUrl, HEALTH_CHECK_TIMEOUT);
    
    if (!isHealthy) {
      throw new Error('NLP service failed to become healthy within timeout period');
    }
    
    console.log('[Keywords] NLP service started successfully');
    
  } catch (error) {
    console.error('[Keywords] Failed to start NLP service:', error.message);
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
  try {
    const { jobDescription, skills } = req.body;
    
    // Validate input
    if (!jobDescription || typeof jobDescription !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'jobDescription must be a non-empty string'
      });
    }
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'skills must be an array'
      });
    }
    
    // Sanitize and validate skills
    const validatedSkills = validateSkills(skills);
    
    console.log(`[Keywords] Processing job description (${jobDescription.length} chars) with ${validatedSkills.length} user skills`);
    
    // Ensure NLP service is running
    try {
      await ensureNlpService(NLP_SERVICE_URL);
    } catch (error) {
      console.error('[Keywords] Failed to ensure NLP service:', error);
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'NLP service could not be started. Please ensure Python dependencies are installed.'
      });
    }
    
    // Extract keywords from job description
    let extractResponse;
    try {
      extractResponse = await axios.post(
        `${NLP_SERVICE_URL}/extract`,
        { text: jobDescription },
        { 
          timeout: NLP_SERVICE_TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('[Keywords] Error calling NLP service:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Could not connect to NLP service'
        });
      }
      
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        return res.status(504).json({
          error: 'Request timeout',
          message: 'NLP service took too long to respond'
        });
      }
      
      throw error;
    }
    
    // Extract keywords from response
    const jdKeywords = Array.isArray(extractResponse.data?.keywords) 
      ? extractResponse.data.keywords 
      : [];
    
    console.log(`[Keywords] Extracted ${jdKeywords.length} keywords from job description`);
    
    // Score and filter keywords by importance (only keep IMPORTANT ones)
    // IMPORTANT: Only show keywords with importance >= 60 to avoid overwhelming users
    const scoredKeywords = jdKeywords
      .map(kw => ({
        keyword: kw,
        importance: calculateKeywordImportance(kw)
      }))
      .filter(item => item.importance >= 60); // Only keep high-priority keywords (60+)

    // Remove duplicates based on normalized form
    const normalizeForMatching = (text) => {
      return String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ''); // Remove spaces, dots, dashes, etc.
    };

    const keywordMap = new Map(); // Map normalized -> best keyword entry
    
    // First pass: basic deduplication and consolidation
    scoredKeywords.forEach(item => {
      const normalized = normalizeForMatching(item.keyword);
      
      // Check if we already have a similar keyword
      if (keywordMap.has(normalized)) {
        // Keep the one with higher importance
        const existing = keywordMap.get(normalized);
        if (item.importance > existing.importance) {
          keywordMap.set(normalized, item);
        }
        return;
      }
      
      // Check if this keyword is a subset/superset of an existing one
      let isSubset = false;
      let toRemove = [];
      
      for (const [existingNorm, existingItem] of keywordMap.entries()) {
        // If one contains the other after normalization
        if (normalized.length > existingNorm.length) {
          // Current is longer - check if it contains existing
          if (normalized.includes(existingNorm) && existingNorm.length >= 3) {
            // Current keyword is more specific (e.g., "phpprogramming" contains "php")
            // Prefer the more specific one if importance is similar
            if (item.importance >= existingItem.importance * 0.7) {
              toRemove.push(existingNorm);
              isSubset = true;
            } else {
              // Existing is more important, skip current
              isSubset = true;
              break;
            }
          }
        } else if (existingNorm.includes(normalized) && normalized.length >= 3) {
          // Existing is longer - it's more specific
          // Only keep existing if it's significantly more important
          if (existingItem.importance >= item.importance * 0.7) {
            isSubset = true;
            break;
          } else {
            // Current is more important, replace existing
            toRemove.push(existingNorm);
            isSubset = false; // Will add current
            break;
          }
        }
      }
      
      // Remove superseded keywords
      toRemove.forEach(norm => keywordMap.delete(norm));
      
      if (!isSubset) {
        keywordMap.set(normalized, item);
      }
    });

    // Convert back to array
    const deduplicatedKeywords = Array.from(keywordMap.values());

    // Sort by importance after deduplication
    deduplicatedKeywords.sort((a, b) => b.importance - a.importance);

    const importantKeywords = deduplicatedKeywords.map(item => item.keyword);

    console.log(`[Keywords] Filtered to ${importantKeywords.length} important keywords (from ${jdKeywords.length} total, ${scoredKeywords.length} scored, ${deduplicatedKeywords.length} deduplicated)`);

    // Create normalized versions for matching (using deduplicated important keywords)
    const jdKeywordsNormalized = deduplicatedKeywords.map(item => ({
      original: item.keyword,
      normalized: normalizeForMatching(item.keyword),
      lower: String(item.keyword || '').toLowerCase(),
      importance: item.importance
    }));
    
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
    const matchedJdIndices = new Set();
    const presentSkillsWithScores = [];
    const matchedNormalizedKeywords = new Set(); // Track normalized keywords to prevent duplicates
    
    validatedSkills.forEach(skill => {
      const skillNormalized = normalizeForMatching(skill);
      
      // Filter out generic user skills (they shouldn't count as valuable matches)
      const skillImportance = calculateKeywordImportance(skill);
      if (skillImportance < 30) {
        return; // Skip generic skills like "Communication", "Teamwork", etc.
      }
      
      // Check if this skill matches any JD keyword
      for (let i = 0; i < jdKeywordsNormalized.length; i++) {
        // Skip if this JD keyword index was already matched
        if (matchedJdIndices.has(i)) {
          continue;
        }
        
        if (skillMatchesKeyword(skillNormalized, jdKeywordsNormalized[i].normalized)) {
          const normalizedKeyword = jdKeywordsNormalized[i].normalized;
          
          // Skip if we've already added this normalized keyword (prevents duplicates)
          if (matchedNormalizedKeywords.has(normalizedKeyword)) {
            continue;
          }
          
          matchedJdIndices.add(i); // Mark this JD keyword as matched
          matchedNormalizedKeywords.add(normalizedKeyword); // Track normalized form
          
          // Use JD keyword name (titleized) instead of user skill name for consistency
          presentSkillsWithScores.push({
            skill: titleize(jdKeywordsNormalized[i].original), // Use JD keyword, not user skill
            importance: jdKeywordsNormalized[i].importance,
            normalized: normalizedKeyword
          });
          break; // Only match once per user skill
        }
      }
    });
    
    // Sort present skills by importance and limit count
    presentSkillsWithScores.sort((a, b) => b.importance - a.importance);
    
    // Additional deduplication pass on present skills (handle variations)
    const presentSkillsDeduped = [];
    const seenPresentNormalized = new Set();
    for (const item of presentSkillsWithScores) {
      if (!seenPresentNormalized.has(item.normalized)) {
        seenPresentNormalized.add(item.normalized);
        presentSkillsDeduped.push(item.skill);
      }
    }
    
    const presentSkills = presentSkillsDeduped.slice(0, MAX_PRESENT_SKILLS);
    
    // Find keywords from JD that user doesn't have (excluding matched ones)
    const missingKeywordsWithScores = jdKeywordsNormalized
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
      .map(kw => ({
        keyword: titleize(kw.original),
        importance: kw.importance,
        normalized: kw.normalized
      }));
    
    // Sort by importance (descending) - most important first
    missingKeywordsWithScores.sort((a, b) => b.importance - a.importance);
    
    // Additional deduplication pass on missing skills - KEEP importance scores
    const missingSkillsDedupedWithScores = [];
    const seenMissingNormalized = new Set();
    for (const item of missingKeywordsWithScores) {
      if (!seenMissingNormalized.has(item.normalized)) {
        seenMissingNormalized.add(item.normalized);
        // Double-check it's not in present skills (extra safety)
        if (!matchedNormalizedKeywords.has(item.normalized)) {
          missingSkillsDedupedWithScores.push(item); // Keep full object with importance
        }
      }
    }
    
    // Final safety check: ensure no duplicates within present skills
    const finalPresentSkills = [];
    const finalPresentNormalized = new Set();
    for (const skill of presentSkills) {
      const normalized = normalizeForMatching(skill);
      if (!finalPresentNormalized.has(normalized)) {
        finalPresentNormalized.add(normalized);
        finalPresentSkills.push(skill);
      }
    }
    
    // Determine max missing skills based on matched count
    // Goal: If user already has many matches, only show the most critical missing keywords
    // Use actual matched count (not limited by MAX_PRESENT_SKILLS) to make accurate decisions
    const matchedCount = presentSkillsDeduped.length;
    const maxMissingToShow = getMaxMissingSkills(matchedCount);
    
    // Filter missing keywords based on matched count
    let filteredMissingSkills = [];
    
    if (matchedCount >= 6) {
      // User has good match (6+ keywords) - only show high-priority missing keywords (importance >= 80)
      // These are already sorted by importance (descending), so we take the top ones
      filteredMissingSkills = missingSkillsDedupedWithScores
        .filter(item => item.importance >= 80)
        .slice(0, maxMissingToShow)
        .map(item => item.keyword);
      
      console.log(`[Keywords] User has ${matchedCount} matches - showing only ${filteredMissingSkills.length} high-priority missing keywords (importance >= 80)`);
    } else if (matchedCount >= 3) {
      // User has moderate match (3-5 keywords) - show up to 6 missing keywords
      filteredMissingSkills = missingSkillsDedupedWithScores
        .slice(0, maxMissingToShow)
        .map(item => item.keyword);
      
      console.log(`[Keywords] User has ${matchedCount} matches - showing ${filteredMissingSkills.length} missing keywords`);
    } else {
      // User has few matches (<3) - show more missing keywords to help them
      filteredMissingSkills = missingSkillsDedupedWithScores
        .slice(0, maxMissingToShow)
        .map(item => item.keyword);
      
      console.log(`[Keywords] User has ${matchedCount} matches - showing ${filteredMissingSkills.length} missing keywords`);
    }
    
    const missingSkills = filteredMissingSkills;
    
    // Final safety check: ensure no keyword appears in both lists (using normalized comparison)
    const presentNormalizedSet = new Set(
      finalPresentSkills.map(skill => normalizeForMatching(skill))
    );
    const finalMissingSkills = missingSkills.filter(skill => {
      const normalized = normalizeForMatching(skill);
      if (presentNormalizedSet.has(normalized)) {
        console.warn(`[Keywords] Removing duplicate keyword from missing: ${skill} (already in present)`);
        return false;
      }
      return true;
    });
    
    // Return simplified response - NO bifurcation, just important keywords
    // IMPORTANT: total_important_keywords = what's actually displayed (present + missing shown)
    // Calculate based on ACTUAL arrays being returned to ensure 100% accuracy
    const responseData = {
      present_skills: finalPresentSkills, // Displayed list (max 15)
      missing_skills: finalMissingSkills, // Displayed list (filtered and limited)
      match_percentage: 0, // Will be calculated below
      total_important_keywords: 0, // Will be calculated below
      present_count: 0, // Will be calculated below
      bifurcated: false
    };
    
    // Calculate counts from the ACTUAL arrays in responseData
    const presentCount = responseData.present_skills.length;
    const displayedMissingCount = responseData.missing_skills.length;
    const totalDisplayed = presentCount + displayedMissingCount;
    
    // Calculate match percentage based on what's displayed
    const matchPercentage = totalDisplayed > 0 
      ? Math.round((presentCount / totalDisplayed) * 100)
      : 0;
    
    // Update responseData with calculated values
    responseData.match_percentage = matchPercentage;
    responseData.total_important_keywords = totalDisplayed;
    responseData.present_count = presentCount;
    
    // Debug logging
    console.log(`[Keywords] Present keywords displayed: ${presentCount}`);
    console.log(`[Keywords] Missing keywords displayed: ${displayedMissingCount}`);
    console.log(`[Keywords] Total displayed: ${presentCount} + ${displayedMissingCount} = ${totalDisplayed}`);
    console.log(`[Keywords] Match percentage: (${presentCount} / ${totalDisplayed}) * 100 = ${matchPercentage}%`);
    console.log(`[Keywords] Summary: ${presentCount} present, ${displayedMissingCount} missing, ${totalDisplayed} total, ${matchPercentage}% match`);
    
    // Send response
    res.json({
      result: responseData
    });
    
  } catch (error) {
    console.error('[Keywords] Unexpected error:', error);
    next(error);
  }
};

// ============================================================================
// Exports
// ============================================================================

module.exports = { generateKeywords };
