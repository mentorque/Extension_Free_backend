// utils/trackJobService.js - Service for tracking job applications
import { apiClient } from './apiClient.js';
import { APPLIED_JOBS_URL } from '../constants/index.js';
import { 
  validateJobData, 
  isJobAlreadyTracked, 
  checkJobDataQuality,
  formatJobForTracking 
} from './jobValidation.js';

/**
 * Track a job application
 * @param {Object} params - Tracking parameters
 * @param {Object} params.jobData - Job data from scraper
 * @param {string} params.currentUrl - Current page URL
 * @param {Array} params.appliedJobs - List of already applied jobs
 * @param {string} params.apiKey - User API key
 * @returns {Promise<Object>} - { success: boolean, message: string, job?: Object, error?: string }
 */
export const trackJob = async ({ jobData, currentUrl, appliedJobs, apiKey }) => {
  const startTime = Date.now();
  
  console.log('[TRACK_JOB_SERVICE] Starting job tracking process:', {
    hasJobData: !!jobData,
    url: currentUrl?.substring(0, 100) + (currentUrl?.length > 100 ? '...' : ''),
    appliedJobsCount: appliedJobs?.length || 0,
    hasApiKey: !!apiKey
  });
  
  try {
    // Step 1: Validate job data
    const validation = validateJobData(jobData);
    if (!validation.isValid) {
      console.warn('[TRACK_JOB_SERVICE] Validation failed:', validation.errors);
      return {
        success: false,
        message: `❌ ${validation.errors[0]}`,
        error: validation.errors.join(', ')
      };
    }
    
    // Step 2: Check data quality
    const qualityCheck = checkJobDataQuality(jobData);
    if (!qualityCheck.meetsStandards) {
      console.warn('[TRACK_JOB_SERVICE] Quality check failed:', qualityCheck.message);
      return {
        success: false,
        message: `❌ ${qualityCheck.message}`,
        error: qualityCheck.message
      };
    }
    
    // Step 3: Check if already tracked
    if (isJobAlreadyTracked(currentUrl, appliedJobs)) {
      console.log('[TRACK_JOB_SERVICE] Job already tracked');
      return {
        success: false,
        message: 'ℹ️ Already tracking this job',
        error: 'Job already tracked'
      };
    }
    
    // Step 4: Format job data for API
    const jobToTrack = formatJobForTracking(jobData, currentUrl);
    
    console.log('[TRACK_JOB_SERVICE] Sending tracking request to API:', {
      title: jobToTrack.title?.substring(0, 50) + (jobToTrack.title?.length > 50 ? '...' : ''),
      company: jobToTrack.company,
      url: jobToTrack.url?.substring(0, 100) + (jobToTrack.url?.length > 100 ? '...' : '')
    });
    
    // Step 5: Make API request
    const response = await apiClient.post(APPLIED_JOBS_URL, jobToTrack, {
      headers: {
        'x-api-key': apiKey
      }
    });
    
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    if (data.success) {
      console.log(`[TRACK_JOB_SERVICE] Successfully tracked job in ${duration}ms:`, {
        id: data.appliedJob?.id,
        title: data.appliedJob?.title?.substring(0, 50)
      });
      
      return {
        success: true,
        message: '✅ Job tracked successfully!',
        job: data.appliedJob
      };
    } else {
      console.error(`[TRACK_JOB_SERVICE] API returned failure after ${duration}ms:`, data.message);
      return {
        success: false,
        message: '❌ Failed to track job',
        error: data.message || 'Unknown error'
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[TRACK_JOB_SERVICE] Error tracking job after ${duration}ms:`, {
      message: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      message: '❌ Failed to track job',
      error: error.message
    };
  }
};

/**
 * Get all tracked jobs for the current user
 * @param {string} apiKey - User API key
 * @returns {Promise<Object>} - { success: boolean, jobs?: Array, error?: string }
 */
export const getTrackedJobs = async (apiKey) => {
  const startTime = Date.now();
  
  console.log('[TRACK_JOB_SERVICE] Fetching tracked jobs...');
  
  try {
    const response = await apiClient.get(APPLIED_JOBS_URL, {
      headers: {
        'x-api-key': apiKey
      }
    });
    
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    if (data.success) {
      console.log(`[TRACK_JOB_SERVICE] Successfully fetched ${data.appliedJobs?.length || 0} jobs in ${duration}ms`);
      return {
        success: true,
        jobs: data.appliedJobs || []
      };
    } else {
      console.error(`[TRACK_JOB_SERVICE] Failed to fetch jobs after ${duration}ms:`, data.message);
      return {
        success: false,
        error: data.message || 'Failed to fetch tracked jobs'
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[TRACK_JOB_SERVICE] Error fetching jobs after ${duration}ms:`, {
      message: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete a tracked job
 * @param {string} jobId - Job ID to delete
 * @param {string} apiKey - User API key
 * @returns {Promise<Object>} - { success: boolean, error?: string }
 */
export const deleteTrackedJob = async (jobId, apiKey) => {
  const startTime = Date.now();
  
  console.log('[TRACK_JOB_SERVICE] Deleting job:', jobId);
  
  try {
    const response = await apiClient.request(`${APPLIED_JOBS_URL}/${jobId}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': apiKey
      }
    });
    
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      console.log(`[TRACK_JOB_SERVICE] Successfully deleted job in ${duration}ms`);
      return { success: true };
    } else {
      console.error(`[TRACK_JOB_SERVICE] Failed to delete job after ${duration}ms`);
      return {
        success: false,
        error: 'Failed to delete job'
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[TRACK_JOB_SERVICE] Error deleting job after ${duration}ms:`, {
      message: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if track job button should be enabled
 * @param {Object} jobData - Job data to check
 * @returns {Object} - { enabled: boolean, disabledReason?: string }
 */
export const shouldEnableTrackButton = (jobData) => {
  if (!jobData) {
    return {
      enabled: false,
      disabledReason: 'No job data available'
    };
  }
  
  const validation = validateJobData(jobData);
  if (!validation.isValid) {
    return {
      enabled: false,
      disabledReason: validation.errors[0]
    };
  }
  
  const qualityCheck = checkJobDataQuality(jobData);
  if (!qualityCheck.meetsStandards) {
    return {
      enabled: false,
      disabledReason: qualityCheck.message
    };
  }
  
  return {
    enabled: true
  };
};

