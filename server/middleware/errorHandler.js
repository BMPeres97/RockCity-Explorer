/**
 * RockCity Explorer - Centralized Error Handling Middleware
 * SRS Section 27: Error Handling & Security Guidelines
 * - Return consistent JSON error responses
 * - Handle Mongoose validation, duplicate key, and bad ObjectId errors gracefully
 * - Never expose internal stack traces to normal users in production
 */

const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Place not found.';
  }

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'A place with this name already exists.';
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Handle JWT token errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  // Hide stack trace from normal users (SRS Section 27)
  const showStack = process.env.SHOW_STACK === 'true' && process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message,
    ...(showStack ? { stack: err.stack } : {})
  });
};

module.exports = { notFound, errorHandler };
