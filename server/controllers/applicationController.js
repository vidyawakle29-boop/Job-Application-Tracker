const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');

/**
 * @desc    Get all applications for the logged-in user
 * @route   GET /api/applications
 * @access  Private
 */
exports.getApplications = async (req, res, next) => {
  try {
    const { status, search, jobType, sortBy, sortOrder } = req.query;

    const query = { user: req.user.id };

    // Filter by status if provided and not 'All'
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by jobType if provided and not 'All'
    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    // Search by companyName, jobTitle, or location
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { companyName: searchRegex },
        { jobTitle: searchRegex },
        { jobLocation: searchRegex },
        { notes: searchRegex },
      ];
    }

    // Sort order
    const sortField = sortBy || 'applicationDate';
    const direction = sortOrder === 'asc' ? 1 : -1;

    const applications = await JobApplication.find(query).sort({
      [sortField]: direction,
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single application by ID
 * @route   GET /api/applications/:id
 * @access  Private
 */
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new job application
 * @route   POST /api/applications
 * @access  Private
 */
exports.createApplication = async (req, res, next) => {
  try {
    const {
      companyName,
      jobTitle,
      jobDescription,
      jobLocation,
      jobType,
      salary,
      applicationDate,
      jobPostingUrl,
      status,
      hrContact,
      notes,
      interviewDate,
    } = req.body;

    const newStatus = status || 'Applied';

    const application = await JobApplication.create({
      user: req.user.id,
      companyName,
      jobTitle,
      jobDescription,
      jobLocation: jobLocation || 'Remote',
      jobType: jobType || 'Full-Time',
      salary: salary || 'Not Specified',
      applicationDate: applicationDate || Date.now(),
      jobPostingUrl: jobPostingUrl || '',
      status: newStatus,
      hrContact: hrContact || {},
      notes: notes || '',
      interviewDate: interviewDate || null,
      statusHistory: [
        {
          status: newStatus,
          changedAt: new Date(),
          comment: 'Initial application created',
        },
      ],
    });

    // Create a confirmation notification
    await Notification.create({
      user: req.user.id,
      title: 'New Application Added',
      message: `You added an application for ${jobTitle} at ${companyName}. Current status: ${newStatus}`,
      type: 'status_update',
      relatedApplication: application._id,
    });

    // If interview scheduled right away
    if (newStatus === 'Interview Scheduled' || interviewDate) {
      await Notification.create({
        user: req.user.id,
        title: 'Interview Alert',
        message: `Interview scheduled with ${companyName} for the ${jobTitle} role.`,
        type: 'interview_reminder',
        relatedApplication: application._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Job application tracked successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application details
 * @route   PUT /api/applications/:id
 * @access  Private
 */
exports.updateApplication = async (req, res, next) => {
  try {
    let application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const prevStatus = application.status;
    const nextStatus = req.body.status;

    // If status changed, record in history and send notification
    if (nextStatus && nextStatus !== prevStatus) {
      application.statusHistory.push({
        status: nextStatus,
        changedAt: new Date(),
        comment: req.body.statusComment || `Status updated from ${prevStatus} to ${nextStatus}`,
      });

      await Notification.create({
        user: req.user.id,
        title: `Status Updated: ${application.companyName}`,
        message: `Your application for ${application.jobTitle} changed to "${nextStatus}".`,
        type: nextStatus === 'Interview Scheduled' ? 'interview_reminder' : 'status_update',
        relatedApplication: application._id,
      });
    }

    // Update fields
    Object.assign(application, req.body);
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update status quickly
 * @route   PATCH /api/applications/:id/status
 * @access  Private
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status',
      });
    }

    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const oldStatus = application.status;
    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      comment: comment || `Status manually updated from ${oldStatus} to ${status}`,
    });

    await application.save();

    await Notification.create({
      user: req.user.id,
      title: `Application ${status}`,
      message: `${application.jobTitle} at ${application.companyName} is now marked as "${status}".`,
      type: status === 'Interview Scheduled' ? 'interview_reminder' : 'status_update',
      relatedApplication: application._id,
    });

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete job application
 * @route   DELETE /api/applications/:id
 * @access  Private
 */
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Clean up related notifications
    await Notification.deleteMany({ relatedApplication: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
