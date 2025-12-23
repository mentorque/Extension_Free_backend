// backend/src/routes.js
const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateApiKey } = require('./middleware/auth');
const { handleFileUpload } = require('./middleware/fileUpload'); // FIXED: handleFileUpload instead of uploadMiddleware

// Import controllers
const authController = require('./controllers/auth');
const chatController = require('./controllers/chat');
const coverletterController = require('./controllers/coverletter');
const experienceController = require('./controllers/experience');
const hrLookupController = require('./controllers/hrLookup');
const keywordsController = require('./controllers/keywords');
const uploadResumeController = require('./controllers/uploadResume');
const appliedJobsController = require('./controllers/appliedJobs');

// Public routes (no auth required)
// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Public API key validation endpoint (no auth required)
router.post('/auth/validate', authController.validateApiKeyPublic);

// Protected routes (require API key)
router.use(authenticateApiKey); // Apply auth middleware to all routes below

// Chat routes
router.post('/chat', chatController.chatWithContext);

// Cover letter routes
router.post('/coverletter', coverletterController.generateCoverLetter);

// Experience routes
router.post('/experience', experienceController.generateExperience);

// HR Lookup routes
router.post('/hr-lookup', hrLookupController.hrLookup);

// Keywords routes
router.post('/keywords', keywordsController.generateKeywords);

// Resume upload routes - Accepts both JSON (resumeText) and file uploads
router.post('/upload-resume', (req, res, next) => {
  // If content-type is application/json, skip multer and go directly to controller
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    return uploadResumeController.uploadResume(req, res, next);
  }
  // Otherwise, use multer for file uploads (multipart/form-data)
  handleFileUpload(req, res, (err) => {
    if (err) {
      return next(err);
    }
    uploadResumeController.uploadResume(req, res, next);
  });
});

// Applied jobs routes
router.get('/applied-jobs', appliedJobsController.getAppliedJobs);
router.post('/applied-jobs', appliedJobsController.addAppliedJob);
router.delete('/applied-jobs/:id', appliedJobsController.deleteAppliedJob);
router.patch('/applied-jobs/:id/status', appliedJobsController.updateJobStatus);

module.exports = router;