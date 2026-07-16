const express = require('express');
const {
  getDashboardStats,
  getRecentActivity,
  getMonthlyStats,
  getRecentUploads,
  getRecentReviews,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Secure all dashboard routes

router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);
router.get('/monthly-stats', getMonthlyStats);
router.get('/recent-uploads', getRecentUploads);
router.get('/recent-reviews', getRecentReviews);

module.exports = router;
