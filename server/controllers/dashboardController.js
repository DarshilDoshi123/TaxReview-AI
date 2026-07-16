const Client = require('../models/Client');
const Document = require('../models/Document');
const Review = require('../models/Review');
const mongoose = require('mongoose');

/**
 * @desc    Get dashboard metrics / counts
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    let clientFilter = {};
    let docFilter = {};
    let reviewFilter = {};

    if (req.user.role === 'Client') {
      let clientDoc = await Client.findOne({ email: req.user.email });
      if (!clientDoc) {
        clientDoc = await Client.create({
          fullName: req.user.name,
          email: req.user.email,
          panNumber: 'TEMPA' + Math.floor(1000 + Math.random() * 9000) + 'T',
          mobileNumber: '9999999999',
          address: 'Not Provided',
          createdBy: req.user._id,
        });
      }
      clientFilter._id = clientDoc._id;
      docFilter.client = clientDoc._id;
      reviewFilter.client = clientDoc._id;
    } else if (req.user.role === 'CA') {
      clientFilter.createdBy = req.user._id;
      docFilter.uploadedBy = req.user._id;
      
      const userDocs = await Document.find({ uploadedBy: req.user._id }).select('_id');
      const docIds = userDocs.map((d) => d._id);
      reviewFilter.document = { $in: docIds };
    }

    const totalClients = await Client.countDocuments(clientFilter);
    const totalDocuments = await Document.countDocuments(docFilter);
    
    const pendingReviews = await Document.countDocuments({
      ...docFilter,
      reviewStatus: 'Pending',
    });

    const processingReviews = await Document.countDocuments({
      ...docFilter,
      reviewStatus: 'Processing',
    });

    const completedReviews = await Document.countDocuments({
      ...docFilter,
      reviewStatus: 'Completed',
    });

    const failedReviews = await Document.countDocuments({
      ...docFilter,
      reviewStatus: 'Failed',
    });

    const totalReports = await Review.countDocuments(reviewFilter);

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        totalDocuments,
        pendingReviews,
        processingReviews,
        completedReviews,
        failedReviews,
        totalReports,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent activities
 * @route   GET /api/dashboard/activity
 * @access  Private
 */
const getRecentActivity = async (req, res, next) => {
  try {
    let userFilter = {};
    let docFilter = {};

    if (req.user.role === 'Client') {
      const clientDoc = await Client.findOne({ email: req.user.email });
      if (clientDoc) {
        userFilter = { _id: clientDoc._id };
        docFilter = { client: clientDoc._id };
      } else {
        const dummyId = new mongoose.Types.ObjectId();
        userFilter = { _id: dummyId };
        docFilter = { client: dummyId };
      }
    } else if (req.user.role === 'CA') {
      userFilter = { createdBy: req.user._id };
      docFilter = { uploadedBy: req.user._id };
    }

    const recentClients = await Client.find(userFilter)
      .limit(5)
      .sort({ createdAt: -1 })
      .select('fullName email createdAt');

    const recentDocuments = await Document.find(docFilter)
      .limit(5)
      .sort({ createdAt: -1 })
      .populate('client', 'fullName')
      .select('originalFileName documentType reviewStatus createdAt client');

    const activities = [];

    // Client users do not need a feed notification that "profile was added" since they are the client
    if (req.user.role !== 'Client') {
      recentClients.forEach((c) => {
        activities.push({
          _id: c._id,
          type: 'client_created',
          message: `New client Profile added: ${c.fullName}`,
          time: c.createdAt,
        });
      });
    }

    recentDocuments.forEach((d) => {
      let msg = `Document "${d.originalFileName}" (${d.documentType}) uploaded for client ${
        d.client ? d.client.fullName : 'Unknown'
      }`;
      activities.push({
        _id: d._id,
        type: 'document_uploaded',
        message: msg,
        status: d.reviewStatus,
        time: d.createdAt,
      });

      if (d.reviewStatus === 'Completed') {
        activities.push({
          _id: `rev-${d._id}`,
          type: 'review_completed',
          message: `AI Review finished for ${d.originalFileName}`,
          time: d.updatedAt,
        });
      } else if (d.reviewStatus === 'Failed') {
        activities.push({
          _id: `rev-fail-${d._id}`,
          type: 'review_failed',
          message: `AI Review failed for ${d.originalFileName}`,
          time: d.updatedAt,
        });
      }
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({
      success: true,
      data: activities.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly document uploads & review count (for last 6 months)
 * @route   GET /api/dashboard/monthly-stats
 * @access  Private
 */
const getMonthlyStats = async (req, res, next) => {
  try {
    let docFilter = {};
    
    if (req.user.role === 'Client') {
      const clientDoc = await Client.findOne({ email: req.user.email });
      if (clientDoc) {
        docFilter.client = clientDoc._id;
      } else {
        docFilter.client = new mongoose.Types.ObjectId();
      }
    } else if (req.user.role === 'CA') {
      docFilter.uploadedBy = req.user._id;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const matchStage = {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        ...docFilter,
      },
    };

    const stats = await Document.aggregate([
      matchStage,
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          uploads: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$reviewStatus', 'Completed'] }, 1, 0]
            }
          }
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = [];
    const tempDate = new Date(sixMonthsAgo);

    for (let i = 0; i < 6; i++) {
      const year = tempDate.getFullYear();
      const monthNum = tempDate.getMonth() + 1;
      const label = `${monthNames[tempDate.getMonth()]} ${year.toString().substring(2)}`;

      const monthStat = stats.find(
        (s) => s._id.year === year && s._id.month === monthNum
      );

      chartData.push({
        name: label,
        uploads: monthStat ? monthStat.uploads : 0,
        reviews: monthStat ? monthStat.completed : 0,
      });

      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent uploaded documents
 * @route   GET /api/dashboard/recent-uploads
 * @access  Private
 */
const getRecentUploads = async (req, res, next) => {
  try {
    let docFilter = {};

    if (req.user.role === 'Client') {
      const clientDoc = await Client.findOne({ email: req.user.email });
      if (clientDoc) {
        docFilter.client = clientDoc._id;
      } else {
        docFilter.client = new mongoose.Types.ObjectId();
      }
    } else if (req.user.role === 'CA') {
      docFilter.uploadedBy = req.user._id;
    }

    const recentDocs = await Document.find(docFilter)
      .limit(5)
      .sort({ createdAt: -1 })
      .populate('client', 'fullName email');

    res.status(200).json({
      success: true,
      data: recentDocs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent AI completed reviews
 * @route   GET /api/dashboard/recent-reviews
 * @access  Private
 */
const getRecentReviews = async (req, res, next) => {
  try {
    let reviewFilter = {};

    if (req.user.role === 'Client') {
      const clientDoc = await Client.findOne({ email: req.user.email });
      if (clientDoc) {
        reviewFilter.client = clientDoc._id;
      } else {
        reviewFilter.client = new mongoose.Types.ObjectId();
      }
    } else if (req.user.role === 'CA') {
      const userDocs = await Document.find({ uploadedBy: req.user._id }).select('_id');
      const docIds = userDocs.map((d) => d._id);
      reviewFilter.document = { $in: docIds };
    }

    const recentReviews = await Review.find(reviewFilter)
      .limit(5)
      .sort({ reviewDate: -1 })
      .populate('client', 'fullName email')
      .populate('document', 'originalFileName documentType');

    res.status(200).json({
      success: true,
      data: recentReviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getMonthlyStats,
  getRecentUploads,
  getRecentReviews,
};
