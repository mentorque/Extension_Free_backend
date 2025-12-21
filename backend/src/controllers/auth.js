// src/controllers/auth.js
const prisma = require('../utils/prismaClient');

const validateApiKey = async (req, res) => {
  try {
    // req.user is set by authenticateApiKey middleware
    return res.status(200).json({
      success: true,
      message: 'API key is valid',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.fullName // Changed from 'name' to 'fullName'
      }
    });
  } catch (error) {
    console.error('Validate API key error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate API key'
    });
  }
};

const validateApiKeyPublic = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required'
      });
    }

    // Trim the API key to handle any whitespace issues
    const trimmedApiKey = apiKey.trim();
    
    console.log(`[AUTH_PUBLIC] Validating API key: ${trimmedApiKey.substring(0, 8)}... (length: ${trimmedApiKey.length})`);
    
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
      console.log(`[AUTH_PUBLIC] Invalid API key: ${apiKey.substring(0, 8)}...`);
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }

    // Check if API key is active
    if (!apiKeyRecord.isActive) {
      console.log(`[AUTH_PUBLIC] API key inactive for user: ${apiKeyRecord.user.email}`);
      return res.status(403).json({
        success: false,
        message: 'API key is inactive'
      });
    }

    // Check if API key is deleted
    if (apiKeyRecord.deletedAt) {
      console.log(`[AUTH_PUBLIC] API key deleted for user: ${apiKeyRecord.user.email}`);
      return res.status(403).json({
        success: false,
        message: 'API key is inactive'
      });
    }

    // Check if user is deleted
    if (apiKeyRecord.user.deletedAt) {
      console.log(`[AUTH_PUBLIC] User deleted: ${apiKeyRecord.user.email}`);
      return res.status(403).json({
        success: false,
        errorCode: 'USER_DELETED',
        message: 'Your account has been deleted. Please contact support for assistance.'
      });
    }

    // Check if user is verified
    if (!apiKeyRecord.user.verifiedByAdmin) {
      console.log(`[AUTH_PUBLIC] User not verified: ${apiKeyRecord.user.email}`);
      return res.status(403).json({
        success: false,
        errorCode: 'USER_NOT_VERIFIED',
        message: 'Your account is pending verification. Please wait for admin approval before using the extension.'
      });
    }

    console.log(`[AUTH_PUBLIC] API key validation successful for user: ${apiKeyRecord.user.email}`);

    // Update lastUsedAt
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() }
    });

    return res.status(200).json({
      success: true,
      message: 'API key is valid',
      user: {
        id: apiKeyRecord.user.id,
        email: apiKeyRecord.user.email,
        name: apiKeyRecord.user.fullName
      }
    });
  } catch (error) {
    console.error('Public API key validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate API key'
    });
  }
};

module.exports = {
  validateApiKey,
  validateApiKeyPublic
};