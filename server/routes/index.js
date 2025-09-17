const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const leadRoutes = require('./leads');
const teamRoutes = require('./team');
const groupRoutes = require('./groups');
const adminRoutes = require('./admin');
const userRoutes = require('./users');

// Import middleware
const { protect } = require('../middleware/authMiddleware');
const { asyncHandler, successResponse } = require('../middleware/errorMiddleware');

// Mount routers
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/team', teamRoutes);
router.use('/groups', groupRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

// @desc    API Health Check
// @route   GET /api/v1/health
// @access  Public
router.get('/health',
  asyncHandler(async (req, res) => {
    return successResponse(res, 200, 'API is healthy', {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  })
);

// @desc    Get API Information
// @route   GET /api/v1/info
// @access  Private
router.get('/info',
  protect,
  asyncHandler(async (req, res) => {
    return successResponse(res, 200, 'API information retrieved', {
      name: 'LeadFlow Pro API',
      version: '1.0.0',
      description: 'HSR Motors Lead Management System API',
      endpoints: {
        auth: {
          base: '/api/v1/auth',
          routes: [
            'POST /register - Register new user',
            'POST /login - User login',
            'GET /me - Get current user profile',
            'PUT /me - Update user profile',
            'PUT /updatepassword - Update password',
            'GET /logout - Logout user',
            'POST /forgotpassword - Forgot password',
            'PUT /resetpassword/:token - Reset password',
            'GET /check - Check authentication status'
          ]
        },
        leads: {
          base: '/api/v1/leads',
          routes: [
            'GET / - Get all leads',
            'POST / - Create new lead',
            'GET /:id - Get single lead',
            'PUT /:id - Update lead',
            'DELETE /:id - Delete lead',
            'POST /:id/interactions - Add interaction',
            'PATCH /:id/status - Update lead status',
            'GET /status/:status - Get leads by status',
            'PATCH /bulk - Bulk update leads',
            'GET /analytics/summary - Lead analytics'
          ]
        },
        team: {
          base: '/api/v1/team',
          routes: [
            'GET / - Get all team members',
            'POST / - Create team member',
            'GET /:id - Get single team member',
            'PUT /:id - Update team member',
            'DELETE /:id - Delete team member',
            'PUT /:id/password - Change password',
            'PATCH /:id/status - Update member status',
            'GET /:id/performance - Get performance data',
            'GET /analytics/summary - Team analytics'
          ]
        }
      },
      features: [
        'JWT Authentication',
        'Role-based Access Control',
        'Lead Management with Scoring',
        'Team Member Management',
        'Performance Analytics',
        'Interaction Tracking',
        'Bulk Operations',
        'Advanced Filtering & Search',
        'Comprehensive Error Handling',
        'Rate Limiting'
      ]
    });
  })
);

module.exports = router;