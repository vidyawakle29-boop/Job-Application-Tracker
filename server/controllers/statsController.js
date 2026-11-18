const mongoose = require('mongoose');
const JobApplication = require('../models/JobApplication');

/**
 * @desc    Get aggregated dashboard stats for the authenticated user
 * @route   GET /api/stats/dashboard
 * @access  Private
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Total counts by status
    const statusCounts = await JobApplication.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Format counts map
    const countsMap = {
      total: 0,
      applied: 0,
      underReview: 0,
      shortlisted: 0,
      interviewScheduled: 0,
      selected: 0,
      rejected: 0,
      offerReceived: 0,
      pending: 0,
    };

    statusCounts.forEach((item) => {
      countsMap.total += item.count;
      switch (item._id) {
        case 'Applied':
          countsMap.applied = item.count;
          countsMap.pending += item.count;
          break;
        case 'Under Review':
          countsMap.underReview = item.count;
          countsMap.pending += item.count;
          break;
        case 'Shortlisted':
          countsMap.shortlisted = item.count;
          countsMap.pending += item.count;
          break;
        case 'Interview Scheduled':
          countsMap.interviewScheduled = item.count;
          break;
        case 'Selected':
          countsMap.selected = item.count;
          break;
        case 'Rejected':
          countsMap.rejected = item.count;
          break;
        case 'Offer Received':
          countsMap.offerReceived = item.count;
          break;
        default:
          break;
      }
    });

    // 2. Recent applications (Top 5)
    const recentApplications = await JobApplication.find({ user: userId })
      .sort({ applicationDate: -1 })
      .limit(5);

    // 3. Breakdown by Job Type
    const jobTypeStats = await JobApplication.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$jobType', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    // 4. Monthly timeline statistics (applications per month for the last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyStats = await JobApplication.aggregate([
      {
        $match: {
          user: userId,
          applicationDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$applicationDate' },
            month: { $month: '$applicationDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timelineData = monthlyStats.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      applications: item.count,
    }));

    res.status(200).json({
      success: true,
      stats: countsMap,
      recentApplications,
      jobTypeStats,
      timelineData,
    });
  } catch (error) {
    next(error);
  }
};
