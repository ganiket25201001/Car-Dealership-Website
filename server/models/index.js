const mongoose = require('mongoose');

// Lead Model
const Lead = require('./Lead');

// Team Member Model  
const TeamMember = require('./TeamMember');

// User Model
const User = require('./User');

module.exports = {
  Lead,
  TeamMember,
  User,
  mongoose
};