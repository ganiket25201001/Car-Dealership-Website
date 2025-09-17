const express = require('express');
const router = express.Router();

// Import models
const { User } = require('../models');

// Import middleware
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware');
const { protect, requireLeader } = require('../middleware/authMiddleware');

// @desc    Get users (for group management, etc.)
// @route   GET /api/v1/users
// @access  Private (Leaders and Admins)
router.get('/',
  protect,
  requireLeader, // Both admin and leader can access this
  asyncHandler(async (req, res) => {
    try {
      let query = { isActive: true };
      
      // Apply role filter if specified
      if (req.query.role) {
        query.role = req.query.role;
      }
      
      // Apply search if specified
      if (req.query.search) {
        query.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ];
      }
      
      const users = await User.find(query)
        .select('name email role group createdAt')
        .populate('group', 'name')
        .sort({ name: 1 });
      
      successResponse(res, 200, 'Users retrieved successfully', { users });
    } catch (error) {
      console.error('Users fetch error:', error);
      return errorResponse(res, 500, 'Error retrieving users');
    }
  })
);

module.exports = router;