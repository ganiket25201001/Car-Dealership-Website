const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult, param } = require('express-validator');
const router = express.Router();

// Import models
const { TeamMember } = require('../models');

// Import middleware
const { protect, authorize, checkPermission } = require('../middleware/authMiddleware');
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation failed', errors.array());
  }
  next();
};

// Validation rules
const createTeamMemberValidation = [
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
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('role')
    .isIn(['Sales Representative', 'Sales Manager', 'Admin'])
    .withMessage('Invalid role'),
  body('department')
    .optional()
    .isIn(['Sales', 'Marketing', 'Service', 'Finance', 'Management'])
    .withMessage('Invalid department'),
  handleValidationErrors
];

const updateTeamMemberValidation = [
  param('id').isMongoId().withMessage('Invalid team member ID'),
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
  body('role')
    .optional()
    .isIn(['Sales Representative', 'Sales Manager', 'Admin'])
    .withMessage('Invalid role'),
  body('department')
    .optional()
    .isIn(['Sales', 'Marketing', 'Service', 'Finance', 'Management'])
    .withMessage('Invalid department'),
  handleValidationErrors
];

// @desc    Get all team members
// @route   GET /api/v1/team
// @access  Private
router.get('/', 
  protect,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { isActive: true };
    
    // Role filter
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    // Department filter
    if (req.query.department) {
      filter.department = req.query.department;
    }
    
    // Status filter (active/inactive)
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Sort options
    let sortBy = { name: 1 }; // Default sort by name
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortBy = { [sortField]: sortOrder };
    }
    
    try {
      // Get team members without password
      const teamMembers = await TeamMember.find(filter)
        .select('-password -resetPasswordToken -resetPasswordExpire')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Get total count for pagination
      const total = await TeamMember.countDocuments(filter);
      
      // Calculate pagination info
      const pages = Math.ceil(total / limit);
      const hasNext = page < pages;
      const hasPrev = page > 1;
      
      return successResponse(res, 200, 'Team members retrieved successfully', teamMembers, {
        pagination: {
          current: page,
          pages,
          total,
          hasNext,
          hasPrev,
          limit
        }
      });
    } catch (error) {
      return errorResponse(res, 500, 'Error retrieving team members');
    }
  })
);

// @desc    Get single team member
// @route   GET /api/v1/team/:id
// @access  Private
router.get('/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid team member ID'), handleValidationErrors],
  asyncHandler(async (req, res) => {
    try {
      const teamMember = await TeamMember.findById(req.params.id)
        .select('-password -resetPasswordToken -resetPasswordExpire');
      
      if (!teamMember) {
        return errorResponse(res, 404, 'Team member not found');
      }
      
      // Non-managers can only view their own profile or basic info of others
      if (req.user.role !== 'Sales Manager' && 
          req.user.role !== 'Admin' && 
          req.user._id.toString() !== req.params.id) {
        // Return limited info for non-self requests
        const limitedInfo = {
          _id: teamMember._id,
          name: teamMember.name,
          email: teamMember.email,
          role: teamMember.role,
          department: teamMember.department,
          status: teamMember.status
        };
        return successResponse(res, 200, 'Team member retrieved successfully', limitedInfo);
      }
      
      return successResponse(res, 200, 'Team member retrieved successfully', teamMember);
    } catch (error) {
      return errorResponse(res, 500, 'Error retrieving team member');
    }
  })
);

// @desc    Create new team member
// @route   POST /api/v1/team
// @access  Private (Admin/Manager only)
router.post('/',
  protect,
  authorize('Sales Manager', 'Admin'),
  createTeamMemberValidation,
  asyncHandler(async (req, res) => {
    try {
      // Check for duplicate email
      const existingMember = await TeamMember.findOne({ 
        email: req.body.email,
        isActive: true 
      });
      
      if (existingMember) {
        return errorResponse(res, 400, 'Team member with this email already exists');
      }
      
      // Create team member
      const teamMember = await TeamMember.create(req.body);
      
      // Remove password from response
      const teamMemberResponse = teamMember.toObject();
      delete teamMemberResponse.password;
      delete teamMemberResponse.resetPasswordToken;
      delete teamMemberResponse.resetPasswordExpire;
      
      return successResponse(res, 201, 'Team member created successfully', teamMemberResponse);
    } catch (error) {
      if (error.code === 11000) {
        return errorResponse(res, 400, 'Team member with this email already exists');
      }
      return errorResponse(res, 500, 'Error creating team member');
    }
  })
);

// @desc    Update team member
// @route   PUT /api/v1/team/:id
// @access  Private
router.put('/:id',
  protect,
  updateTeamMemberValidation,
  asyncHandler(async (req, res) => {
    try {
      let teamMember = await TeamMember.findById(req.params.id);
      
      if (!teamMember) {
        return errorResponse(res, 404, 'Team member not found');
      }
      
      // Check permissions
      if (req.user.role !== 'Admin' && 
          req.user.role !== 'Sales Manager' && 
          req.user._id.toString() !== req.params.id) {
        return errorResponse(res, 403, 'Access denied');
      }
      
      // Prevent non-admins from changing roles
      if (req.body.role && req.user.role !== 'Admin') {
        return errorResponse(res, 403, 'Only admins can change user roles');
      }
      
      // Prevent self-demotion for admins
      if (req.body.role && 
          req.user._id.toString() === req.params.id && 
          req.user.role === 'Admin' && 
          req.body.role !== 'Admin') {
        return errorResponse(res, 400, 'Cannot demote yourself from admin role');
      }
      
      // Update team member
      teamMember = await TeamMember.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password -resetPasswordToken -resetPasswordExpire');
      
      return successResponse(res, 200, 'Team member updated successfully', teamMember);
    } catch (error) {
      if (error.code === 11000) {
        return errorResponse(res, 400, 'Email already exists');
      }
      return errorResponse(res, 500, 'Error updating team member');
    }
  })
);

// @desc    Delete team member (soft delete)
// @route   DELETE /api/v1/team/:id
// @access  Private (Admin only)
router.delete('/:id',
  protect,
  authorize('Admin'),
  [param('id').isMongoId().withMessage('Invalid team member ID'), handleValidationErrors],
  asyncHandler(async (req, res) => {
    try {
      const teamMember = await TeamMember.findById(req.params.id);
      
      if (!teamMember) {
        return errorResponse(res, 404, 'Team member not found');
      }
      
      // Prevent self-deletion
      if (req.user._id.toString() === req.params.id) {
        return errorResponse(res, 400, 'Cannot delete your own account');
      }
      
      // Soft delete
      await TeamMember.findByIdAndUpdate(req.params.id, { 
        isActive: false, 
        status: 'inactive',
        deactivatedAt: new Date()
      });
      
      return successResponse(res, 200, 'Team member deleted successfully');
    } catch (error) {
      return errorResponse(res, 500, 'Error deleting team member');
    }
  })
);

// @desc    Change password
// @route   PUT /api/v1/team/:id/password
// @access  Private
router.put('/:id/password',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid team member ID'),
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
      const teamMember = await TeamMember.findById(req.params.id);
      
      if (!teamMember) {
        return errorResponse(res, 404, 'Team member not found');
      }
      
      // Check permissions - users can only change their own password
      if (req.user._id.toString() !== req.params.id) {
        return errorResponse(res, 403, 'You can only change your own password');
      }
      
      // Verify current password
      const isCurrentPasswordValid = await teamMember.matchPassword(req.body.currentPassword);
      if (!isCurrentPasswordValid) {
        return errorResponse(res, 400, 'Current password is incorrect');
      }
      
      // Update password
      teamMember.password = req.body.newPassword;
      await teamMember.save();
      
      return successResponse(res, 200, 'Password updated successfully');
    } catch (error) {
      return errorResponse(res, 500, 'Error updating password');
    }
  })
);

// @desc    Update team member status
// @route   PATCH /api/v1/team/:id/status
// @access  Private (Admin/Manager only)
router.patch('/:id/status',
  protect,
  authorize('Sales Manager', 'Admin'),
  [
    param('id').isMongoId().withMessage('Invalid team member ID'),
    body('status')
      .isIn(['active', 'inactive', 'on-leave'])
      .withMessage('Invalid status'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const teamMember = await TeamMember.findById(req.params.id);
      
      if (!teamMember) {
        return errorResponse(res, 404, 'Team member not found');
      }
      
      // Prevent self-deactivation
      if (req.user._id.toString() === req.params.id && req.body.status === 'inactive') {
        return errorResponse(res, 400, 'Cannot deactivate your own account');
      }
      
      // Update status
      teamMember.status = req.body.status;
      if (req.body.status === 'inactive') {
        teamMember.deactivatedAt = new Date();
      } else if (req.body.status === 'active' && teamMember.deactivatedAt) {
        teamMember.deactivatedAt = undefined;
      }
      
      await teamMember.save();
      
      return successResponse(res, 200, 'Team member status updated successfully', {
        memberId: teamMember._id,
        name: teamMember.name,
        status: teamMember.status
      });
    } catch (error) {
      return errorResponse(res, 500, 'Error updating team member status');
    }
  })
);

// @desc    Get team member performance
// @route   GET /api/v1/team/:id/performance
// @access  Private
router.get('/:id/performance',
  protect,
  [param('id').isMongoId().withMessage('Invalid team member ID'), handleValidationErrors],
  asyncHandler(async (req, res) => {
    try {
      const teamMember = await TeamMember.findById(req.params.id)
        .select('name email role performance');
      
      if (!teamMember) {
        return errorResponse(res, 404, 'Team member not found');
      }
      
      // Check permissions - users can view their own performance, managers can view all
      if (req.user.role !== 'Sales Manager' && 
          req.user.role !== 'Admin' && 
          req.user._id.toString() !== req.params.id) {
        return errorResponse(res, 403, 'Access denied');
      }
      
      // Calculate additional metrics
      const conversionRate = teamMember.performance.leadsAssigned > 0 
        ? ((teamMember.performance.totalSales / teamMember.performance.leadsAssigned) * 100).toFixed(2)
        : 0;
      
      const performanceData = {
        ...teamMember.toObject(),
        calculatedMetrics: {
          conversionRate: parseFloat(conversionRate)
        }
      };
      
      return successResponse(res, 200, 'Performance data retrieved successfully', performanceData);
    } catch (error) {
      return errorResponse(res, 500, 'Error retrieving performance data');
    }
  })
);

// @desc    Get team analytics
// @route   GET /api/v1/team/analytics/summary
// @access  Private (Manager/Admin only)
router.get('/analytics/summary',
  protect,
  authorize('Sales Manager', 'Admin'),
  asyncHandler(async (req, res) => {
    try {
      // Get total team members
      const totalMembers = await TeamMember.countDocuments({ isActive: true });
      
      // Get members by role
      const roleDistribution = await TeamMember.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]);
      
      // Get members by status
      const statusDistribution = await TeamMember.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      
      // Get top performers by sales
      const topPerformers = await TeamMember.find({ isActive: true })
        .select('name email role performance.currentMonthSales performance.totalSales')
        .sort({ 'performance.currentMonthSales': -1 })
        .limit(5);
      
      // Get team performance totals
      const teamTotals = await TeamMember.aggregate([
        { $match: { isActive: true } },
        { 
          $group: { 
            _id: null,
            totalLeadsAssigned: { $sum: '$performance.leadsAssigned' },
            totalActiveLeads: { $sum: '$performance.activeLeads' },
            totalSales: { $sum: '$performance.totalSales' },
            totalCurrentMonthSales: { $sum: '$performance.currentMonthSales' }
          } 
        }
      ]);
      
      const totals = teamTotals[0] || {
        totalLeadsAssigned: 0,
        totalActiveLeads: 0,
        totalSales: 0,
        totalCurrentMonthSales: 0
      };
      
      return successResponse(res, 200, 'Team analytics retrieved successfully', {
        totalMembers,
        roleDistribution,
        statusDistribution,
        topPerformers,
        teamTotals: totals
      });
    } catch (error) {
      return errorResponse(res, 500, 'Error retrieving team analytics');
    }
  })
);

module.exports = router;
