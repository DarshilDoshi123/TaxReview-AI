const express = require('express');
const {
  getReviewByDocumentId,
  analyzeDocument,
  regenerateReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Secure all review routes

router.get('/document/:documentId', getReviewByDocumentId);
router.post('/analyze/:documentId', analyzeDocument);
router.post('/regenerate/:reviewId', regenerateReview);

module.exports = router;
