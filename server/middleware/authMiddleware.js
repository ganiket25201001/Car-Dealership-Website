const jwt = require('jsonwebtoken');
const { TeamMember } = require('../models');
const { asyncHandler, errorResponse } = require('./errorMiddleware');

// Protect routes - require authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return errorResponse(res, 401, 'Access denied. No token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await TeamMember.findById(decoded.id)
      .select('-password')
      .where({ isActive: true, status: 'active' });

    if (!user) {
      return errorResponse(res, 401, 'User not found or inactive');
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid token');
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Access denied. Please login first');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, `Access denied. Role '${req.user.role}' is not authorized`);
    }

    next();
  };
};

// Check specific permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Access denied. Please login first');
    }

    if (!req.user.permissions || !req.user.permissions[permission]) {
      return errorResponse(res, 403, `Access denied. Permission '${permission}' required`);
    }

    next();
  };
};

// Optional authentication - doesn't require token but adds user if present
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await TeamMember.findById(decoded.id)
        .select('-password')
        .where({ isActive: true, status: 'active' });

      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid but continue without user
      console.warn('Invalid token in optional auth:', error.message);
    }
  }

  next();
});

// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests from this IP, please try again later',
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      return errorResponse(res, 429, message || 'Too many requests from this IP, please try again later');
    }
  });
};

// Different rate limits for different endpoints
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again in 15 minutes'
);

const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many requests, please try again in 15 minutes'
);

const apiRateLimit = createRateLimit(
  1 * 60 * 1000, // 1 minute
  30, // 30 requests per minute
  'API rate limit exceeded, please slow down'
);

module.exports = {
  protect,
  authorize,
  checkPermission,
  optionalAuth,
  authRateLimit,
  generalRateLimit,
  apiRateLimit
};