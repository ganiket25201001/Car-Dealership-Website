const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Import models
const { User, Group } = require('../models');

// Import middleware
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware');
const { protect, requireAdmin, requireLeader } = require('../middleware/authMiddleware');

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
      
      console.log('🔍 Login attempt:', { email, passwordProvided: !!password });
      
      // Find user and include password for comparison
      const user = await User.findOne({ 
        email: email.toLowerCase(),
        isActive: true 
      }).select('+password').populate('group', 'name');
      
      console.log('👤 User found:', !!user);
      if (user) {
        console.log('   User details:', { 
          name: user.name, 
          email: user.email, 
          role: user.role,
          isActive: user.isActive,
          hasPassword: !!user.password
        });
      }
      
      if (!user) {
        console.log('❌ User not found or not active');
        return errorResponse(res, 401, 'Invalid email or password');
      }
      
      // Check password
      console.log('🔐 Checking password...');
      const isPasswordValid = await user.comparePassword(password);
      console.log('   Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Password invalid');
        return errorResponse(res, 401, 'Invalid email or password');
      }
      
      // Update last activity
      console.log('⏰ Updating last activity...');
      await user.updateActivity();
      
      console.log('✅ Login successful, sending token response');
      sendTokenResponse(user, 200, res);
    } catch (error) {
      console.error('Login error:', error);
      return errorResponse(res, 500, 'Login failed');
    }
  })
);

// @desc    Register user (Admin creates Leaders, Leaders create Users)
// @route   POST /api/v1/auth/register
// @access  Private (Admin/Leader)
router.post('/register',
  protect,
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
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .isIn(['admin', 'leader', 'user'])
      .withMessage('Invalid role'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Permission checks
      if (role === 'leader' && req.user.role !== 'admin') {
        return errorResponse(res, 403, 'Only admins can create leaders');
      }
      
      if (role === 'user' && !['admin', 'leader'].includes(req.user.role)) {
        return errorResponse(res, 403, 'Only admins and leaders can create users');
      }

      if (role === 'admin' && req.user.role !== 'admin') {
        return errorResponse(res, 403, 'Only admins can create other admins');
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ 
        email: email.toLowerCase()
      });
      
      if (existingUser) {
        return errorResponse(res, 400, 'User with this email already exists');
      }
      
      // Create user
      const userData = {
        name,
        email: email.toLowerCase(),
        password,
        role,
        createdBy: req.user._id
      };

      const user = await User.create(userData);

      successResponse(res, 201, 'User created successfully', {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return errorResponse(res, 400, 'Validation error', messages);
      }
      return errorResponse(res, 500, 'Server error during registration');
    }
  })
);

// @desc    Initial setup - Create first admin user
// @route   POST /api/v1/auth/setup
// @access  Public (only works if no users exist)
router.post('/setup',
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
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      // Check if any users exist
      const userCount = await User.countDocuments();
      
      if (userCount > 0) {
        return errorResponse(res, 400, 'Setup already completed. Users already exist.');
      }
      
      const { name, email, password } = req.body;
      
      // Create first admin user
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: 'admin'
      });

      sendTokenResponse(user, 201, res);
    } catch (error) {
      console.error('Setup error:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return errorResponse(res, 400, 'Validation error', messages);
      }
      return errorResponse(res, 500, 'Setup failed');
    }
  })
);

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
router.get('/me',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .populate('group', 'name description')
      .populate('createdBy', 'name email');
    
    successResponse(res, 200, 'User details retrieved successfully', { user });
  })
);

// @desc    Update user profile
// @route   PUT /api/v1/auth/me
// @access  Private
router.put('/me',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Please enter a valid phone number'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    const { name, phone } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('group', 'name description');
    
    successResponse(res, 200, 'Profile updated successfully', { user });
  })
);

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
router.post('/logout',
  protect,
  asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    
    successResponse(res, 200, 'User logged out successfully');
  })
);

// @desc    Assign tags to a leader (Admin only)
// @route   PUT /api/v1/auth/assign-tags/:userId
// @access  Private (Admin only)
router.put('/assign-tags/:userId',
  protect,
  requireAdmin,
  [
    body('tags')
      .isArray()
      .withMessage('Tags must be an array')
      .custom((tags) => {
        if (tags.some(tag => typeof tag !== 'string' || tag.length > 50)) {
          throw new Error('Each tag must be a string with maximum 50 characters');
        }
        return true;
      }),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { tags } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (user.role !== 'leader') {
      return errorResponse(res, 400, 'Tags can only be assigned to leaders');
    }

    user.tags = tags;
    await user.save();

    successResponse(res, 200, 'Tags assigned successfully', { user });
  })
);

// @desc    Debug - List all users (temporary endpoint)
// @route   GET /api/v1/auth/debug-users
// @access  Public (for debugging only)
router.get('/debug-users',
  asyncHandler(async (req, res) => {
    try {
      const users = await User.find({}, 'name email role createdAt');
      successResponse(res, 200, 'Debug: All users', { 
        count: users.length,
        users: users 
      });
    } catch (error) {
      console.error('Debug users error:', error);
      return errorResponse(res, 500, 'Debug failed');
    }
  })
);

module.exports = router;