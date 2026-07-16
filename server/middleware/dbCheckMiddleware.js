const mongoose = require('mongoose');

/**
 * Middleware to verify that the database is connected.
 * Prevents Mongoose buffering timeouts and returns a helpful instructions error instead.
 */
const dbCheckMiddleware = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503);
    return next(new Error('Database Connection Offline: Please check that your local MongoDB server is active or configure a valid Atlas MONGO_URI in your server/.env file.'));
  }
  next();
};

module.exports = dbCheckMiddleware;
