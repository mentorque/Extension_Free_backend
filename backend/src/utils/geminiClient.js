// backend/src/utils/geminiClient.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { gemini_flash } = require('./llms.json');

/**
 * Get all available Gemini API keys (primary + fallbacks)
 */
function getApiKeys() {
  const keys = [];
  
  // Primary key
  if (process.env.GEMINI_API_KEY) {
    keys.push(process.env.GEMINI_API_KEY);
  }
  
  // Fallback keys
  if (process.env.GEMINI_API_KEY_FALLBACK_1) {
    keys.push(process.env.GEMINI_API_KEY_FALLBACK_1);
  }
  
  if (process.env.GEMINI_API_KEY_FALLBACK_2) {
    keys.push(process.env.GEMINI_API_KEY_FALLBACK_2);
  }
  
  return keys;
}

/**
 * Check if error is a quota/resource exhausted error
 */
function isQuotaError(error) {
  if (!error) return false;
  
  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code || '';
  const errorStatus = error.status || '';
  
  // Check for various quota/resource exhausted indicators
  const quotaIndicators = [
    'quota',
    'resource exhausted',
    'rate limit',
    '429',
    '503',
    'insufficient quota',
    'quota exceeded',
    'billing',
    'permission denied'
  ];
  
  return quotaIndicators.some(indicator => 
    errorMessage.includes(indicator) || 
    errorCode.toString().includes(indicator) ||
    errorStatus.toString().includes(indicator)
  );
}

/**
 * Generate content with automatic fallback to next API key on quota errors
 * @param {string} prompt - The prompt to send to Gemini
 * @param {string} controllerName - Name of the controller for logging
 * @returns {Promise<Object>} - The response from Gemini
 */
async function generateContentWithFallback(prompt, controllerName = 'UNKNOWN') {
  const apiKeys = getApiKeys();
  
  if (apiKeys.length === 0) {
    throw new Error('No Gemini API keys configured. Please set GEMINI_API_KEY in environment variables.');
  }
  
  let lastError = null;
  
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    const keyIndex = i + 1;
    const isFallback = i > 0;
    
    try {
      console.log(`[${controllerName}] Attempting with API key ${keyIndex}${isFallback ? ' (fallback)' : ' (primary)'}`);
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: gemini_flash });
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      
      if (isFallback) {
        console.log(`[${controllerName}] Successfully used fallback API key ${keyIndex}`);
      }
      
      return response;
      
    } catch (error) {
      lastError = error;
      const isQuota = isQuotaError(error);
      
      console.error(`[${controllerName}] API key ${keyIndex} failed:`, {
        isQuotaError: isQuota,
        errorMessage: error.message,
        errorCode: error.code,
        hasMoreKeys: i < apiKeys.length - 1
      });
      
      // If it's a quota error and we have more keys, try the next one
      if (isQuota && i < apiKeys.length - 1) {
        console.log(`[${controllerName}] Quota exceeded, trying fallback API key ${keyIndex + 1}...`);
        continue;
      }
      
      // If it's not a quota error or it's the last key, throw the error
      throw error;
    }
  }
  
  // If we've exhausted all keys, throw the last error
  throw lastError || new Error('All API keys failed');
}

module.exports = {
  generateContentWithFallback,
  getApiKeys,
  isQuotaError
};

