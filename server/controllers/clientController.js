const Client = require('../models/Client');
const Document = require('../models/Document');
const Review = require('../models/Review');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Get all clients
 * @route   GET /api/clients
 * @access  Private
 */
const getClients = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.user.role === 'Client') {
      let clientProfile = await Client.findOne({ email: req.user.email });
      if (!clientProfile) {
        clientProfile = await Client.create({
          fullName: req.user.name,
          email: req.user.email,
          panNumber: 'TEMPA' + Math.floor(1000 + Math.random() * 9000) + 'T',
          mobileNumber: '9999999999',
          address: 'Not Provided',
          createdBy: req.user._id,
        });
      }
      query.email = req.user.email;
    } else if (req.user.role !== 'Admin') {
      query.createdBy = req.user._id;
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single client details
 * @route   GET /api/clients/:id
 * @access  Private
 */
const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      res.status(404);
      throw new Error('Client profile not found');
    }

    // Role checks
    if (req.user.role === 'Client') {
      if (client.email !== req.user.email) {
        res.status(403);
        throw new Error('Not authorized to access this client profile');
      }
    } else if (req.user.role === 'CA') {
      if (client.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this client profile');
      }
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new client
 * @route   POST /api/clients
 * @access  Private
 */
const createClient = async (req, res, next) => {
  try {
    if (req.user.role === 'Client') {
      res.status(403);
      throw new Error('Taxpayers are not authorized to create new client profiles');
    }

    const { fullName, panNumber, email, mobileNumber, address, dateOfBirth, notes } = req.body;

    if (!fullName || !panNumber || !email || !mobileNumber) {
      res.status(400);
      throw new Error('Please fill in all required fields (Name, PAN, Email, Mobile)');
    }

    const panExists = await Client.findOne({ panNumber: panNumber.toUpperCase() });
    if (panExists) {
      res.status(400);
      throw new Error(`A client with PAN ${panNumber.toUpperCase()} already exists`);
    }

    const client = await Client.create({
      fullName,
      panNumber: panNumber.toUpperCase(),
      email,
      mobileNumber,
      address,
      dateOfBirth,
      notes,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a client profile
 * @route   PUT /api/clients/:id
 * @access  Private
 */
const updateClient = async (req, res, next) => {
  try {
    let client = await Client.findById(req.params.id);

    if (!client) {
      res.status(404);
      throw new Error('Client profile not found');
    }

    // Role check: Clients can only update their own profiles
    if (req.user.role === 'Client') {
      if (client.email !== req.user.email) {
        res.status(403);
        throw new Error('Not authorized to modify this client profile');
      }
    } else if (req.user.role === 'CA') {
      if (client.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to modify this client profile');
      }
    }

    if (req.body.panNumber && req.body.panNumber.toUpperCase() !== client.panNumber) {
      const panExists = await Client.findOne({ panNumber: req.body.panNumber.toUpperCase() });
      if (panExists) {
        res.status(400);
        throw new Error(`A client with PAN ${req.body.panNumber.toUpperCase()} already exists`);
      }
    }

    if (req.body.panNumber) {
      req.body.panNumber = req.body.panNumber.toUpperCase();
    }

    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a client profile
 * @route   DELETE /api/clients/:id
 * @access  Private
 */
const deleteClient = async (req, res, next) => {
  try {
    if (req.user.role === 'Client') {
      res.status(403);
      throw new Error('Taxpayers are not authorized to delete client profiles');
    }

    const client = await Client.findById(req.params.id);

    if (!client) {
      res.status(404);
      throw new Error('Client profile not found');
    }

    if (req.user.role !== 'Admin' && client.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this client profile');
    }

    const documents = await Document.find({ client: client._id });
    
    for (const doc of documents) {
      const filePath = path.join(__dirname, '../uploads', doc.storedFileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await Review.deleteMany({ document: doc._id });
    }

    await Document.deleteMany({ client: client._id });
    await Client.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Client and all associated files/reviews deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
