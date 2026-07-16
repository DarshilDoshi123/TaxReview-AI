const Review = require('../models/Review');
const Document = require('../models/Document');
const Client = require('../models/Client');
const { runTaxReview } = require('../services/aiService');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Get review analysis for a document
 * @route   GET /api/reviews/document/:documentId
 * @access  Private
 */
const getReviewByDocumentId = async (req, res, next) => {
  try {
    const documentId = req.params.documentId;
    const document = await Document.findById(documentId).populate('client');

    if (!document) {
      res.status(404);
      throw new Error('Document record not found');
    }

    // Role checks
    if (req.user.role === 'Client') {
      if (document.client?.email !== req.user.email) {
        res.status(403);
        throw new Error('Not authorized to access reviews for this document');
      }
    } else if (req.user.role === 'CA') {
      if (document.uploadedBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access reviews for this document');
      }
    }

    const review = await Review.findOne({ document: documentId }).populate('client', 'fullName panNumber email');

    if (!review) {
      return res.status(200).json({
        success: true,
        message: 'Review report is not generated yet. Current status: ' + document.reviewStatus,
        status: document.reviewStatus,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Manually run/rerun document analysis
 * @route   POST /api/reviews/analyze/:documentId
 * @access  Private
 */
const analyzeDocument = async (req, res, next) => {
  let document;
  try {
    if (req.user.role === 'Client') {
      res.status(403);
      throw new Error('Taxpayers are not authorized to trigger manual document audits');
    }

    const documentId = req.params.documentId;
    document = await Document.findById(documentId);

    if (!document) {
      res.status(404);
      throw new Error('Document record not found');
    }

    if (req.user.role !== 'Admin' && document.uploadedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to analyze this document');
    }

    const client = await Client.findById(document.client);
    if (!client) {
      res.status(404);
      throw new Error('Associated client profile not found');
    }

    document.reviewStatus = 'Processing';
    await document.save();

    const filePath = path.join(__dirname, '../uploads', document.storedFileName);
    if (!fs.existsSync(filePath)) {
      document.reviewStatus = 'Failed';
      await document.save();
      res.status(400);
      throw new Error('Physical PDF document file was not found on the server');
    }

    const startTime = Date.now();
    const analysis = await runTaxReview(filePath, document.documentType, client);
    const processingTime = Date.now() - startTime;

    let review = await Review.findOne({ document: documentId });

    const reviewData = {
      document: documentId,
      client: document.client,
      incomeSummary: analysis.incomeSummary,
      taxesPaid: analysis.taxesPaid,
      deductions: analysis.deductions,
      missingDeductions: analysis.missingDeductions,
      missingDocuments: analysis.missingDocuments,
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      riskLevel: analysis.riskLevel,
      aiModelUsed: analysis.aiModelUsed,
      processingTime,
      reviewDate: new Date(),
    };

    if (review) {
      review = await Review.findByIdAndUpdate(review._id, reviewData, { new: true });
    } else {
      review = await Review.create(reviewData);
    }

    document.reviewStatus = 'Completed';
    await document.save();

    res.status(200).json({
      success: true,
      message: 'AI Review analysis completed successfully',
      data: review,
    });
  } catch (error) {
    if (document) {
      try {
        document.reviewStatus = 'Failed';
        await document.save();
      } catch (saveError) {
        console.error('Failed to update document status to Failed:', saveError.message);
      }
    }
    next(error);
  }
};

/**
 * @desc    Regenerate review report
 * @route   POST /api/reviews/regenerate/:reviewId
 * @access  Private
 */
const regenerateReview = async (req, res, next) => {
  let document;
  try {
    if (req.user.role === 'Client') {
      res.status(403);
      throw new Error('Taxpayers are not authorized to trigger manual document regenerations');
    }

    const reviewId = req.params.reviewId;
    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404);
      throw new Error('Review report not found');
    }

    document = await Document.findById(review.document);
    if (!document) {
      res.status(404);
      throw new Error('Associated document record not found');
    }

    if (req.user.role !== 'Admin' && document.uploadedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to modify reviews for this document');
    }

    const client = await Client.findById(review.client);
    if (!client) {
      res.status(404);
      throw new Error('Associated client profile not found');
    }

    const filePath = path.join(__dirname, '../uploads', document.storedFileName);
    if (!fs.existsSync(filePath)) {
      res.status(400);
      throw new Error('Physical PDF document file was not found on the server');
    }

    document.reviewStatus = 'Processing';
    await document.save();

    const startTime = Date.now();
    const analysis = await runTaxReview(filePath, document.documentType, client);
    const processingTime = Date.now() - startTime;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        incomeSummary: analysis.incomeSummary,
        taxesPaid: analysis.taxesPaid,
        deductions: analysis.deductions,
        missingDeductions: analysis.missingDeductions,
        missingDocuments: analysis.missingDocuments,
        issues: analysis.issues,
        recommendations: analysis.recommendations,
        riskLevel: analysis.riskLevel,
        aiModelUsed: analysis.aiModelUsed,
        processingTime,
        reviewDate: new Date(),
      },
      { new: true }
    );

    document.reviewStatus = 'Completed';
    await document.save();

    res.status(200).json({
      success: true,
      message: 'AI Review analysis regenerated successfully',
      data: updatedReview,
    });
  } catch (error) {
    if (document) {
      try {
        document.reviewStatus = 'Failed';
        await document.save();
      } catch (saveError) {
        console.error('Failed to update document status to Failed:', saveError.message);
      }
    }
    next(error);
  }
};

module.exports = {
  getReviewByDocumentId,
  analyzeDocument,
  regenerateReview,
};
