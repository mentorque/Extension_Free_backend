// src/middleware/auth.js
const prisma = require('../utils/prismaClient');

const authenticateApiKey = async (req, res, next) => {
  const startTime = Date.now();
  const apiKey = req.headers['x-api-key'];
  
  console.log(`[AUTH] ${req.method} ${req.path} - Starting authentication`);
  
  try {
    if (!apiKey) {
      const duration = Date.now() - startTime;
      console.log(`[AUTH] ${req.method} ${req.path} - No API key provided (${duration}ms)`);
      return res.status(401).json({ success: false, message: 'API key is required' });
    }

    // Trim the API key to handle any whitespace issues
    const trimmedApiKey = apiKey.trim();
    
    console.log(`[AUTH] ${req.method} ${req.path} - Looking up API key: ${trimmedApiKey.substring(0, 8)}... (length: ${trimmedApiKey.length})`);
    
    // Query ApiKey model using 'key' field
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { 
        key: trimmedApiKey 
      },
      include: {
        user: true
      }
    });

    if (!apiKeyRecord) {
      const duration = Date.now() - startTime;
      console.log(`[AUTH] ${req.method} ${req.path} - Invalid API key (${duration}ms)`);
      return res.status(401).json({ success: false, message: 'Invalid API key' });
    }

    console.log(`[AUTH] ${req.method} ${req.path} - API key found for user: ${apiKeyRecord.user.email}`);

    // Use 'isActive' field (boolean)
    if (!apiKeyRecord.isActive) {
      const duration = Date.now() - startTime;
      console.log(`[AUTH] ${req.method} ${req.path} - API key inactive for user: ${apiKeyRecord.user.email} (${duration}ms)`);
      return res.status(403).json({ success: false, message: 'API key is inactive' });
    }

    // Check if API key is deleted
    if (apiKeyRecord.deletedAt) {
      const duration = Date.now() - startTime;
      console.log(`[AUTH] ${req.method} ${req.path} - API key deleted for user: ${apiKeyRecord.user.email} (${duration}ms)`);
      return res.status(403).json({ success: false, message: 'API key is inactive' });
    }

    // Check if user is deleted
    if (apiKeyRecord.user.deletedAt) {
      const duration = Date.now() - startTime;
      console.log(`[AUTH] ${req.method} ${req.path} - User deleted: ${apiKeyRecord.user.email} (${duration}ms)`);
      return res.status(403).json({ 
        success: false, 
        errorCode: 'USER_DELETED',
        message: 'Your account has been deleted. Please contact support for assistance.' 
      });
    }

    // Check if user is verified
    if (!apiKeyRecord.user.verifiedByAdmin) {
      const duration = Date.now() - startTime;
      console.log(`[AUTH] ${req.method} ${req.path} - User not verified: ${apiKeyRecord.user.email} (${duration}ms)`);
      return res.status(403).json({ 
        success: false, 
        errorCode: 'USER_NOT_VERIFIED',
        message: 'Your account is pending verification. Please wait for admin approval before using the extension.' 
      });
    }

    // Update lastUsedAt
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() }
    });

    const duration = Date.now() - startTime;
    console.log(`[AUTH] ${req.method} ${req.path} - Authentication successful for user: ${apiKeyRecord.user.email} (${duration}ms)`);

    req.user = apiKeyRecord.user;
    next();
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[AUTH] ${req.method} ${req.path} - Authentication error (${duration}ms):`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return res.status(500).json({ success: false, message: 'Authentication failed' });
  }
};

module.exports = { authenticateApiKey };