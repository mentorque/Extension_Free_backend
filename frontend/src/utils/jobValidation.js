// utils/jobValidation.js - Validation utilities for job data

/**
 * Validates if a job has proper role summary and description
 * @param {Object} jobData - Job data object from scraper
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateJobData = (jobData) => {
  const errors = [];
  
  if (!jobData) {
    errors.push('No job data available');
    return { isValid: false, errors };
  }
  
  // Title validation
  if (!jobData.title || jobData.title.trim().length === 0) {
    errors.push('Job title is missing');
  } else if (jobData.title.trim().length < 3) {
    errors.push('Job title is too short');
  }
  
  // Description validation - proper format check
  if (!jobData.description || jobData.description.trim().length === 0) {
    errors.push('Job description is missing');
  } else if (jobData.description.trim().length < 50) {
    errors.push('Job description is too short (minimum 50 characters)');
  }
  
  // Check for company (optional but recommended)
  if (!jobData.company || jobData.company.trim().length === 0) {
    console.warn('[JOB_VALIDATION] Company name is missing but job can still be tracked');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Checks if a job is already tracked
 * @param {string} url - Job URL
 * @param {Array} appliedJobs - List of already applied jobs
 * @returns {boolean}
 */
export const isJobAlreadyTracked = (url, appliedJobs) => {
  if (!url || !Array.isArray(appliedJobs)) {
    return false;
  }
  
  return appliedJobs.some(job => job.url === url);
};

/**
 * Checks if job data has minimum required quality for tracking
 * @param {Object} jobData - Job data object
 * @returns {Object} - { meetsStandards: boolean, message: string }
 */
export const checkJobDataQuality = (jobData) => {
  const validation = validateJobData(jobData);
  
  if (!validation.isValid) {
    return {
      meetsStandards: false,
      message: validation.errors.join(', ')
    };
  }
  
  // Additional quality checks
  const qualityIssues = [];
  
  // Check if description has meaningful content (not just placeholders)
  const descriptionLower = jobData.description.toLowerCase();
  const suspiciousPatterns = ['loading...', 'please wait', 'error', 'not found'];
  
  if (suspiciousPatterns.some(pattern => descriptionLower.includes(pattern))) {
    qualityIssues.push('Description appears to be incomplete or loading');
  }
  
  // Check if title is not just special characters or numbers
  if (jobData.title && !/[a-zA-Z]{3,}/.test(jobData.title)) {
    qualityIssues.push('Job title appears invalid');
  }
  
  if (qualityIssues.length > 0) {
    return {
      meetsStandards: false,
      message: qualityIssues.join(', ')
    };
  }
  
  return {
    meetsStandards: true,
    message: 'Job data meets quality standards'
  };
};

/**
 * Formats job data for tracking
 * @param {Object} jobData - Raw job data
 * @param {string} currentUrl - Current page URL
 * @returns {Object} - Formatted job object for API
 */
export const formatJobForTracking = (jobData, currentUrl) => {
  return {
    title: jobData.title?.trim() || '',
    url: currentUrl,
    company: jobData.company?.trim() || '',
    location: jobData.location?.trim() || '',
    appliedDate: new Date().toISOString(),
    appliedText: 'Manually tracked',
    description: jobData.description?.trim() || '' // Include for validation but may not be stored
  };
};

