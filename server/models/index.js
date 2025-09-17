const mongoose = require('mongoose');

// Lead Model
const Lead = require('./Lead');

// Team Member Model  
const TeamMember = require('./TeamMember');

// User Model
const User = require('./User');

// Group Model
const Group = require('./Group');

module.exports = {
  Lead,
  TeamMember,
  User,
  Group,
  mongoose
};