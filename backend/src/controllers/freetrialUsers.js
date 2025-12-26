/**
 * Free Trial Users Controller
 * Handles registration of free trial users
 */

const prisma = require('../utils/prismaClient');

const registerFreeTrialUser = async (req, res, next) => {
  try {
    const { name, email, contactNumber, occupation } = req.body;

    // Validate required fields
    if (!name || !email || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and contact number are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Use upsert for better performance - single database call instead of find + create
    const newUser = await prisma.freetrialUsers.upsert({
      where: { email },
      update: {
        // Update if exists (in case user resubmits with different info)
        name,
        contactNumber,
        occupation: occupation || null,
        updatedAt: new Date()
      },
      create: {
        name,
        email,
        contactNumber,
        occupation: occupation || null
      }
    });

    console.log(`[FreeTrial] New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        contactNumber: newUser.contactNumber,
        occupation: newUser.occupation
      }
    });
  } catch (error) {
    console.error('[FreeTrial] Error registering user:', error);
    next(error);
  }
};

module.exports = { registerFreeTrialUser };

