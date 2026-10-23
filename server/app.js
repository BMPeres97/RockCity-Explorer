const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { noSqlInjectionProtection } = require('./middleware/security');
const {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME,
  DEFAULT_AVERAGE_SPEED_KMH
} = require('./config/constants');

// Route imports
const placeRoutes = require('./routes/placeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security Headers Middleware (SRS Section 26)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Standard Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL Injection Protection & Input Sanitization
app.use(noSqlInjectionProtection);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Health & Config Info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'RockCity Explorer API',
    version: '2.1.0',
    description: 'Local Tourist Day-Visit Planner & Information System for Kurunegala, Sri Lanka',
    status: 'online',
    fixedReferenceLocation: {
      latitude: REFERENCE_LATITUDE,
      longitude: REFERENCE_LONGITUDE,
      name: REFERENCE_LOCATION_NAME,
      rule: 'Fixed reference point used for all distance and travel-time calculations'
    },
    timezone: 'Asia/Colombo',
    defaultAverageSpeedKmh: DEFAULT_AVERAGE_SPEED_KMH
  });
});

// API Routes
app.use('/api/places', placeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
