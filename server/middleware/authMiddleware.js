const jwt = require('jsonwebtoken');
const { User } = require('../models');
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
    const user = await User.findById(decoded.id)
      .select('-password')
      .populate('group', 'name')
      .where({ isActive: true });

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
      const user = await User.findById(decoded.id)
        .select('-password')
        .populate('group', 'name')
        .where({ isActive: true });

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

// RBAC Permission Checking Functions
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Access denied. Please login first');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, `Access denied. Your role '${req.user.role}' does not have permission`);
    }

    next();
  };
};

const requireAdmin = requireRole('admin');
const requireLeader = requireRole('admin', 'leader');
const requireUser = requireRole('admin', 'leader', 'user');

// Check if user can edit a specific lead
const canEditLead = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 401, 'Access denied. Please login first');
  }

  // Admin can edit any lead
  if (req.user.role === 'admin') {
    return next();
  }

  // For Leaders and Users, we need to check lead ownership
  // This will be handled in the route handler as we need the lead data
  next();
};

// Check if user can manage group
const canManageGroup = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 401, 'Access denied. Please login first');
  }

  // Admin can manage any group
  if (req.user.role === 'admin') {
    return next();
  }

  // Leaders can manage their own group
  if (req.user.role === 'leader') {
    return next(); // We'll check group ownership in the route handler
  }

  return errorResponse(res, 403, 'Access denied. You do not have group management permissions');
};

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
  requireRole,
  requireAdmin,
  requireLeader,
  requireUser,
  canEditLead,
  canManageGroup,
  authRateLimit,
  generalRateLimit,
  apiRateLimit
};