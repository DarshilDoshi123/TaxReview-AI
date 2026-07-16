const express = require('express');
const { getReportData, generateReport, downloadReportPDF } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Secure all report routes

router.get('/:reviewId', getReportData);
router.post('/generate', generateReport);
router.get('/:reviewId/pdf', downloadReportPDF);

module.exports = router;
