const Document = require('../models/Document');
const Client = require('../models/Client');
const Review = require('../models/Review');
const { runTaxReview } = require('../services/aiService');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Upload document & trigger AI review
 * @route   POST /api/documents/upload
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
  try {
    // Client taxpayers cannot upload documents directly; this is managed by CA/Admin
    if (!req.file) {
      res.status(400);
      throw new Error('Please select a PDF document to upload');
    }

    const { clientId, documentType } = req.body;

    if (!clientId || !documentType) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400);
      throw new Error('Please provide client ID and document type');
    }

    const client = await Client.findById(clientId);
    if (!client) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(404);
      throw new Error('Client profile not found');
    }

    // Role checks: Clients can upload documents for their own profiles, CAs for their registered clients.
    if (req.user.role === 'Client') {
      if (client.email !== req.user.email) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(403);
        throw new Error('Not authorized to manage documents for this client profile');
      }
    } else if (req.user.role === 'CA') {
      if (client.createdBy.toString() !== req.user._id.toString()) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(403);
        throw new Error('Not authorized to manage documents for this client');
      }
    }

    const docRecord = await Document.create({
      client: clientId,
      uploadedBy: req.user._id,
      documentType,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      reviewStatus: 'Processing',
    });

    runReviewInBackground(docRecord, client, req.file.path);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully. AI processing started.',
      data: docRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper to execute PDF analysis in the background.
 */
const runReviewInBackground = async (docRecord, client, filePath) => {
  try {
    const analysis = await runTaxReview(filePath, docRecord.documentType, client);

    await Review.create({
      document: docRecord._id,
      client: docRecord.client,
      incomeSummary: analysis.incomeSummary,
      taxesPaid: analysis.taxesPaid,
      deductions: analysis.deductions,
      missingDeductions: analysis.missingDeductions,
      missingDocuments: analysis.missingDocuments,
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      riskLevel: analysis.riskLevel,
      aiModelUsed: analysis.aiModelUsed,
      processingTime: analysis.processingTime,
    });

    docRecord.reviewStatus = 'Completed';
    await docRecord.save();
  } catch (error) {
    console.error(`Background Review Error for Doc ${docRecord._id}:`, error);
    docRecord.reviewStatus = 'Failed';
    await docRecord.save();
  }
};

/**
 * @desc    Get all documents (filterable by clientId)
 * @route   GET /api/documents
 * @access  Private
 */
const getDocuments = async (req, res, next) => {
  try {
    const { clientId } = req.query;
    let filter = {};

    if (req.user.role === 'Client') {
      const clientDoc = await Client.findOne({ email: req.user.email });
      if (!clientDoc) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }
      filter.client = clientDoc._id;
    } else if (req.user.role === 'CA') {
      filter.uploadedBy = req.user._id;
      if (clientId) {
        filter.client = clientId;
      }
    } else if (req.user.role === 'Admin' && clientId) {
      filter.client = clientId;
    }

    const documents = await Document.find(filter)
      .populate('client', 'fullName panNumber email')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single document meta
 * @route   GET /api/documents/:id
 * @access  Private
 */
const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id).populate('client', 'fullName panNumber email');

    if (!document) {
      res.status(404);
      throw new Error('Document record not found');
    }

    // Role check
    if (req.user.role === 'Client') {
      if (document.client?.email !== req.user.email) {
        res.status(403);
        throw new Error('Not authorized to access this document metadata');
      }
    } else if (req.user.role === 'CA') {
      if (document.uploadedBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this document metadata');
      }
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete document
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
const deleteDocument = async (req, res, next) => {
  try {
    if (req.user.role === 'Client') {
      res.status(403);
      throw new Error('Taxpayers are not authorized to delete documents');
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      res.status(404);
      throw new Error('Document record not found');
    }

    if (req.user.role !== 'Admin' && document.uploadedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this document');
    }

    const filePath = path.join(__dirname, '../uploads', document.storedFileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Review.deleteMany({ document: document._id });
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Document, file contents, and AI audit reports deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download document file
 * @route   GET /api/documents/:id/download
 * @access  Private
 */
const downloadDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id).populate('client');

    if (!document) {
      res.status(404);
      throw new Error('Document record not found');
    }

    // Role check
    if (req.user.role === 'Client') {
      if (document.client?.email !== req.user.email) {
        res.status(403);
        throw new Error('Not authorized to download this document');
      }
    } else if (req.user.role === 'CA') {
      if (document.uploadedBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to download this document');
      }
    }

    const filePath = path.join(__dirname, '../uploads', document.storedFileName);
    if (!fs.existsSync(filePath)) {
      res.status(404);
      throw new Error('Physical PDF document file was not found on the server');
    }

    res.download(filePath, document.originalFileName);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  downloadDocument,
};
