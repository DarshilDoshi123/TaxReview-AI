const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide client full name'],
      trim: true,
    },
    panNumber: {
      type: String,
      required: [true, 'Please provide client PAN number'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        'Please provide a valid PAN number (Format: ABCDE1234F)',
      ],
    },
    email: {
      type: String,
      required: [true, 'Please provide client email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Please provide client mobile number'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Client', clientSchema);
