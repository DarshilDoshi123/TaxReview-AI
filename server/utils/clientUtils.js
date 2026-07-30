const Client = require('../models/Client');

/**
 * Safely gets or creates a client profile for a user with role 'Client'.
 * Prevents race conditions and duplicate PAN number collisions (E11000).
 *
 * @param {Object} user - The authenticated user object from req.user
 * @returns {Promise<Object|null>} Client mongoose document
 */
const getOrCreateClientProfile = async (user) => {
  if (!user) return null;
  const userEmail = (user.email || '').toLowerCase().trim();

  // Try finding existing client profile by email or createdBy
  let clientProfile = await Client.findOne({
    $or: [{ email: userEmail }, { createdBy: user._id }]
  });

  if (clientProfile) {
    return clientProfile;
  }

  // Attempt up to 10 retries with unique TEMPA PAN generation
  let attempts = 0;
  while (attempts < 10) {
    try {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const panNumber = `TEMPA${randomDigits}T`;

      const existingPan = await Client.findOne({ panNumber });
      if (existingPan) {
        attempts++;
        continue;
      }

      clientProfile = await Client.create({
        fullName: user.name || (userEmail ? userEmail.split('@')[0] : 'Taxpayer Client'),
        email: userEmail,
        panNumber,
        mobileNumber: '9999999999',
        address: 'Not Provided',
        createdBy: user._id,
      });

      return clientProfile;
    } catch (err) {
      if (err.code === 11000) {
        // Handle E11000 duplicate key error (concurrent request created profile or hit duplicate key)
        clientProfile = await Client.findOne({
          $or: [{ email: userEmail }, { createdBy: user._id }]
        });
        if (clientProfile) {
          return clientProfile;
        }
        attempts++;
      } else {
        throw err;
      }
    }
  }

  return null;
};

module.exports = {
  getOrCreateClientProfile,
};
