const fs = require('fs');
const path = require('path');
const url = require('url');
const pdfParse = require('pdf-parse');
const jpeg = require('jpeg-js');
const canvas = require('@napi-rs/canvas');
const Tesseract = require('tesseract.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Polyfill global elements for pdfjs-dist internally instantiating canvas/image objects in Node.js
global.Canvas = canvas.Canvas;
global.Image = canvas.Image;
global.createImageBitmap = undefined; // Force pdf.js to avoid native ImageBitmap which node-canvas does not support

class NodeCanvasFactory {
  create(width, height) {
    const canvasObj = canvas.createCanvas(width, height);
    const context = canvasObj.getContext('2d');
    return {
      canvas: canvasObj,
      context: context
    };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}


/**
 * Extracts raw text from a PDF file on disk.
 * Handles password-protected, scanned, empty, or corrupted PDFs.
 * @param {string} filePath - Absolute path to the PDF file.
 * @returns {Promise<string>} - Extracted text.
 */
const extractTextFromPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('PDF file not found on disk');
    }
    const dataBuffer = fs.readFileSync(filePath);
    
    if (dataBuffer.length === 0) {
      throw new Error('Empty PDF file');
    }
    
    // Check standard PDF magic header (%PDF-)
    const header = dataBuffer.toString('utf8', 0, 4);
    if (header !== '%PDF') {
      throw new Error('Corrupted or invalid PDF format');
    }
    
    let extractedText = '';
    let numPages = 0;
    let isPasswordProtected = false;
    
    // ==========================================
    // STAGE 1: Try pdf-parse (Primary Extractor)
    // ==========================================
    try {
      const parsedData = await pdfParse(dataBuffer);
      numPages = parsedData.numpages || 0;
      const text = parsedData.text || '';
      extractedText = text; // Keep this as our best guess text so far
      
      const cleaned = text.replace(/[\r\n\t\s]+/g, '');
      if (cleaned.length >= 100) {
        console.log('[PDF] pdf-parse succeeded');
      } else {
        console.log('[PDF] pdf-parse failed (extracted text is empty/too short)');
      }
    } catch (err) {
      console.error('[PDF] pdf-parse failed with error:', err.message);
      const errMsg = err.message.toLowerCase();
      if (errMsg.includes('password') || errMsg.includes('decrypt') || errMsg.includes('encrypt')) {
        isPasswordProtected = true;
      }
    }
    
    // ==========================================
    // STAGE 2: Try pdfjs-dist (Secondary Extractor)
    // ==========================================
    const cleanedStage1 = extractedText.replace(/[\r\n\t\s]+/g, '');
    if (cleanedStage1.length < 100) {
      try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        
        // Load local standard fonts directory path inside the package to decode Helvetica/Times standard fonts in AIS PDFs
        const standardFontDir = path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts/');
        const standardFontDataUrl = url.pathToFileURL(standardFontDir).href;
        
        const data = new Uint8Array(dataBuffer);
        const docProxy = await pdfjsLib.getDocument({ 
          data,
          useSystemArr: true,
          disableFontFace: true,
          standardFontDataUrl,
          canvasFactory: new NodeCanvasFactory()
        }).promise;
        
        numPages = docProxy.numPages || numPages;
        let pdfjsText = '';
        
        for (let i = 1; i <= docProxy.numPages; i++) {
          const page = await docProxy.getPage(i);
          const textContentObj = await page.getTextContent();
          const pageText = textContentObj.items.map(item => item.str).join(' ');
          
          console.log(`[PDF] Page ${i} extracted ${pageText.length} characters`);
          pdfjsText += pageText + '\n';
        }
        
        console.log(`[PDF] pdfjs total characters: ${pdfjsText.length}`);
        
        const cleanedPdfjs = pdfjsText.replace(/[\r\n\t\s]+/g, '');
        if (cleanedPdfjs.length >= 100) {
          console.log('[PDF] pdfjs succeeded');
        } else {
          console.log('[PDF] pdfjs failed (extracted text is empty/too short)');
        }
        
        // Update our best extracted text if pdfjs succeeded or returned more content
        if (cleanedPdfjs.length > extractedText.replace(/[\r\n\t\s]+/g, '').length) {
          extractedText = pdfjsText;
        }
      } catch (err) {
        console.error('[PDF] pdfjs failed with error:', err.message);
        const errName = err.name || '';
        const errMsg = err.message.toLowerCase();
        if (errName === 'PasswordException' || errMsg.includes('password') || errMsg.includes('decrypt') || errMsg.includes('encrypt')) {
          isPasswordProtected = true;
        }
      }
    }
    
    // ==========================================
    // STAGE 3: Try Tesseract OCR (Scanned Fallback)
    // ==========================================
    const finalCleanedBeforeOCR = extractedText.replace(/[\r\n\t\s]+/g, '');
    if (finalCleanedBeforeOCR.length < 100) {
      console.log('[PDF] OCR started');
      try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        
        const standardFontDir = path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts/');
        const standardFontDataUrl = url.pathToFileURL(standardFontDir).href;
        
        const data = new Uint8Array(dataBuffer);
        const docProxy = await pdfjsLib.getDocument({ 
          data,
          useSystemArr: true,
          disableFontFace: true,
          standardFontDataUrl,
          canvasFactory: new NodeCanvasFactory()
        }).promise;
        
        numPages = docProxy.numPages || numPages;
        let ocrText = '';
        
        // Loop through pages, render to canvas at 300 DPI, convert to PNG, and run OCR
        for (let pageNum = 1; pageNum <= docProxy.numPages; pageNum++) {
          console.log(`[PDF] Rendering page ${pageNum}/${docProxy.numPages}`);
          
          const page = await docProxy.getPage(pageNum);
          const viewport = page.getViewport({ scale: 300 / 72 }); // Render at 300 DPI
          const canvasObj = canvas.createCanvas(viewport.width, viewport.height);
          const context = canvasObj.getContext('2d');
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          const pngBuffer = canvasObj.toBuffer('image/png');
          const result = await Tesseract.recognize(pngBuffer, 'eng');
          const pageText = result?.data?.text || '';
          
          console.log(`[PDF] OCR page ${pageNum} extracted ${pageText.length} characters`);
          ocrText += pageText + '\n';
        }
        
        console.log(`[PDF] Combined OCR length ${ocrText.length}`);
        
        const cleanedOcr = ocrText.replace(/[\r\n\t\s]+/g, '');
        if (cleanedOcr.length >= 2) {
          console.log('[PDF] OCR completed');
        } else {
          console.log('[PDF] OCR failed (no text extracted from images)');
        }
        
        // Update our best extracted text if OCR succeeded or returned more content
        if (cleanedOcr.length > extractedText.replace(/[\r\n\t\s]+/g, '').length) {
          extractedText = ocrText;
        }
      } catch (err) {
        console.error('[PDF] OCR failed with error:', err.stack || err);
        const errName = err.name || '';
        const errMsg = err.message.toLowerCase();
        if (errName === 'PasswordException' || errMsg.includes('password') || errMsg.includes('decrypt') || errMsg.includes('encrypt')) {
          isPasswordProtected = true;
        }
      }
    }
    
    // Trim whitespace and check final extracted size
    const finalCleaned = extractedText.replace(/[\r\n\t\s]+/g, '');
    console.log(`[PDF] Final extraction length: ${finalCleaned.length} characters`);
    
    if (finalCleaned.length >= 2) {
      console.log('[PDF] OCR text accepted');
      console.log('[PDF] Continuing to Gemini');
    }
    
    if (isPasswordProtected && finalCleaned.length < 2) {
      console.log('[PDF] Encryption detected by parser');
      throw new Error('Password protected PDF');
    }
    
    if (numPages === 0 && finalCleaned.length < 2) {
      throw new Error('Empty PDF: No pages found');
    }
    
    // A PDF is classified as scanned ONLY if all methods failed to yield searchable text
    if (numPages >= 1 && finalCleaned.length < 2) {
      throw new Error('Scanned PDF: Contains no extractable text');
    }
    
    // Log a warning if the extracted text is extremely low but contains some characters
    if (finalCleaned.length < 10) {
      console.warn(`[AI Audit Warning] PDF file "${filePath}" has very little searchable text (${finalCleaned.length} characters). Proceeding with analysis.`);
    }
    
    return extractedText.trim();
  } catch (error) {
    console.error('Error during PDF extraction pipeline:', error.message);
    throw error;
  }
};

/**
 * Robustly parse JSON from Gemini's response, handling markdown blocks if present.
 * @param {string} text - Response string from Gemini.
 * @returns {object} - Parsed JSON object.
 */
const parseRobustJSON = (text) => {
  let cleaned = text.trim();
  
  // Strip markdown code blocks if the model wrapped the JSON in them
  const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = cleaned.match(markdownRegex);
  if (match) {
    cleaned = match[1].trim();
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed standard JSON parsing, attempting brace extraction cleanup:', error.message);
    
    // Fallback: extract substring between first '{' and last '}'
    const startBrace = cleaned.indexOf('{');
    const endBrace = cleaned.lastIndexOf('}');
    if (startBrace !== -1 && endBrace !== -1 && endBrace > startBrace) {
      cleaned = cleaned.substring(startBrace, endBrace + 1);
    }
    
    try {
      return JSON.parse(cleaned);
    } catch (innerError) {
      console.error('Failed cleaned JSON parsing:', innerError.message);
      throw new Error(`Failed to parse Gemini JSON: ${innerError.message}\nRaw response: ${text}`);
    }
  }
};

/**
 * Analyzes tax text content using Google Gemini API.
 * @param {string} textContent - Raw text extracted from tax PDF.
 * @param {string} documentType - Document classification (e.g. Form 16, AIS, Form 26AS, Income Tax Notice).
 * @param {object} clientDetails - Metadata of the client (fullName, panNumber, etc.).
 * @returns {Promise<object>} - Structured review details.
 */
const analyzeWithGemini = async (textContent, documentType, clientDetails) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured in environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using the latest supported Gemini model (gemini-2.5-flash)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
You are an experienced Indian Chartered Accountant (CA) with deep expertise in the Income Tax Act, 1961.
Analyze the following raw text content extracted from an Indian tax document for Client: ${clientDetails.fullName} (PAN: ${clientDetails.panNumber || 'N/A'}).

Document Type: ${documentType}

Extracted Text:
"""
${textContent.substring(0, 45000)}
"""

Your task is to analyze this tax document and return a JSON object that strictly adheres to the following JSON structure:

{
  "incomeSummary": {
    "grossSalary": 0,
    "otherIncome": 0,
    "totalGrossIncome": 0,
    "deductionsTotal": 0,
    "taxableIncome": 0
  },
  "taxesPaid": {
    "tds": 0,
    "tcs": 0,
    "advanceTax": 0,
    "selfAssessmentTax": 0,
    "totalTaxPaid": 0
  },
  "deductions": [
    { "name": "Section name (e.g., Section 80C)", "amount": 0 }
  ],
  "missingDeductions": ["List of tax-saving deductions under Section 80C, 80D, etc. that seem underutilized or missing based ONLY on the document contents and standard Indian tax rules"],
  "missingDocuments": ["Specific documents needed based on the document type and findings (e.g. Form 16, Form 26AS, AIS)"],
  "issues": [
    { "severity": "Low|Medium|High", "issue": "Short summary", "description": "Details about the audit issue, PAN mismatch, mathematical error, or tax discrepancy found" }
  ],
  "recommendations": ["Actionable optimization suggestions according to the Income Tax Act, 1961"],
  "riskLevel": "Low|Medium|High",
  "aiModelUsed": "Gemini 2.5 Flash"
}

Strict Rules for Analysis:
1. Extract all numeric values accurately from the provided text. NEVER use mock or default values. If a value is not explicitly found in the text, set it to 0 or appropriate empty value (0, [], "").
2. If there are inconsistencies, such as the PAN number in the document not matching the client's PAN (${clientDetails.panNumber || 'N/A'}), flag this as a "High" severity issue.
3. Compute totalGrossIncome as grossSalary + otherIncome. Compute taxableIncome as totalGrossIncome - deductionsTotal. Compute totalTaxPaid as tds + tcs + advanceTax + selfAssessmentTax. Ensure all calculations are mathematically consistent based on the extracted figures.
4. Keep the JSON keys and structure EXACTLY as specified.
5. All tax rules must follow the Indian Income Tax Act, 1961. The summary, issues, recommendations, and warnings must depend ONLY on the uploaded document contents. Do not assume or invent figures.
6. Under no circumstances should you generate fake data. If details are not in the PDF text, they do not exist for the purpose of this analysis.
`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  const responseText = result.response.text();
  return parseRobustJSON(responseText);
};

/**
 * Fallback parser using regex to extract figures from text when Gemini is not configured or fails.
 * Completely free of mock values; returns 0 or empty for missing data.
 * @param {string} text - Raw text extracted from tax PDF.
 * @param {string} documentType - Document classification.
 * @param {object} client - Client details.
 * @returns {object} - Structured review details.
 */
const runFallbackParser = (text, documentType, client) => {
  console.log('Gemini API is unavailable or failed. Running fallback rule-based parser.');

  let grossSalary = 0;
  let otherIncome = 0;
  let tds = 0;
  let tcs = 0;
  let advanceTax = 0;
  let selfAssessmentTax = 0;
  let deductionsTotal = 0;

  const deductions = [];
  const issues = [];
  const missingDeductions = [];
  const missingDocuments = [];
  const recommendations = [];

  // Helper to parse numbers securely
  const parseAmount = (matchStr) => {
    if (!matchStr) return 0;
    const cleaned = matchStr.replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // 1. Check for PAN mismatches if PAN exists
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g;
  const pansFound = text.match(panRegex) || [];
  const uniquePans = [...new Set(pansFound.map(p => p.toUpperCase()))];
  
  if (client.panNumber) {
    const clientPan = client.panNumber.toUpperCase();
    if (uniquePans.length > 0 && !uniquePans.includes(clientPan)) {
      issues.push({
        severity: 'High',
        issue: 'PAN Number Mismatch',
        description: `The document contains PAN number(s) [${uniquePans.join(', ')}], which does not match the registered client PAN [${clientPan}]. This could indicate uploading the wrong document.`,
      });
      recommendations.push(`Verify the uploaded document belongs to client ${client.fullName} and matches PAN ${clientPan}.`);
    }
  }

  // 2. Extract Gross Salary
  const grossRegex = /(?:gross\s+(?:salary|income|pay|earnings)|salary\s+under\s+section\s+17|total\s+amount\s+of\s+salary)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const grossMatch = text.match(grossRegex);
  if (grossMatch) {
    grossSalary = parseAmount(grossMatch[1]);
  }

  // 3. Extract Other Income
  const otherIncRegex = /(?:income\s+from\s+other\s+sources|other\s+income|interest\s+income|savings\s+bank\s+interest)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const otherMatch = text.match(otherIncRegex);
  if (otherMatch) {
    otherIncome = parseAmount(otherMatch[1]);
  }

  // 4. Extract Taxes Paid
  const tdsRegex = /(?:tax\s+deducted\s+at\s+source|tax\s+deducted|tds|total\s+tds|total\s+tax\s+deducted)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const tdsMatch = text.match(tdsRegex);
  if (tdsMatch) {
    tds = parseAmount(tdsMatch[1]);
  }

  const tcsRegex = /(?:tax\s+collected\s+at\s+source|tcs|total\s+tcs)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const tcsMatch = text.match(tcsRegex);
  if (tcsMatch) {
    tcs = parseAmount(tcsMatch[1]);
  }

  const advanceTaxRegex = /(?:advance\s+tax(?:es)?(?:\s+paid)?)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const advanceMatch = text.match(advanceTaxRegex);
  if (advanceMatch) {
    advanceTax = parseAmount(advanceMatch[1]);
  }

  const selfAssTaxRegex = /(?:self\s+assessment\s+tax(?:\s+paid)?)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const selfAssMatch = text.match(selfAssTaxRegex);
  if (selfAssMatch) {
    selfAssessmentTax = parseAmount(selfAssMatch[1]);
  }

  // 5. Extract Deductions (80C, 80D, 80G, 80TTA, 24)
  const sec80cRegex = /(?:section\s+80c|sec\s+80c|80c\b|provident\s+fund|ppf|elss|life\s+insurance)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const sec80cMatch = text.match(sec80cRegex);
  if (sec80cMatch) {
    const val = parseAmount(sec80cMatch[1]);
    if (val > 0) {
      const allowed80C = Math.min(val, 150000);
      deductions.push({ name: 'Section 80C Deductions', amount: allowed80C });
      deductionsTotal += allowed80C;
    }
  }

  const sec80dRegex = /(?:section\s+80d|sec\s+80d|80d\b|medical\s+insurance|mediclaim)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const sec80dMatch = text.match(sec80dRegex);
  if (sec80dMatch) {
    const val = parseAmount(sec80dMatch[1]);
    if (val > 0) {
      const allowed80D = Math.min(val, 25000);
      deductions.push({ name: 'Section 80D Health Insurance', amount: allowed80D });
      deductionsTotal += allowed80D;
    }
  }

  const sec80gRegex = /(?:section\s+80g|sec\s+80g|80g\b|donation(?:s)?)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const sec80gMatch = text.match(sec80gRegex);
  if (sec80gMatch) {
    const val = parseAmount(sec80gMatch[1]);
    if (val > 0) {
      deductions.push({ name: 'Section 80G Donations', amount: val });
      deductionsTotal += val;
    }
  }

  const sec80ttaRegex = /(?:section\s+80tta|sec\s+80tta|80tta\b)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const sec80ttaMatch = text.match(sec80ttaRegex);
  if (sec80ttaMatch) {
    const val = parseAmount(sec80ttaMatch[1]);
    if (val > 0) {
      const allowed80TTA = Math.min(val, 10000);
      deductions.push({ name: 'Section 80TTA Savings Interest Deduction', amount: allowed80TTA });
      deductionsTotal += allowed80TTA;
    }
  }

  const sec24Regex = /(?:section\s+24|sec\s+24|housing\s+loan\s+interest|interest\s+on\s+housing\s+loan)\s*[:\-\u2013\u2014]*\s*(?:inr|rs\.?|inr\.)?\s*([\d,]+(?:\.\d{2})?)/i;
  const sec24Match = text.match(sec24Regex);
  if (sec24Match) {
    const val = parseAmount(sec24Match[1]);
    if (val > 0) {
      const allowed24 = Math.min(val, 200000);
      deductions.push({ name: 'Section 24 (Housing Loan Interest)', amount: allowed24 });
      deductionsTotal += allowed24;
    }
  }

  // 6. Income Calculations
  const totalGrossIncome = grossSalary + otherIncome;
  const taxableIncome = Math.max(0, totalGrossIncome - deductionsTotal);
  const totalTaxPaid = tds + tcs + advanceTax + selfAssessmentTax;

  // 7. Dynamic Audit Warnings and Shortfall Assessment
  if (taxableIncome > 0) {
    let estimatedTax = 0;
    // Standard Slab rates (Old Regime) for analysis purposes
    if (taxableIncome > 1000000) {
      estimatedTax = 112500 + (taxableIncome - 1000000) * 0.3;
    } else if (taxableIncome > 500000) {
      estimatedTax = 12500 + (taxableIncome - 500000) * 0.2;
    } else if (taxableIncome > 250000) {
      estimatedTax = (taxableIncome - 250000) * 0.05;
    }

    estimatedTax = Math.round(estimatedTax * 1.04);
    if (taxableIncome <= 500000) {
      estimatedTax = 0; // Tax rebate under Sec 87A
    }

    const taxDifference = estimatedTax - totalTaxPaid;
    if (taxDifference > 5000) {
      issues.push({
        severity: 'Medium',
        issue: 'Potential Tax Shortfall',
        description: `Based on the extracted taxable income of INR ${taxableIncome.toLocaleString('en-IN')}, the estimated tax liability is INR ${estimatedTax.toLocaleString('en-IN')}, but total tax paid is INR ${totalTaxPaid.toLocaleString('en-IN')}. A potential shortfall of INR ${taxDifference.toLocaleString('en-IN')} exists.`,
      });
      recommendations.push('Verify outstanding income declarations and pay any self-assessment tax shortfall to avoid Section 234B/C interest.');
    }
  }

  // 8. Document specific contextual findings (No Hardcoded templates/mock variables)
  if (documentType === 'Form 16') {
    missingDocuments.push('Form 26AS');
    recommendations.push('Cross-verify Form 16 TDS details with Form 26AS on TRACES to avoid credits mismatch.');
  } else if (documentType === 'Salary Slip') {
    missingDocuments.push('Form 16');
    recommendations.push('Ensure a consolidated Form 16 Part A & B is obtained from your employer for final computations.');
  }

  // 9. Dynamic Risk Level calculation
  let riskLevel = 'Low';
  if (issues.some(i => i.severity === 'High')) {
    riskLevel = 'High';
  } else if (issues.some(i => i.severity === 'Medium')) {
    riskLevel = 'Medium';
  }

  return {
    incomeSummary: {
      grossSalary,
      otherIncome,
      totalGrossIncome,
      deductionsTotal,
      taxableIncome,
    },
    taxesPaid: {
      tds,
      tcs,
      advanceTax,
      selfAssessmentTax,
      totalTaxPaid,
    },
    deductions,
    missingDeductions,
    missingDocuments,
    issues,
    recommendations,
    riskLevel,
    aiModelUsed: 'Rule-Based Fallback Parser (Offline)',
  };
};

/**
 * Orchestrator function to parse file and analyze content.
 * @param {string} filePath - Absolute path to uploaded PDF on server.
 * @param {string} documentType - E.g. "Form 16", "AIS", etc.
 * @param {object} clientDetails - Metadata of the client.
 * @returns {Promise<object>} - Structured analysis review result.
 */
const runTaxReview = async (filePath, documentType, clientDetails) => {
  const startTime = Date.now();
  let textContent = '';
  
  try {
    textContent = await extractTextFromPDF(filePath);
  } catch (error) {
    console.error('PDF text extraction failed:', error.message);
    const msg = error.message;
    let errorType = 'PDF Extraction Error';
    let errorDesc = `An error occurred during PDF text extraction: ${msg}`;
    
    if (msg.includes('Password protected')) {
      errorType = 'Password Protected PDF';
      errorDesc = 'The uploaded PDF is password protected and cannot be read by the AI Review System. Please remove the password and re-upload the document.';
    } else if (msg.includes('Scanned PDF')) {
      errorType = 'Scanned PDF';
      errorDesc = 'The uploaded PDF appears to be a scanned document containing only images. The AI Review System requires a digital PDF with searchable text.';
    } else if (msg.includes('Empty PDF')) {
      errorType = 'Empty PDF';
      errorDesc = 'The uploaded PDF file is empty and contains no readable pages or text. Please upload a valid document.';
    } else if (msg.includes('Corrupted') || msg.includes('unreadable')) {
      errorType = 'Corrupted PDF';
      errorDesc = 'The uploaded PDF file is corrupted or in an invalid format. Please export/save the document again as a valid PDF and re-upload.';
    }
    
    return {
      incomeSummary: { grossSalary: 0, otherIncome: 0, totalGrossIncome: 0, deductionsTotal: 0, taxableIncome: 0 },
      taxesPaid: { tds: 0, tcs: 0, advanceTax: 0, selfAssessmentTax: 0, totalTaxPaid: 0 },
      deductions: [],
      missingDeductions: [],
      missingDocuments: [],
      issues: [
        {
          severity: 'High',
          issue: errorType,
          description: errorDesc,
        }
      ],
      recommendations: [
        `Please resolve the issue with the PDF file (${errorType}) and re-upload to proceed with tax analysis.`
      ],
      riskLevel: 'High',
      aiModelUsed: 'Error Handler',
      processingTime: Date.now() - startTime,
      reviewDate: new Date()
    };
  }

  let analysisResult;
  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
      try {
        // Attempt 1
        analysisResult = await analyzeWithGemini(textContent, documentType, clientDetails);
      } catch (firstAttemptError) {
        console.warn('Gemini API attempt 1 failed. Automatically retrying once... Error:', firstAttemptError.message);
        // Wait 1.5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Attempt 2 (Retry once)
        analysisResult = await analyzeWithGemini(textContent, documentType, clientDetails);
      }
    } else {
      analysisResult = runFallbackParser(textContent, documentType, clientDetails);
    }
  } catch (apiError) {
    console.error('Gemini API analysis failed on both attempts. Running fallback rule-based parser:', apiError.message);
    analysisResult = runFallbackParser(textContent, documentType, clientDetails);
  }

  const endTime = Date.now();
  analysisResult.processingTime = endTime - startTime;
  analysisResult.reviewDate = new Date();

  return analysisResult;
};

module.exports = {
  extractTextFromPDF,
  runTaxReview,
};
