const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'site_visits',
      unique: true,
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Visit', visitSchema);
