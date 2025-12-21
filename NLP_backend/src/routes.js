const express = require('express');

// Controllers
const { uploadResume } = require('./controllers/uploadResume');
const { generateKeywords } = require('./controllers/keywords');
const { generateExperience } = require('./controllers/experience');
const { generateCoverLetter } = require('./controllers/coverletter'); 
const { chatWithContext } = require('./controllers/chat');
const { hrLookup } = require('./controllers/hrLookup');

const router = express.Router();

// Health check routes
router.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/upload-resume', uploadResume);
router.post('/generate-keywords', generateKeywords);
 router.post('/generate-experience', generateExperience);
 router.post('/generate-cover-letter', generateCoverLetter);
 router.post('/chat', chatWithContext);
router.post('/hr-lookup', hrLookup);

module.exports = router;
