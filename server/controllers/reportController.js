const Review = require('../models/Review');
const Document = require('../models/Document');
const Client = require('../models/Client');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

/**
 * @desc    Get structured report data
 * @route   GET /api/reports/:reviewId
 * @access  Private
 */
const getReportData = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('client')
      .populate('document');

    if (!review) {
      res.status(404);
      throw new Error('AI Review report not found');
    }

    // Role checks
    if (req.user.role === 'Client') {
      if (review.client?.email !== req.user.email) {
        res.status(450); // custom auth block code
        res.status(403);
        throw new Error('Not authorized to access this client report');
      }
    } else if (req.user.role === 'CA') {
      if (review.client?.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this client report');
      }
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
 * @desc    Generate report dynamically
 * @route   POST /api/reports/generate
 * @access  Private
 */
const generateReport = async (req, res, next) => {
  try {
    if (req.user.role === 'Client') {
      res.status(403);
      throw new Error('Taxpayers are not authorized to compile reports directly');
    }

    const { documentId } = req.body;
    if (!documentId) {
      res.status(400);
      throw new Error('Please specify document ID to generate report');
    }

    const document = await Document.findById(documentId);
    if (!document) {
      res.status(404);
      throw new Error('Document record not found');
    }

    const review = await Review.findOne({ document: documentId })
      .populate('client')
      .populate('document');

    if (!review) {
      res.status(404);
      throw new Error('Review data is not ready yet. Run document analysis first.');
    }

    res.status(200).json({
      success: true,
      message: 'Report data compiled successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download Report PDF
 * @route   GET /api/reports/:reviewId/pdf
 * @access  Private
 */
const downloadReportPDF = async (req, res, next) => {
  console.log('[PDF] Download request received');
  console.log('[PDF] Route matched');
  console.log(`[PDF] Review ID: ${req.params.reviewId}`);
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('client')
      .populate('document');

    if (!review) {
      console.log('[PDF ERROR] Review not found');
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    console.log('[PDF] Review loaded successfully');

    const client = review.client;
    if (!client) {
      console.log('[PDF ERROR] Client not found');
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    console.log('[PDF] Client data loaded');

    const document = review.document;
    if (!document) {
      console.log('[PDF ERROR] Document not found');
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Verify AI analysis exists by checking key fields in review
    if (!review.incomeSummary || !review.riskLevel) {
      console.log('[PDF ERROR] AI analysis does not exist');
      return res.status(400).json({
        success: false,
        message: 'AI analysis does not exist'
      });
    }

    // Role checks / Authorization
    if (req.user.role === 'Client') {
      if (client.email !== req.user.email) {
        console.log('[PDF ERROR] Not authorized to download this report');
        return res.status(403).json({
          success: false,
          message: 'Not authorized to download this report'
        });
      }
    } else if (req.user.role === 'CA') {
      const createdByStr = client.createdBy ? client.createdBy.toString() : '';
      if (createdByStr !== req.user._id.toString()) {
        console.log('[PDF ERROR] Not authorized to download this report');
        return res.status(403).json({
          success: false,
          message: 'Not authorized to download this report'
        });
      }
    }

    console.log('[PDF] Starting PDF generation');
    const formatCurr = (val) => `INR ${Number(val || 0).toLocaleString('en-IN')}`;

    const doc = new PDFDocument({ margin: 50, bufferPages: true });

    // Text sanitizer to prevent PDFKit Helvetica font encoding issues with Rupee symbol
    const sanitizeText = (text) => {
      if (!text) return '';
      return text.replace(/₹/g, 'Rs. ');
    };

    res.setHeader('Content-Type', 'application/pdf');
    const clientName = client.fullName || 'Audit';
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=TaxReview_Report_${clientName.replace(/\s+/g, '_')}.pdf`
    );
    doc.pipe(res);

    const primaryColor = '#0ea5e9';
    const darkGray = '#1e293b';
    const lightGray = '#f8fafc';
    const textGray = '#475569';

    // Hook page addition to paint consistent headers
    const reportId = `TXR-2026-${review._id.toString().substring(0, 8).toUpperCase()}`;
    doc.on('pageAdded', () => {
      doc.save();
      doc.rect(0, 0, 612, 50).fill(primaryColor);
      doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text('TAXREVIEW AI', 50, 18);
      doc.fontSize(8).font('Helvetica').text('Intelligent Income Tax Auditing & Optimization', 150, 22);
      doc.fontSize(9).font('Helvetica-Bold').text(`AUDIT REPORT | ID: ${reportId}`, 400, 20, { align: 'right' });
      doc.restore();
      doc.y = 80;
    });

    doc
      .rect(0, 0, 612, 100)
      .fill(primaryColor);

    doc
      .fillColor('#ffffff')
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('TAXREVIEW AI', 50, 30)
      .fontSize(10)
      .font('Helvetica')
      .text('Intelligent Income Tax Auditing & Optimization', 50, 58);

    doc
      .fillColor('#ffffff')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('AI AUDIT REPORT', 450, 42, { align: 'right' });

    doc.y = 130;
    doc
      .fillColor(darkGray)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Client Information', 50, doc.y)
      .moveDown(0.5);

    doc
      .moveTo(50, doc.y)
      .lineTo(562, doc.y)
      .strokeColor('#cbd5e1')
      .stroke();

    doc.y += 10;

    const metaY = doc.y;
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('Client Name:', 50, metaY)
      .font('Helvetica')
      .text(sanitizeText(client.fullName), 130, metaY)
      .font('Helvetica-Bold')
      .text('PAN Number:', 50, metaY + 18)
      .font('Helvetica')
      .text(client.panNumber || 'N/A', 130, metaY + 18)
      .font('Helvetica-Bold')
      .text('Email Address:', 50, metaY + 36)
      .font('Helvetica')
      .text(client.email, 130, metaY + 36);

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('Audit Date:', 300, metaY)
      .font('Helvetica')
      .text(review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'N/A', 390, metaY)
      .font('Helvetica-Bold')
      .text('Document Type:', 300, metaY + 18)
      .font('Helvetica')
      .text(document.documentType, 390, metaY + 18)
      .font('Helvetica-Bold')
      .text('Audit Status:', 300, metaY + 36)
      .font('Helvetica')
      .text(document.reviewStatus, 390, metaY + 36);

    doc.y = metaY + 65;

    doc
      .fillColor(darkGray)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Income & Tax Summary', 50, doc.y)
      .moveDown(0.5);

    doc
      .moveTo(50, doc.y)
      .lineTo(562, doc.y)
      .strokeColor('#cbd5e1')
      .stroke();

    doc.y += 10;

    const boxY = doc.y;
    doc
      .rect(50, boxY, 512, 85)
      .fill(lightGray);

    doc.fillColor(darkGray);
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('Gross Salary:', 70, boxY + 15)
      .font('Helvetica')
      .text(formatCurr(review.incomeSummary.grossSalary), 180, boxY + 15)
      .font('Helvetica-Bold')
      .text('Other Income:', 70, boxY + 30)
      .font('Helvetica')
      .text(formatCurr(review.incomeSummary.otherIncome), 180, boxY + 30)
      .font('Helvetica-Bold')
      .text('Total Deductions:', 70, boxY + 45)
      .font('Helvetica')
      .text(formatCurr(review.incomeSummary.deductionsTotal), 180, boxY + 45)
      .font('Helvetica-Bold')
      .text('Net Taxable Income:', 70, boxY + 60)
      .font('Helvetica-Bold')
      .text(formatCurr(review.incomeSummary.taxableIncome), 180, boxY + 60);

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('TDS (Tax Deducted):', 320, boxY + 15)
      .font('Helvetica')
      .text(formatCurr(review.taxesPaid.tds), 440, boxY + 15)
      .font('Helvetica-Bold')
      .text('Advance Taxes Paid:', 320, boxY + 30)
      .font('Helvetica')
      .text(formatCurr(review.taxesPaid.advanceTax), 440, boxY + 30)
      .font('Helvetica-Bold')
      .text('Total Taxes Paid:', 320, boxY + 45)
      .font('Helvetica-Bold')
      .text(formatCurr(review.taxesPaid.totalTaxPaid || review.taxesPaid.tds), 440, boxY + 45)
      .font('Helvetica-Bold')
      .text('Audit Risk Assessment:', 320, boxY + 60)
      .font('Helvetica-Bold')
      .text(review.riskLevel, 440, boxY + 60);

    doc.y = boxY + 105;

    doc
      .fillColor(darkGray)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('AI Audit Warnings & Anomalies', 50, doc.y)
      .moveDown(0.5);

    doc
      .moveTo(50, doc.y)
      .lineTo(562, doc.y)
      .strokeColor('#cbd5e1')
      .stroke();

    doc.y += 10;

    if (review.issues.length === 0) {
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(textGray)
        .text('No warnings or inconsistencies were detected by the auditing model.', 70, doc.y);
      doc.y += 20;
    } else {
      review.issues.forEach((issue) => {
        doc
          .fontSize(9)
          .font('Helvetica-Bold')
          .fillColor('#b45309')
          .text(`[${issue.severity} Severity] ${sanitizeText(issue.issue)}:`, 50)
          .moveDown(0.25);
        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor(textGray)
          .text(sanitizeText(issue.description), 70)
          .moveDown(1.25);
      });
    }

    doc
      .fillColor(darkGray)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Optimization & Recommendations', 50, doc.y)
      .moveDown(0.5);

    doc
      .moveTo(50, doc.y)
      .lineTo(562, doc.y)
      .strokeColor('#cbd5e1')
      .stroke();

    doc.y += 10;

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Potential Unclaimed Deductions:', 50)
      .moveDown(0.35);

    if (review.missingDeductions.length === 0) {
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(textGray)
        .text('No unclaimed standard deductions flagged.', 70)
        .moveDown(1);
    } else {
      review.missingDeductions.forEach((ded) => {
        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor(textGray)
          .text(`• ${sanitizeText(ded)}`, 60)
          .moveDown(0.4);
      });
      doc.moveDown(0.5);
    }

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor(darkGray)
      .text('Recommended Actions:', 50)
      .moveDown(0.35);

    review.recommendations.forEach((rec) => {
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(textGray)
        .text(`• ${sanitizeText(rec)}`, 60)
        .moveDown(0.4);
    });

    doc.moveDown(1);
    
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(darkGray)
      .text('Important Notice Dates:', 50)
      .moveDown(0.25);
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(textGray)
      .text('Ensure that your Income Tax Return (ITR) is filed before July 31st (for standard taxpayers) to avoid penalty charges under Section 234F.', 70)
      .moveDown(1);

    // Switch to page buffer mode to draw footers on all pages
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      
      // Temporarily remove bottom margin to prevent PDFKit from triggering a page break
      const oldMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;

      // Draw footer line
      doc
        .moveTo(50, 740)
        .lineTo(562, 740)
        .strokeColor('#e2e8f0')
        .stroke();

      // Draw confidential notice
      doc
        .fontSize(8)
        .fillColor('#94a3b8')
        .text('Confidential tax audit sheet generated by TaxReview AI. Not legal tax representation.', 50, 748, { 
          width: 380,
          align: 'left' 
        });

      // Draw page count
      doc
        .fontSize(8)
        .fillColor('#94a3b8')
        .text(`Page ${i + 1} of ${range.count}`, 450, 748, { 
          width: 112,
          align: 'right' 
        });

      // Restore bottom margin
      doc.page.margins.bottom = oldMargin;
    }

    doc.end();
    console.log('[PDF] PDF generated successfully');
    console.log('[PDF] Sending PDF response');
  } catch (error) {
    console.error(`[PDF ERROR] ${error.message}`);
    console.error(`[PDF ERROR STACK] ${error.stack}`);
    
    if (res.headersSent) {
      if (!res.writableEnded) {
        res.end();
      }
      return;
    }
    
    return res.status(500).json({
      success: false,
      message: 'PDF generation failed',
      error: error.message
    });
  }
};

module.exports = {
  getReportData,
  generateReport,
  downloadReportPDF,
};
