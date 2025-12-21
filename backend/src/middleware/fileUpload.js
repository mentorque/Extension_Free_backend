// src/middleware/fileUpload.js
const multer = require('multer');

const fileUploadConfig = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs are allowed'), false);
    }
  }
});

const handleFileUpload = fileUploadConfig.single('resume');

module.exports = { handleFileUpload };
