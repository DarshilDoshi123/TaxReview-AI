require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Standard Middlewares
app.use(cors({ origin: '*' })); // Permit cross-origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API Routes
const dbCheckMiddleware = require('./middleware/dbCheckMiddleware');
app.use('/api', dbCheckMiddleware);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));

// Root path test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'TaxReview AI API is online' });
});

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
