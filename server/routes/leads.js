const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const router = express.Router();

// Import models
const { Lead, TeamMember } = require('../models');

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
const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot be more than 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('source')
    .isIn(['website', 'facebook', 'google', 'twitter', 'referral', 'walk-in', 'phone', 'email', 'other'])
    .withMessage('Invalid source'),
  body('vehicleInterest.type')
    .optional()
    .isIn(['sedan', 'suv', 'hatchback', 'luxury', 'sports', 'commercial', 'other'])
    .withMessage('Invalid vehicle type'),
  body('vehicleInterest.budget.min')
    .optional()
    .isNumeric()
    .withMessage('Budget min must be a number'),
  body('vehicleInterest.budget.max')
    .optional()
    .isNumeric()
    .withMessage('Budget max must be a number'),
  handleValidationErrors
];

const updateLeadValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot be more than 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'])
    .withMessage('Invalid status'),
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  handleValidationErrors
];

// @desc    Get all leads
// @route   GET /api/v1/leads
// @access  Private
router.get('/', 
  protect,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { isActive: true };
    
    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Assigned filter
    if (req.query.assignedTo) {
      if (req.query.assignedTo === 'unassigned') {
        filter.assignedTo = null;
      } else {
        filter.assignedTo = req.query.assignedTo;
      }
    }
    
    // Source filter
    if (req.query.source) {
      filter.source = req.query.source;
    }
    
    // Score range filter
    if (req.query.minScore || req.query.maxScore) {
      filter.score = {};
      if (req.query.minScore) filter.score.$gte = parseInt(req.query.minScore);
      if (req.query.maxScore) filter.score.$lte = parseInt(req.query.maxScore);
    }
    
    // Date range filter
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) filter.createdAt.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) filter.createdAt.$lte = new Date(req.query.dateTo);
    }
    
    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { notes: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // User access control - non-managers can only see their assigned leads
    if (req.user.role !== 'Sales Manager' && req.user.role !== 'Admin') {
      filter.assignedTo = req.user._id;
    }
    
    // Sort options
    let sortBy = { createdAt: -1 }; // Default sort by newest
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortBy = { [sortField]: sortOrder };
    }
    
    try {
      // Get leads with pagination
      const leads = await Lead.find(filter)
        .populate('assignedTo', 'name email role')
        .populate('interactions.performedBy', 'name')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Get total count for pagination
      const total = await Lead.countDocuments(filter);
      
      // Calculate pagination info
      const pages = Math.ceil(total / limit);
      const hasNext = page < pages;
      const hasPrev = page > 1;
      
      return successResponse(res, 200, 'Leads retrieved successfully', leads, {
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
      return errorResponse(res, 500, 'Error retrieving leads');
    }
  })
);

// @desc    Get single lead
// @route   GET /api/v1/leads/:id
// @access  Private
router.get('/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid lead ID'), handleValidationErrors],
  asyncHandler(async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id)
        .populate('assignedTo', 'name email role phone')
        .populate('interactions.performedBy', 'name email')
        .populate('nextFollowUp.assignedTo', 'name email');
      
      if (!lead) {
        return errorResponse(res, 404, 'Lead not found');
      }
      
      // Check access permissions
      if (req.user.role !== 'Sales Manager' && 
          req.user.role !== 'Admin' && 
          lead.assignedTo && 
          lead.assignedTo._id.toString() !== req.user._id.toString()) {
        return errorResponse(res, 403, 'Access denied');
      }
      
      return successResponse(res, 200, 'Lead retrieved successfully', lead);
    } catch (error) {
      return errorResponse(res, 500, 'Error retrieving lead');
    }
  })
);

// @desc    Create new lead
// @route   POST /api/v1/leads
// @access  Private
router.post('/',
  protect,
  checkPermission('canCreateLeads'),
  createLeadValidation,
  asyncHandler(async (req, res) => {
    try {
      // Check for duplicate email
      const existingLead = await Lead.findOne({ 
        email: req.body.email, 
        isActive: true 
      });
      
      if (existingLead) {
        return errorResponse(res, 400, 'Lead with this email already exists');
      }
      
      // Create lead with user as creator
      const leadData = {
        ...req.body,
        assignedTo: req.body.assignedTo || req.user._id
      };
      
      const lead = await Lead.create(leadData);
      
      // Populate the response
      await lead.populate('assignedTo', 'name email role');
      
      // Update team member's lead count
      if (lead.assignedTo) {
        await TeamMember.findByIdAndUpdate(
          lead.assignedTo._id,
          { $inc: { 'performance.leadsAssigned': 1, 'performance.activeLeads': 1 } }
        );
      }
      
      return successResponse(res, 201, 'Lead created successfully', lead);
    } catch (error) {
      if (error.code === 11000) {
        return errorResponse(res, 400, 'Lead with this email already exists');
      }
      return errorResponse(res, 500, 'Error creating lead');
    }
  })
);

// @desc    Update lead
// @route   PUT /api/v1/leads/:id
// @access  Private
router.put('/:id',
  protect,
  updateLeadValidation,
  asyncHandler(async (req, res) => {
    try {
      let lead = await Lead.findById(req.params.id);
      
      if (!lead) {
        return errorResponse(res, 404, 'Lead not found');
      }
      
      // Check access permissions
      if (req.user.role !== 'Sales Manager' && 
          req.user.role !== 'Admin' && 
          lead.assignedTo && 
          lead.assignedTo.toString() !== req.user._id.toString()) {
        return errorResponse(res, 403, 'Access denied');
      }
      
      // Track assignment changes
      const oldAssignedTo = lead.assignedTo;
      const newAssignedTo = req.body.assignedTo;
      
      // Update lead
      lead = await Lead.findByIdAndUpdate(
        req.params.id,
        { ...req.body, lastContact: new Date() },
        { new: true, runValidators: true }
      ).populate('assignedTo', 'name email role');
      
      // Update team member counts if assignment changed
      if (oldAssignedTo && newAssignedTo && oldAssignedTo.toString() !== newAssignedTo.toString()) {
        // Decrease count for old assignee
        await TeamMember.findByIdAndUpdate(
          oldAssignedTo,
          { $inc: { 'performance.activeLeads': -1 } }
        );
        
        // Increase count for new assignee
        await TeamMember.findByIdAndUpdate(
          newAssignedTo,
          { $inc: { 'performance.activeLeads': 1 } }
        );
      }
      
      return successResponse(res, 200, 'Lead updated successfully', lead);
    } catch (error) {
      return errorResponse(res, 500, 'Error updating lead');
    }
  })
);

// @desc    Delete lead (soft delete)
// @route   DELETE /api/v1/leads/:id
// @access  Private
router.delete('/:id',
  protect,
  checkPermission('canDeleteLeads'),
  [param('id').isMongoId().withMessage('Invalid lead ID'), handleValidationErrors],
  asyncHandler(async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id);
      
      if (!lead) {
        return errorResponse(res, 404, 'Lead not found');
      }
      
      // Soft delete
      await Lead.findByIdAndUpdate(req.params.id, { isActive: false });
      
      // Update assigned team member's count
      if (lead.assignedTo) {
        await TeamMember.findByIdAndUpdate(
          lead.assignedTo,
          { $inc: { 'performance.activeLeads': -1 } }
        );
      }
      
      return successResponse(res, 200, 'Lead deleted successfully');
    } catch (error) {
      return errorResponse(res, 500, 'Error deleting lead');
    }
  })
);

// @desc    Add interaction to lead
// @route   POST /api/v1/leads/:id/interactions
// @access  Private
router.post('/:id/interactions',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid lead ID'),
    body('type')
      .isIn(['call', 'email', 'meeting', 'sms', 'visit', 'other'])
      .withMessage('Invalid interaction type'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 500 })
      .withMessage('Description cannot be more than 500 characters'),
    body('outcome')
      .optional()
      .isIn(['positive', 'negative', 'neutral'])
      .withMessage('Invalid outcome'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id);
      
      if (!lead) {
        return errorResponse(res, 404, 'Lead not found');
      }
      
      // Add interaction
      const interaction = {
        type: req.body.type,
        description: req.body.description,
        performedBy: req.user._id,
        outcome: req.body.outcome || 'neutral',
        date: new Date()
      };
      
      lead.interactions.push(interaction);
      lead.lastContact = new Date();
      
      // Recalculate score after adding interaction
      await lead.save();
      
      // Populate the response
      await lead.populate('interactions.performedBy', 'name email');
      
      const addedInteraction = lead.interactions[lead.interactions.length - 1];
      
      return successResponse(res, 201, 'Interaction added successfully', addedInteraction);
    } catch (error) {
      return errorResponse(res, 500, 'Error adding interaction');
    }
  })
);

// @desc    Update lead status
// @route   PATCH /api/v1/leads/:id/status
// @access  Private
router.patch('/:id/status',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid lead ID'),
    body('status')
      .isIn(['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'])
      .withMessage('Invalid status'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id);
      
      if (!lead) {
        return errorResponse(res, 404, 'Lead not found');
      }
      
      const oldStatus = lead.status;
      const newStatus = req.body.status;
      
      // Update status
      lead.status = newStatus;
      lead.lastContact = new Date();
      
      // If converting to sale, set conversion date and sale value
      if (newStatus === 'converted' && oldStatus !== 'converted') {
        lead.conversionDate = new Date();
        if (req.body.saleValue) {
          lead.saleValue = req.body.saleValue;
        }
        
        // Update team member's conversion stats
        if (lead.assignedTo) {
          await TeamMember.findByIdAndUpdate(
            lead.assignedTo,
            { 
              $inc: { 
                'performance.currentMonthSales': 1,
                'performance.totalSales': 1
              } 
            }
          );
        }
      }
      
      await lead.save();
      
      return successResponse(res, 200, 'Lead status updated successfully', { 
        leadId: lead._id,
        oldStatus,
        newStatus,
        updatedAt: lead.updatedAt
      });
    } catch (error) {
      return errorResponse(res, 500, 'Error updating lead status');
    }
  })
);

// @desc    Get leads by status (for Kanban)
// @route   GET /api/v1/leads/status/:status
// @access  Private
router.get('/status/:status',
  protect,
  [
    param('status')
      .isIn(['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'])
      .withMessage('Invalid status'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const filter = { 
        status: req.params.status,
        isActive: true 
      };
      
      // User access control
      if (req.user.role !== 'Sales Manager' && req.user.role !== 'Admin') {
        filter.assignedTo = req.user._id;
      }
      
      const leads = await Lead.find(filter)
        .populate('assignedTo', 'name email')
        .sort({ score: -1, createdAt: -1 })
        .lean();
      
      return successResponse(res, 200, `${req.params.status} leads retrieved successfully`, leads);
    } catch (error) {
      return errorResponse(res, 500, 'Error retrieving leads by status');
    }
  })
);

// @desc    Bulk update leads
// @route   PATCH /api/v1/leads/bulk
// @access  Private
router.patch('/bulk',
  protect,
  authorize('Sales Manager', 'Admin'),
  [
    body('leadIds')
      .isArray({ min: 1 })
      .withMessage('Lead IDs array is required'),
    body('leadIds.*')
      .isMongoId()
      .withMessage('Invalid lead ID format'),
    body('updates')
      .isObject()
      .withMessage('Updates object is required'),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    try {
      const { leadIds, updates } = req.body;
      
      // Remove fields that shouldn't be bulk updated
      delete updates._id;
      delete updates.createdAt;
      delete updates.updatedAt;
      
      // Add lastContact timestamp
      updates.lastContact = new Date();
      
      const result = await Lead.updateMany(
        { _id: { $in: leadIds }, isActive: true },
        { $set: updates }
      );
      
      return successResponse(res, 200, `${result.modifiedCount} leads updated successfully`, {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      return errorResponse(res, 500, 'Error bulk updating leads');
    }
  })
);

// @desc    Get lead analytics
// @route   GET /api/v1/leads/analytics
// @access  Private
router.get('/analytics/summary',
  protect,
  asyncHandler(async (req, res) => {
    try {
      const filter = { isActive: true };
      
      // User access control
      if (req.user.role !== 'Sales Manager' && req.user.role !== 'Admin') {
        filter.assignedTo = req.user._id;
      }
      
      // Get counts by status
      const statusCounts = await Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      
      // Get counts by source
      const sourceCounts = await Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$source', count: { $sum: 1 } } }
      ]);
      
      // Get conversion rate
      const totalLeads = await Lead.countDocuments(filter);
      const convertedLeads = await Lead.countDocuments({ ...filter, status: 'converted' });
      const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0;
      
      // Get average score
      const avgScoreResult = await Lead.aggregate([
        { $match: filter },
        { $group: { _id: null, avgScore: { $avg: '$score' } } }
      ]);
      const avgScore = avgScoreResult[0]?.avgScore || 0;
      
      // Get leads created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const leadsToday = await Lead.countDocuments({
        ...filter,
        createdAt: { $gte: today }
      });
      
      return successResponse(res, 200, 'Lead analytics retrieved successfully', {
        total: totalLeads,
        statusCounts,
        sourceCounts,
        conversionRate: parseFloat(conversionRate),
        avgScore: Math.round(avgScore),
        leadsToday
      });
    } catch (error) {
      return errorResponse(res, 500, 'Error retrieving lead analytics');
    }
  })
);

module.exports = router;
