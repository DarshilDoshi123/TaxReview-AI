const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      unique: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    incomeSummary: {
      grossSalary: { type: Number, default: 0 },
      otherIncome: { type: Number, default: 0 },
      totalGrossIncome: { type: Number, default: 0 },
      deductionsTotal: { type: Number, default: 0 },
      taxableIncome: { type: Number, default: 0 },
    },
    taxesPaid: {
      tds: { type: Number, default: 0 },
      tcs: { type: Number, default: 0 },
      advanceTax: { type: Number, default: 0 },
      selfAssessmentTax: { type: Number, default: 0 },
      totalTaxPaid: { type: Number, default: 0 },
    },
    deductions: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    missingDeductions: [{ type: String }],
    missingDocuments: [{ type: String }],
    issues: [
      {
        severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
        issue: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    recommendations: [{ type: String }],
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    aiModelUsed: {
      type: String,
      default: 'Rule-Based Fallback Parser',
    },
    processingTime: {
      type: Number, // in ms
      default: 0,
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
