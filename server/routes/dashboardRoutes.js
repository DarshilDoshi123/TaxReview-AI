const express = require('express');
const {
  getPublicStats,
  getDashboardStats,
  getRecentActivity,
  getMonthlyStats,
  getRecentUploads,
  getRecentReviews,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public platform statistics route (unprotected for landing page)
router.get('/public-stats', getPublicStats);

// Secure all other dashboard routes
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);
router.get('/monthly-stats', getMonthlyStats);
router.get('/recent-uploads', getRecentUploads);
router.get('/recent-reviews', getRecentReviews);

module.exports = router;
