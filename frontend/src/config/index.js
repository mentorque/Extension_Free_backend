// frontend/src/config/index.js
export const config = {
  // Railway production backend URL
  // Set VITE_API_BASE_URL environment variable to override
  // Note: Backend routes are mounted at /api, so base URL should include /api
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'https://nodejs-service-production-e9b3.up.railway.app/api',
  websiteUrl: process.env.VITE_WEBSITE_URL || 'https://app.mentorquedu.com/api-keys'
};

export default config;