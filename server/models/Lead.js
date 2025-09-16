const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
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
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'],
    default: 'new',
    required: true
  },
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot be more than 100'],
    default: 0
  },
  source: {
    type: String,
    enum: ['website', 'facebook', 'google', 'twitter', 'referral', 'walk-in', 'phone', 'email', 'other'],
    required: [true, 'Lead source is required']
  },
  vehicleInterest: {
    type: {
      type: String,
      enum: ['sedan', 'suv', 'hatchback', 'luxury', 'sports', 'commercial', 'other'],
      required: true
    },
    brand: {
      type: String,
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    budget: {
      min: {
        type: Number,
        min: [0, 'Budget cannot be negative']
      },
      max: {
        type: Number,
        min: [0, 'Budget cannot be negative']
      }
    },
    financingRequired: {
      type: Boolean,
      default: false
    },
    tradeIn: {
      type: Boolean,
      default: false
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot be more than 50 characters']
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot be more than 2000 characters']
  },
  interactions: [{
    type: {
      type: String,
      enum: ['call', 'email', 'meeting', 'sms', 'visit', 'other'],
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Interaction description cannot be more than 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true
    },
    outcome: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral'
    }
  }],
  nextFollowUp: {
    date: {
      type: Date
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Follow-up description cannot be more than 200 characters']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember'
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  lastContact: {
    type: Date,
    default: Date.now
  },
  conversionDate: {
    type: Date
  },
  saleValue: {
    type: Number,
    min: [0, 'Sale value cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    }
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for lead age
leadSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for interaction count
leadSchema.virtual('interactionCount').get(function() {
  return this.interactions.length;
});

// Indexes for better performance
leadSchema.index({ email: 1 }, { unique: true });
leadSchema.index({ phone: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ score: -1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ lastContact: -1 });
leadSchema.index({ 'nextFollowUp.date': 1 });

// Compound indexes
leadSchema.index({ status: 1, assignedTo: 1 });
leadSchema.index({ source: 1, status: 1 });
leadSchema.index({ score: -1, status: 1 });

// Text search index
leadSchema.index({
  name: 'text',
  email: 'text',
  notes: 'text',
  'vehicleInterest.brand': 'text',
  'vehicleInterest.model': 'text'
});

// Pre-save middleware to update score based on interactions
leadSchema.pre('save', function(next) {
  if (this.isModified('interactions') || this.isNew) {
    this.calculateScore();
  }
  next();
});

// Method to calculate lead score
leadSchema.methods.calculateScore = function() {
  let score = 0;
  
  // Base score based on vehicle interest
  if (this.vehicleInterest) {
    score += 20;
    if (this.vehicleInterest.budget && this.vehicleInterest.budget.max) {
      if (this.vehicleInterest.budget.max > 500000) score += 20;
      else if (this.vehicleInterest.budget.max > 200000) score += 15;
      else score += 10;
    }
  }
  
  // Interaction score
  const positiveInteractions = this.interactions.filter(i => i.outcome === 'positive').length;
  score += Math.min(positiveInteractions * 10, 30);
  
  // Recent activity boost
  const daysSinceLastContact = Math.floor((Date.now() - this.lastContact) / (1000 * 60 * 60 * 24));
  if (daysSinceLastContact <= 1) score += 15;
  else if (daysSinceLastContact <= 3) score += 10;
  else if (daysSinceLastContact <= 7) score += 5;
  
  // Source quality
  const highQualitySources = ['referral', 'website'];
  if (highQualitySources.includes(this.source)) score += 10;
  
  // Financing and trade-in interest
  if (this.vehicleInterest?.financingRequired) score += 5;
  if (this.vehicleInterest?.tradeIn) score += 5;
  
  this.score = Math.min(score, 100);
};

// Static method to get leads by status
leadSchema.statics.findByStatus = function(status) {
  return this.find({ status, isActive: true });
};

// Static method to get high priority leads
leadSchema.statics.findHighPriority = function() {
  return this.find({ 
    score: { $gte: 70 }, 
    isActive: true 
  }).sort({ score: -1 });
};

// Static method to get leads requiring follow-up
leadSchema.statics.findRequiringFollowUp = function() {
  return this.find({
    'nextFollowUp.date': { $lte: new Date() },
    status: { $nin: ['converted', 'lost'] },
    isActive: true
  }).populate('assignedTo nextFollowUp.assignedTo');
};

module.exports = mongoose.model('Lead', leadSchema);