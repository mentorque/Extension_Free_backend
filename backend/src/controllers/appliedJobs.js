// src/controllers/appliedJobs.js
const prisma = require('../utils/prismaClient');

// Get all applied jobs for a user
const getAppliedJobs = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;
  
  console.log(`[APPLIED_JOBS] GET /api/applied-jobs - User: ${userId} - Starting fetch`);
  
  try {
    const appliedJobs = await prisma.appliedJob.findMany({
      where: { userId },
      orderBy: { appliedDate: 'desc' }
    });

    const duration = Date.now() - startTime;
    console.log(`[APPLIED_JOBS] GET /api/applied-jobs - User: ${userId} - Success: Found ${appliedJobs.length} jobs in ${duration}ms`);

    return res.status(200).json({
      success: true,
      appliedJobs
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[APPLIED_JOBS] GET /api/applied-jobs - User: ${userId} - Error after ${duration}ms:`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applied jobs'
    });
  }
};

// Add a new applied job
const addAppliedJob = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;
  const { title, company, location, url, appliedDate, appliedText } = req.body;
  
  console.log(`[APPLIED_JOBS] POST /api/applied-jobs - User: ${userId} - Adding job:`, {
    title: title?.substring(0, 50) + (title?.length > 50 ? '...' : ''),
    company,
    location,
    url: url?.substring(0, 100) + (url?.length > 100 ? '...' : ''),
    appliedDate,
    appliedText
  });

  try {
    if (!title || !url) {
      console.log(`[APPLIED_JOBS] POST /api/applied-jobs - User: ${userId} - Validation failed: Missing title or URL`);
      return res.status(400).json({
        success: false,
        message: 'Title and URL are required'
      });
    }

    // Check if job already exists for this user
    const existing = await prisma.appliedJob.findFirst({
      where: {
        userId,
        url
      }
    });

    if (existing) {
      const duration = Date.now() - startTime;
      console.log(`[APPLIED_JOBS] POST /api/applied-jobs - User: ${userId} - Job already exists (${duration}ms):`, {
        existingId: existing.id,
        existingTitle: existing.title
      });
      return res.status(200).json({
        success: true,
        message: 'Job already tracked',
        appliedJob: existing
      });
    }

    const appliedJob = await prisma.appliedJob.create({
      data: {
        userId,
        title,
        company: company || null,
        location: location || null,
        url,
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
        appliedText: appliedText || null,
        status: 'Applied'
      }
    });

    const duration = Date.now() - startTime;
    console.log(`[APPLIED_JOBS] POST /api/applied-jobs - User: ${userId} - Success: Created job ${appliedJob.id} in ${duration}ms`);

    return res.status(201).json({
      success: true,
      appliedJob
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[APPLIED_JOBS] POST /api/applied-jobs - User: ${userId} - Error after ${duration}ms:`, {
      message: error.message,
      stack: error.stack,
      code: error.code,
      body: { title, company, location, url }
    });
    return res.status(500).json({
      success: false,
      message: 'Failed to add applied job'
    });
  }
};

// Delete an applied job
const deleteAppliedJob = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;
  const { id } = req.params;
  
  console.log(`[APPLIED_JOBS] DELETE /api/applied-jobs/${id} - User: ${userId} - Starting deletion`);

  try {
    // Verify the job belongs to the user
    const job = await prisma.appliedJob.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!job) {
      const duration = Date.now() - startTime;
      console.log(`[APPLIED_JOBS] DELETE /api/applied-jobs/${id} - User: ${userId} - Job not found (${duration}ms)`);
      return res.status(404).json({
        success: false,
        message: 'Applied job not found'
      });
    }

    await prisma.appliedJob.delete({
      where: { id }
    });

    const duration = Date.now() - startTime;
    console.log(`[APPLIED_JOBS] DELETE /api/applied-jobs/${id} - User: ${userId} - Success: Deleted job "${job.title}" in ${duration}ms`);

    return res.status(200).json({
      success: true,
      message: 'Applied job deleted'
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[APPLIED_JOBS] DELETE /api/applied-jobs/${id} - User: ${userId} - Error after ${duration}ms:`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return res.status(500).json({
      success: false,
      message: 'Failed to delete applied job'
    });
  }
};

// Update job status
const updateJobStatus = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;
  
  console.log(`[APPLIED_JOBS] PATCH /api/applied-jobs/${id}/status - User: ${userId} - Updating status to: ${status}`);

  try {
    if (!status) {
      console.log(`[APPLIED_JOBS] PATCH /api/applied-jobs/${id}/status - User: ${userId} - Validation failed: Missing status`);
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Verify the job belongs to the user
    const job = await prisma.appliedJob.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!job) {
      const duration = Date.now() - startTime;
      console.log(`[APPLIED_JOBS] PATCH /api/applied-jobs/${id}/status - User: ${userId} - Job not found (${duration}ms)`);
      return res.status(404).json({
        success: false,
        message: 'Applied job not found'
      });
    }

    const updatedJob = await prisma.appliedJob.update({
      where: { id },
      data: { status }
    });

    const duration = Date.now() - startTime;
    console.log(`[APPLIED_JOBS] PATCH /api/applied-jobs/${id}/status - User: ${userId} - Success: Updated job "${job.title}" status from "${job.status}" to "${status}" in ${duration}ms`);

    return res.status(200).json({
      success: true,
      appliedJob: updatedJob
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[APPLIED_JOBS] PATCH /api/applied-jobs/${id}/status - User: ${userId} - Error after ${duration}ms:`, {
      message: error.message,
      stack: error.stack,
      code: error.code,
      status
    });
    return res.status(500).json({
      success: false,
      message: 'Failed to update job status'
    });
  }
};

module.exports = {
  getAppliedJobs,
  addAppliedJob,
  deleteAppliedJob,
  updateJobStatus
};

