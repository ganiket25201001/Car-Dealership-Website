const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team member name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in query results by default
  },
  role: {
    type: String,
    enum: ['Sales Executive', 'Senior Sales', 'Sales Manager', 'Team Lead', 'Admin'],
    required: [true, 'Role is required']
  },
  department: {
    type: String,
    enum: ['Sales', 'Marketing', 'Service', 'Management'],
    default: 'Sales'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave', 'terminated'],
    default: 'active'
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  profile: {
    avatar: {
      type: String, // URL to avatar image
      default: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=Avatar'
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    specializations: [{
      type: String,
      enum: ['luxury', 'commercial', 'family', 'sports', 'electric', 'financing', 'trade-in']
    }],
    languages: [{
      type: String,
      trim: true
    }],
    location: {
      type: String,
      trim: true
    }
  },
  performance: {
    monthlyTarget: {
      type: Number,
      min: [0, 'Monthly target cannot be negative'],
      default: 10
    },
    currentMonthSales: {
      type: Number,
      min: [0, 'Current month sales cannot be negative'],
      default: 0
    },
    totalSales: {
      type: Number,
      min: [0, 'Total sales cannot be negative'],
      default: 0
    },
    conversionRate: {
      type: Number,
      min: [0, 'Conversion rate cannot be negative'],
      max: [100, 'Conversion rate cannot be more than 100'],
      default: 0
    },
    averageResponseTime: {
      type: Number, // in minutes
      min: [0, 'Response time cannot be negative'],
      default: 0
    },
    customerSatisfaction: {
      type: Number,
      min: [0, 'Satisfaction score cannot be negative'],
      max: [5, 'Satisfaction score cannot be more than 5'],
      default: 0
    },
    leadsAssigned: {
      type: Number,
      min: [0, 'Leads assigned cannot be negative'],
      default: 0
    },
    activeLeads: {
      type: Number,
      min: [0, 'Active leads cannot be negative'],
      default: 0
    }
  },
  workingHours: {
    start: {
      type: String,
      default: '09:00',
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
    },
    end: {
      type: String,
      default: '18:00',
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  permissions: {
    canCreateLeads: {
      type: Boolean,
      default: true
    },
    canEditAllLeads: {
      type: Boolean,
      default: false
    },
    canDeleteLeads: {
      type: Boolean,
      default: false
    },
    canViewReports: {
      type: Boolean,
      default: true
    },
    canManageTeam: {
      type: Boolean,
      default: false
    },
    canExportData: {
      type: Boolean,
      default: false
    }
  },
  lastLogin: {
    type: Date
  },
  loginHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
teamMemberSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for performance percentage
teamMemberSchema.virtual('performancePercentage').get(function() {
  if (this.performance.monthlyTarget > 0) {
    return Math.round((this.performance.currentMonthSales / this.performance.monthlyTarget) * 100);
  }
  return 0;
});

// Virtual for experience in months
teamMemberSchema.virtual('experienceMonths').get(function() {
  const now = new Date();
  const join = new Date(this.joinDate);
  return Math.floor((now - join) / (1000 * 60 * 60 * 24 * 30));
});

// Indexes
teamMemberSchema.index({ email: 1 }, { unique: true });
teamMemberSchema.index({ employeeId: 1 }, { unique: true });
teamMemberSchema.index({ role: 1 });
teamMemberSchema.index({ status: 1 });
teamMemberSchema.index({ availability: 1 });
teamMemberSchema.index({ department: 1 });
teamMemberSchema.index({ 'performance.conversionRate': -1 });
teamMemberSchema.index({ 'performance.currentMonthSales': -1 });
teamMemberSchema.index({ lastLogin: -1 });

// Text search index
teamMemberSchema.index({
  name: 'text',
  email: 'text',
  'profile.bio': 'text'
});

// Pre-save middleware to hash password
teamMemberSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
teamMemberSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate reset password token
teamMemberSchema.methods.getResetPasswordToken = function() {
  const resetToken = require('crypto').randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

// Static method to find available team members
teamMemberSchema.statics.findAvailable = function() {
  return this.find({ 
    status: 'active',
    availability: 'available',
    isActive: true 
  });
};

// Static method to find team members by role
teamMemberSchema.statics.findByRole = function(role) {
  return this.find({ 
    role,
    status: 'active',
    isActive: true 
  });
};

// Static method to get top performers
teamMemberSchema.statics.getTopPerformers = function(limit = 5) {
  return this.find({ 
    status: 'active',
    isActive: true 
  })
  .sort({ 'performance.conversionRate': -1, 'performance.currentMonthSales': -1 })
  .limit(limit);
};

// Method to update performance metrics
teamMemberSchema.methods.updatePerformance = function(metrics) {
  Object.keys(metrics).forEach(key => {
    if (this.performance[key] !== undefined) {
      this.performance[key] = metrics[key];
    }
  });
  return this.save();
};

// Method to log login
teamMemberSchema.methods.logLogin = function(ipAddress, userAgent) {
  this.lastLogin = new Date();
  this.loginHistory.push({
    date: new Date(),
    ipAddress,
    userAgent
  });
  
  // Keep only last 10 login records
  if (this.loginHistory.length > 10) {
    this.loginHistory = this.loginHistory.slice(-10);
  }
  
  return this.save();
};

module.exports = mongoose.model('TeamMember', teamMemberSchema);