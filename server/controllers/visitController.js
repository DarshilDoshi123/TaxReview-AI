const Visit = require('../models/Visit');

/**
 * @desc    Get total website visits
 * @route   GET /api/visits
 * @access  Public
 */
const getVisits = async (req, res, next) => {
  try {
    let visitDoc = await Visit.findOne({ name: 'site_visits' });
    if (!visitDoc) {
      visitDoc = await Visit.create({ name: 'site_visits', totalVisits: 0 });
    }
    res.status(200).json({
      success: true,
      totalVisits: visitDoc.totalVisits,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Track a website visit (atomic increment by 1)
 * @route   POST /api/visits/track
 * @access  Public
 */
const trackVisit = async (req, res, next) => {
  try {
    const updatedStat = await Visit.findOneAndUpdate(
      { name: 'site_visits' },
      { $inc: { totalVisits: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({
      success: true,
      totalVisits: updatedStat.totalVisits,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVisits,
  trackVisit,
};
