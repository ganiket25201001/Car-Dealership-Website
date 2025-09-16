const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: res.req?.originalUrl || res.req?.url || 'unknown'
  };

  if (errors) {
    response.errors = errors;
  }

  // Log error for debugging
  if (statusCode >= 500) {
    console.error(`Server Error [${statusCode}]: ${message}`, {
      path: response.path,
      errors: errors,
      stack: res.req?.error?.stack
    });
  }

  return res.status(statusCode).json(response);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Store error in request for logging
  req.error = err;

  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return errorResponse(res, 404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    const duplicateField = Object.keys(err.keyValue)[0];
    const duplicateValue = err.keyValue[duplicateField];
    return errorResponse(res, 400, `${duplicateField} '${duplicateValue}' already exists`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
    return errorResponse(res, 400, 'Validation Error', errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Token expired');
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError') {
    return errorResponse(res, 503, 'Database connection failed');
  }

  if (err.name === 'MongoTimeoutError') {
    return errorResponse(res, 503, 'Database operation timed out');
  }

  // Rate limit error
  if (err.status === 429) {
    return errorResponse(res, 429, 'Too many requests, please try again later');
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 400, 'File too large');
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return errorResponse(res, 400, 'Too many files');
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return errorResponse(res, 400, 'Unexpected file field');
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';
  
  return errorResponse(res, statusCode, message);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  errorResponse(res, 404, error.message);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Success response helper
const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  errorResponse,
  successResponse
};
