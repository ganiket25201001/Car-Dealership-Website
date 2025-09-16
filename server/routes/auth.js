const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Import models
const { TeamMember } = require('../models');

// Import middleware
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation failed', errors.array());
  }
  next();
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  const options = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  
  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.resetPasswordToken;
  delete userResponse.resetPasswordExpire;
  
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: userResponse,
        token
      }
    });
};

// @desc    Register user (for initial setup)
// @route   POST /api/v1/auth/register
// @access  Public (but should be restricted in production)
router.post('/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('role')
      .optional()
      .isIn(['Sales Representative', 'Sales Manager', 'Admin'])
      .withMessage('Invalid role'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const { name, email, password, role = 'Sales Representative' } = req.body;
      
      // Check if user already exists
      const existingUser = await TeamMember.findOne({ 
        email: email.toLowerCase(),
        isActive: true 
      });
      
      if (existingUser) {
        return errorResponse(res, 400, 'User with this email already exists');
      }
      
      // Check if this is the first user (make them admin)
      const userCount = await TeamMember.countDocuments({ isActive: true });
      const userRole = userCount === 0 ? 'Admin' : role;
      
      // Create user
      const user = await TeamMember.create({
        name,
        email: email.toLowerCase(),
        password,
        role: userRole
      });
      
      sendTokenResponse(user, 201, res);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 11000) {
        return errorResponse(res, 400, 'User with this email already exists');
      }
      return errorResponse(res, 500, 'Registration failed');
    }
  })
);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user and include password for comparison
      const user = await TeamMember.findOne({ 
        email: email.toLowerCase(),
        isActive: true 
      }).select('+password');
      
      if (!user) {
        return errorResponse(res, 401, 'Invalid email or password');
      }
      
      // Check if user is active
      if (user.status !== 'active') {
        return errorResponse(res, 401, 'Account is inactive. Please contact administrator.');
      }
      
      // Check password
      const isPasswordValid = await user.matchPassword(password);
      if (!isPasswordValid) {
        return errorResponse(res, 401, 'Invalid email or password');
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      sendTokenResponse(user, 200, res);
    } catch (error) {
      console.error('Login error:', error);
      return errorResponse(res, 500, 'Login failed');
    }
  })
);

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
router.get('/me',
  require('../middleware/authMiddleware').protect,
  asyncHandler(async (req, res) => {
    try {
      const user = await TeamMember.findById(req.user._id)
        .select('-password -resetPasswordToken -resetPasswordExpire');
      
      return successResponse(res, 200, 'User profile retrieved successfully', user);
    } catch (error) {
      return errorResponse(res, 500, 'Error retrieving user profile');
    }
  })
);

// @desc    Update user profile
// @route   PUT /api/v1/auth/me
// @access  Private
router.put('/me',
  require('../middleware/authMiddleware').protect,
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please enter a valid phone number'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      // Fields that user can update
      const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      };
      
      // Remove undefined fields
      Object.keys(fieldsToUpdate).forEach(key => 
        fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
      );
      
      const user = await TeamMember.findByIdAndUpdate(
        req.user._id,
        fieldsToUpdate,
        {
          new: true,
          runValidators: true
        }
      ).select('-password -resetPasswordToken -resetPasswordExpire');
      
      return successResponse(res, 200, 'Profile updated successfully', user);
    } catch (error) {
      if (error.code === 11000) {
        return errorResponse(res, 400, 'Email already exists');
      }
      return errorResponse(res, 500, 'Error updating profile');
    }
  })
);

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
router.put('/updatepassword',
  require('../middleware/authMiddleware').protect,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match');
        }
        return true;
      }),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const user = await TeamMember.findById(req.user._id).select('+password');
      
      // Check current password
      const isCurrentPasswordValid = await user.matchPassword(req.body.currentPassword);
      if (!isCurrentPasswordValid) {
        return errorResponse(res, 400, 'Current password is incorrect');
      }
      
      user.password = req.body.newPassword;
      await user.save();
      
      sendTokenResponse(user, 200, res);
    } catch (error) {
      return errorResponse(res, 500, 'Error updating password');
    }
  })
);

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
router.get('/logout',
  asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    
    return successResponse(res, 200, 'User logged out successfully');
  })
);

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
router.post('/forgotpassword',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const user = await TeamMember.findOne({ 
        email: req.body.email,
        isActive: true 
      });
      
      if (!user) {
        return errorResponse(res, 404, 'No user found with this email');
      }
      
      // Get reset token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      
      // Create reset url
      const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
      
      const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
      
      try {
        // Here you would typically send an email
        // For demo purposes, we'll just return the reset token
        return successResponse(res, 200, 'Password reset token generated', {
          resetToken,
          resetUrl,
          message: 'In production, this would be sent via email'
        });
      } catch (error) {
        console.error(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        
        return errorResponse(res, 500, 'Email could not be sent');
      }
    } catch (error) {
      return errorResponse(res, 500, 'Error processing forgot password request');
    }
  })
);

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
router.put('/resetpassword/:resettoken',
  [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match');
        }
        return true;
      }),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      // Get hashed token
      const crypto = require('crypto');
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
      
      const user = await TeamMember.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
        isActive: true
      });
      
      if (!user) {
        return errorResponse(res, 400, 'Invalid or expired token');
      }
      
      // Set new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      sendTokenResponse(user, 200, res);
    } catch (error) {
      return errorResponse(res, 500, 'Error resetting password');
    }
  })
);

// @desc    Check if user is authenticated
// @route   GET /api/v1/auth/check
// @access  Public
router.get('/check',
  asyncHandler(async (req, res) => {
    let token;
    
    // Check for token in headers or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token || token === 'none') {
      return successResponse(res, 200, 'Not authenticated', { isAuthenticated: false });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await TeamMember.findById(decoded.id)
        .select('-password -resetPasswordToken -resetPasswordExpire');
      
      if (!user || !user.isActive || user.status !== 'active') {
        return successResponse(res, 200, 'Not authenticated', { isAuthenticated: false });
      }
      
      return successResponse(res, 200, 'Authenticated', { 
        isAuthenticated: true,
        user 
      });
    } catch (error) {
      return successResponse(res, 200, 'Not authenticated', { isAuthenticated: false });
    }
  })
);

module.exports = router;