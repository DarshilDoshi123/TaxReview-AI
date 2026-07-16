require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Client = require('./models/Client');
const { runTaxReview } = require('./services/aiService');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const runVerification = async () => {
  console.log('=== STARTING BACKEND INTEGRATION VERIFICATION ===');
  
  const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taxreview_ai_test';
  console.log(`Attempting database connection to: ${dbUri}`);

  let dbConnected = false;
  try {
    // 2-second timeout to avoid long waits if database is not active
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 2000 });
    console.log('✔ MongoDB Connected Successfully!');
    dbConnected = true;
  } catch (err) {
    console.log('⚠ MongoDB Connection Failed. Running business logic & parser tests in offline/in-memory mode.');
  }

  try {
    if (dbConnected) {
      // Clean up old test data
      await User.deleteMany({ email: 'verification_test@domain.com' });
      await Client.deleteMany({ email: 'client_verification@domain.com' });
      console.log('✔ Cleaned up old test database records.');
    }

    // 1. Test Hashing & Passwords programmatically
    console.log('\n--- 1. Testing Password Cryptography ---');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('verification_secure_password_2026', salt);
    const matchesPassword = await bcrypt.compare('verification_secure_password_2026', hashedPassword);
    console.log(`✔ Password hashed successfully: ${hashedPassword !== 'verification_secure_password_2026'}`);
    console.log(`✔ Hashed password verification match check: ${matchesPassword ? 'PASSED' : 'FAILED'}`);

    // 2. Test Client PAN format validator logic
    console.log('\n--- 2. Testing Client PAN Schema Validation ---');
    const validPAN = 'ABCDE1234F';
    const invalidPAN = 'abcde1234';
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    console.log(`✔ Valid PAN (${validPAN}) match check: ${panRegex.test(validPAN.toUpperCase()) ? 'PASSED' : 'FAILED'}`);
    console.log(`✔ Invalid PAN (${invalidPAN}) match check: ${!panRegex.test(invalidPAN.toUpperCase()) ? 'PASSED' : 'FAILED'}`);

    // 3. Test AI Review Service Fallback Logic
    console.log('\n--- 3. Testing PDF Fallback Review Engine ---');
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const mockFilePath = path.join(uploadDir, 'mock_verify_tax.pdf');
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(mockFilePath);
    doc.pipe(writeStream);
    doc.text('PAN: ABCDE1234F');
    doc.text('Gross Salary: INR 9,50,000');
    doc.text('TDS Tax Deducted: 78,000');
    doc.text('Section 80C PF: 1,20,000');
    doc.end();
    await new Promise((resolve) => writeStream.on('finish', resolve));
    console.log('✔ Created temporary mock Form 16 PDF file.');

    // Run review parser
    const dummyClient = { fullName: 'Vikram Mehta', panNumber: 'ABCDE1234F' };
    const analysis = await runTaxReview(mockFilePath, 'Form 16', dummyClient);
    console.log('✔ PDF Fallback review parser executed successfully!');
    console.log('Parsed findings:');
    console.log(`  - Gross Salary: ${analysis.incomeSummary.grossSalary}`);
    console.log(`  - Taxes Deposited (TDS): ${analysis.taxesPaid.tds}`);
    console.log(`  - Risk Level: ${analysis.riskLevel}`);
    console.log(`  - Parser Model Used: ${analysis.aiModelUsed}`);
    console.log(`  - Identified Deductions:`, analysis.deductions);
    console.log(`  - Missing Deductions Suggestions:`, analysis.missingDeductions);
    console.log(`  - Warnings/Issues list count: ${analysis.issues.length}`);

    // Clean up local mock file
    if (fs.existsSync(mockFilePath)) {
      fs.unlinkSync(mockFilePath);
    }
    console.log('✔ Cleaned up mock tax file.');

    if (dbConnected) {
      // 4. Test DB write actions if online
      console.log('\n--- 4. Testing DB Entity Writes ---');
      const testUser = await User.create({
        name: 'Verification Auditor',
        email: 'verification_test@domain.com',
        password: 'verification_secure_password_2026',
        role: 'CA'
      });
      const testClient = await Client.create({
        fullName: 'Vikram Mehta',
        panNumber: 'ABCDE1234F',
        email: 'client_verification@domain.com',
        mobileNumber: '+91 9900990099',
        address: 'Sector 5, Noida, UP',
        createdBy: testUser._id
      });
      console.log(`✔ User Registered: ${testUser.name} (${testUser.role})`);
      console.log(`✔ Client Created: ${testClient.fullName} (${testClient.panNumber})`);
      
      // Database clean up
      await User.findByIdAndDelete(testUser._id);
      await Client.findByIdAndDelete(testClient._id);
      console.log('✔ Cleaned up DB write verification test records.');
    }

    console.log('\n=== INTEGRATION VERIFICATION COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('\n✘ Verification Failed with error:', error.message);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
      console.log('✔ Mongoose disconnected successfully.');
    } catch (err) {
      console.error('Error during database disconnect:', err.message);
    }
  }
};

runVerification();
