const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const getUploadPath = require('./config/uploadPath');
require('dotenv').config();

const { sendSuccess, sendError } = require('./utils/response');
const errorMiddleware = require('./middlewares/error.middleware');

// Routes imports
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const reviewRoutes = require('./routes/review.routes');
const externalRoutes = require('./routes/external.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Security and utility middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading images from static folder in frontend
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString('utf8'));
    } catch (error) {
      req.body = {};
    }
    return next();
  }

  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return next();
  }

  const rawBody = req.apiGateway?.event?.body;
  const contentType = req.headers['content-type'] || '';

  if (rawBody && contentType.includes('application/json')) {
    try {
      req.body = JSON.parse(req.apiGateway.event.isBase64Encoded
        ? Buffer.from(rawBody, 'base64').toString('utf8')
        : rawBody);
    } catch (error) {
      req.body = {};
    }
  }

  return next();
});

// Serve uploaded static files
app.use('/uploads', express.static(getUploadPath()));

// Health check endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, 'Server is healthy', {
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api', reviewRoutes); // Handles /api/menus/:menuId/reviews and /api/reviews/:id
app.use('/api/external', externalRoutes);
app.use('/api/admin', adminRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Endpoint not found');
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
