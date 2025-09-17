const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Import models
const { Group, User } = require('../models');

// Import middleware
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware');
const { protect, requireAdmin, requireLeader, canManageGroup } = require('../middleware/authMiddleware');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation failed', errors.array());
  }
  next();
};

// @desc    Create group (Admin only)
// @route   POST /api/v1/groups
// @access  Private (Admin only)
router.post('/',
  protect,
  requireAdmin,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Group name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Group name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot be more than 500 characters'),
    body('leaderId')
      .notEmpty()
      .withMessage('Leader ID is required')
      .isMongoId()
      .withMessage('Invalid leader ID'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const { name, description, leaderId } = req.body;

      // Verify that the leader exists and has the correct role
      const leader = await User.findById(leaderId);
      if (!leader) {
        return errorResponse(res, 404, 'Leader not found');
      }

      if (leader.role !== 'leader') {
        return errorResponse(res, 400, 'Selected user must have leader role');
      }

      // Check if group name already exists
      const existingGroup = await Group.findOne({ name });
      if (existingGroup) {
        return errorResponse(res, 400, 'Group with this name already exists');
      }

      // Create group
      const group = await Group.create({
        name,
        description,
        leader: leaderId,
        createdBy: req.user._id
      });

      // Update leader's group
      leader.group = group._id;
      await leader.save();

      const populatedGroup = await Group.findById(group._id)
        .populate('leader', 'name email')
        .populate('createdBy', 'name email');

      successResponse(res, 201, 'Group created successfully', { group: populatedGroup });
    } catch (error) {
      console.error('Group creation error:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return errorResponse(res, 400, 'Validation error', messages);
      }
      return errorResponse(res, 500, 'Server error during group creation');
    }
  })
);

// @desc    Get all groups
// @route   GET /api/v1/groups
// @access  Private (Admin can see all, Leaders see their own)
router.get('/',
  protect,
  asyncHandler(async (req, res) => {
    try {
      let query = {};

      // Leaders can only see their own group
      if (req.user.role === 'leader') {
        query.leader = req.user._id;
      }

      const groups = await Group.find(query)
        .populate('leader', 'name email tags')
        .populate('createdBy', 'name email')
        .populate('members.user', 'name email')
        .populate('members.addedBy', 'name email')
        .sort({ createdAt: -1 });

      successResponse(res, 200, 'Groups retrieved successfully', { groups });
    } catch (error) {
      console.error('Groups fetch error:', error);
      return errorResponse(res, 500, 'Error retrieving groups');
    }
  })
);

// @desc    Get single group
// @route   GET /api/v1/groups/:id
// @access  Private
router.get('/:id',
  protect,
  asyncHandler(async (req, res) => {
    try {
      const group = await Group.findById(req.params.id)
        .populate('leader', 'name email tags')
        .populate('createdBy', 'name email')
        .populate('members.user', 'name email role')
        .populate('members.addedBy', 'name email');

      if (!group) {
        return errorResponse(res, 404, 'Group not found');
      }

      // Check permissions
      if (req.user.role !== 'admin' && group.leader.toString() !== req.user._id.toString()) {
        return errorResponse(res, 403, 'Access denied. You can only view your own group.');
      }

      successResponse(res, 200, 'Group retrieved successfully', { group });
    } catch (error) {
      console.error('Group fetch error:', error);
      return errorResponse(res, 500, 'Error retrieving group');
    }
  })
);

// @desc    Add member to group (Admin or Group Leader)
// @route   POST /api/v1/groups/:id/members
// @access  Private (Admin or Group Leader)
router.post('/:id/members',
  protect,
  canManageGroup,
  [
    body('userId')
      .notEmpty()
      .withMessage('User ID is required')
      .isMongoId()
      .withMessage('Invalid user ID'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const { userId } = req.body;
      const groupId = req.params.id;

      const group = await Group.findById(groupId);
      if (!group) {
        return errorResponse(res, 404, 'Group not found');
      }

      // Check if user making request can manage this group
      if (req.user.role !== 'admin' && group.leader.toString() !== req.user._id.toString()) {
        return errorResponse(res, 403, 'Access denied. You can only manage your own group.');
      }

      // Check if user exists and has correct role
      const user = await User.findById(userId);
      if (!user) {
        return errorResponse(res, 404, 'User not found');
      }

      if (user.role !== 'user') {
        return errorResponse(res, 400, 'Only users with "user" role can be added to groups');
      }

      // Check if user is already in this group
      const existingMember = group.members.find(member => 
        member.user.toString() === userId
      );

      if (existingMember) {
        return errorResponse(res, 400, 'User is already a member of this group');
      }

      // Add member to group
      await group.addMember(userId, req.user._id);

      // Update user's group reference
      user.group = groupId;
      await user.save();

      const updatedGroup = await Group.findById(groupId)
        .populate('leader', 'name email')
        .populate('members.user', 'name email role')
        .populate('members.addedBy', 'name email');

      successResponse(res, 200, 'Member added to group successfully', { group: updatedGroup });
    } catch (error) {
      console.error('Add member error:', error);
      return errorResponse(res, 500, 'Error adding member to group');
    }
  })
);

// @desc    Remove member from group (Admin or Group Leader)
// @route   DELETE /api/v1/groups/:id/members/:userId
// @access  Private (Admin or Group Leader)
router.delete('/:id/members/:userId',
  protect,
  canManageGroup,
  asyncHandler(async (req, res) => {
    try {
      const { id: groupId, userId } = req.params;

      const group = await Group.findById(groupId);
      if (!group) {
        return errorResponse(res, 404, 'Group not found');
      }

      // Check if user making request can manage this group
      if (req.user.role !== 'admin' && group.leader.toString() !== req.user._id.toString()) {
        return errorResponse(res, 403, 'Access denied. You can only manage your own group.');
      }

      // Remove member from group
      await group.removeMember(userId);

      // Update user's group reference
      const user = await User.findById(userId);
      if (user) {
        user.group = null;
        await user.save();
      }

      const updatedGroup = await Group.findById(groupId)
        .populate('leader', 'name email')
        .populate('members.user', 'name email role')
        .populate('members.addedBy', 'name email');

      successResponse(res, 200, 'Member removed from group successfully', { group: updatedGroup });
    } catch (error) {
      console.error('Remove member error:', error);
      return errorResponse(res, 500, 'Error removing member from group');
    }
  })
);

// @desc    Update group (Admin only)
// @route   PUT /api/v1/groups/:id
// @access  Private (Admin only)
router.put('/:id',
  protect,
  requireAdmin,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Group name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot be more than 500 characters'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const { name, description } = req.body;

      const group = await Group.findById(req.params.id);
      if (!group) {
        return errorResponse(res, 404, 'Group not found');
      }

      // Check if new name conflicts with existing group
      if (name && name !== group.name) {
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
          return errorResponse(res, 400, 'Group with this name already exists');
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;

      const updatedGroup = await Group.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      )
      .populate('leader', 'name email')
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email role')
      .populate('members.addedBy', 'name email');

      successResponse(res, 200, 'Group updated successfully', { group: updatedGroup });
    } catch (error) {
      console.error('Group update error:', error);
      return errorResponse(res, 500, 'Error updating group');
    }
  })
);

// @desc    Delete group (Admin only)
// @route   DELETE /api/v1/groups/:id
// @access  Private (Admin only)
router.delete('/:id',
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const group = await Group.findById(req.params.id);
      if (!group) {
        return errorResponse(res, 404, 'Group not found');
      }

      // Remove group reference from all members
      await User.updateMany(
        { group: req.params.id },
        { $unset: { group: 1 } }
      );

      // Delete the group
      await Group.findByIdAndDelete(req.params.id);

      successResponse(res, 200, 'Group deleted successfully');
    } catch (error) {
      console.error('Group delete error:', error);
      return errorResponse(res, 500, 'Error deleting group');
    }
  })
);

module.exports = router;