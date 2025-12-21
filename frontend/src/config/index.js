// frontend/src/config/index.js
export const config = {
  // Use local backend for development, Railway for production
  // Set VITE_API_BASE_URL environment variable to override
  // Note: Backend routes are mounted at /api, so base URL should include /api
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  websiteUrl: process.env.VITE_WEBSITE_URL || 'https://app.mentorquedu.com/api-keys'
};

export default config;