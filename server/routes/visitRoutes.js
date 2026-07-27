const express = require('express');
const router = express.Router();
const { getVisits, trackVisit } = require('../controllers/visitController');

router.get('/', getVisits);
router.post('/track', trackVisit);

module.exports = router;
