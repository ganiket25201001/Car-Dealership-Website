const express = require('express');
const router = express.Router();

// Import models
const { User, Group, Lead } = require('../models');

// Import middleware
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// @desc    Get all users (Admin only)
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
router.get('/users',
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 25;
      const startIndex = (page - 1) * limit;
      
      // Build query
      let query = User.find({ isActive: true });
      
      // Apply filters
      if (req.query.role) {
        query = query.find({ role: req.query.role });
      }
      
      // Apply search
      if (req.query.search) {
        query = query.find({
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        });
      }
      
      // Execute query
      const users = await query
        .select('-password')
        .populate('group', 'name description')
        .populate('createdBy', 'name email')
        .limit(limit * 1)
        .skip(startIndex)
        .sort({ createdAt: -1 });
      
      const total = await User.countDocuments(query.getQuery());
      
      // Pagination
      const pagination = {};
      
      if (startIndex + limit < total) {
        pagination.next = {
          page: page + 1,
          limit
        };
      }
      
      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        };
      }
      
      successResponse(res, 200, 'Users retrieved successfully', {
        users,
        pagination: {
          ...pagination,
          current: page,
          total: Math.ceil(total / limit),
          count: users.length,
          totalUsers: total
        }
      });
    } catch (error) {
      console.error('Admin users fetch error:', error);
      return errorResponse(res, 500, 'Error retrieving users');
    }
  })
);

// @desc    Get user statistics (Admin only)
// @route   GET /api/v1/admin/stats
// @access  Private (Admin only)
router.get('/stats',
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const totalUsers = await User.countDocuments({ isActive: true });
      const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });
      const totalLeaders = await User.countDocuments({ role: 'leader', isActive: true });
      const totalRegularUsers = await User.countDocuments({ role: 'user', isActive: true });
      const totalGroups = await Group.countDocuments({ isActive: true });
      const totalLeads = await Lead.countDocuments();
      
      // Recent users (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentUsers = await User.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo },
        isActive: true 
      });
      
      // Active users (logged in within last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const activeUsers = await User.countDocuments({ 
        lastActivity: { $gte: sevenDaysAgo },
        isActive: true 
      });

      successResponse(res, 200, 'Statistics retrieved successfully', {
        stats: {
          users: {
            total: totalUsers,
            admins: totalAdmins,
            leaders: totalLeaders,
            regular: totalRegularUsers,
            recent: recentUsers,
            active: activeUsers
          },
          groups: {
            total: totalGroups
          },
          leads: {
            total: totalLeads
          }
        }
      });
    } catch (error) {
      console.error('Admin stats error:', error);
      return errorResponse(res, 500, 'Error retrieving statistics');
    }
  })
);

// @desc    Delete user (Admin only)
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin only)
router.delete('/users/:id',
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return errorResponse(res, 404, 'User not found');
      }

      // Prevent admin from deleting themselves
      if (user._id.toString() === req.user._id.toString()) {
        return errorResponse(res, 400, 'You cannot delete your own account');
      }

      // Soft delete - mark as inactive
      user.isActive = false;
      await user.save();

      // Remove from any groups
      await Group.updateMany(
        { 'members.user': req.params.id },
        { $pull: { members: { user: req.params.id } } }
      );

      // If user is a group leader, we might want to handle that differently
      // For now, we'll just mark them inactive
      
      successResponse(res, 200, 'User deleted successfully');
    } catch (error) {
      console.error('Admin delete user error:', error);
      return errorResponse(res, 500, 'Error deleting user');
    }
  })
);

// @desc    Update user status (Admin only)
// @route   PUT /api/v1/admin/users/:id/status
// @access  Private (Admin only)
router.put('/users/:id/status',
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const { isActive } = req.body;
      
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return errorResponse(res, 404, 'User not found');
      }

      // Prevent admin from deactivating themselves
      if (user._id.toString() === req.user._id.toString()) {
        return errorResponse(res, 400, 'You cannot change your own account status');
      }

      user.isActive = isActive;
      await user.save();

      const updatedUser = await User.findById(req.params.id)
        .select('-password')
        .populate('group', 'name description')
        .populate('createdBy', 'name email');
      
      successResponse(res, 200, 'User status updated successfully', { user: updatedUser });
    } catch (error) {
      console.error('Admin update user status error:', error);
      return errorResponse(res, 500, 'Error updating user status');
    }
  })
);

module.exports = router;