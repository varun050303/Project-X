import logger from '../utils/logging/logger.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Define common error types and their corresponding HTTP status codes
const ERROR_TYPES = {
  ValidationError: 400,
  CastError: 400,
  JsonWebTokenError: 401,
  TokenExpiredError: 401,
  NotFoundError: 404,
  ForbiddenError: 403,
  ConflictError: 409,
  RateLimitError: 429,
};

/**
 * Central error handler for the application
 */
const errorHandler = (err, req, res, next) => {
  // Log the error with contextual information
  logger.error({
    message: `Error: ${err.message}`,
    data: {
      requestId: req.id,
      path: req.path,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id || 'unauthenticated',
      name: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });

  // Determine status code based on error type
  let statusCode = err.status || ERROR_TYPES[err.name] || 500;
  let message = err.message || 'Something went wrong';
  let errorData = {};

  // Handle specific error types
  switch (err.name) {
    case 'ValidationError':
      // Handle validation errors (e.g. from Joi or Mongoose)
      message = 'Validation failed';
      if (err.details) {
        errorData.details = err.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
      }
      break;
      
    case 'JsonWebTokenError':
      message = 'Invalid token';
      break;
      
    case 'TokenExpiredError':
      message = 'Token expired';
      break;
      
    case 'CastError':
      message = 'Invalid ID format';
      break;
      
    case 'SyntaxError':
      if (err.status === 400) {
        message = 'Invalid request syntax';
      }
      break;
      
    default:
      // For unknown errors in production, use a generic message
      if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'An unexpected error occurred';
      }
  }

  // Create the error response
  const errorResponse = new ApiResponse(
    statusCode,
    { error: true, ...errorData },
    message
  );

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponse.data.stack = err.stack.split('\n');
  }

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware to handle 404 errors for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Resource not found: ${req.originalUrl}`);
  next(error);
};

/**
 * Utility function to handle async errors in route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;
