const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentType: {
      type: String,
      enum: ['Form 16', 'AIS', 'Form 26AS', 'Income Tax Notice', 'Salary Slip', 'Other PDF Documents'],
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    storedFileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    reviewStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Failed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.virtual('uploadedAt').get(function () {
  return this.createdAt || this.uploadDate;
});
documentSchema.set('toJSON', { virtuals: true });
documentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Document', documentSchema);
