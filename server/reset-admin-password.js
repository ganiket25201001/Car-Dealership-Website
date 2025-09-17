require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leadflow_pro');
    console.log('✅ Connected to MongoDB');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@leadflow.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found with email: admin@leadflow.com');
      process.exit(1);
    }
    
    console.log(`👤 Found admin user: ${adminUser.name} (${adminUser.email})`);
    
    // Hash new password
    const newPassword = 'admin123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await User.findByIdAndUpdate(adminUser._id, { 
      password: hashedPassword 
    });
    
    console.log('✅ Password updated successfully!');
    console.log('📝 New login credentials:');
    console.log('   Email: admin@leadflow.com');
    console.log('   Password: admin123');
    
    // Verify the password works
    const updatedUser = await User.findById(adminUser._id).select('+password');
    const isValid = await bcrypt.compare(newPassword, updatedUser.password);
    
    if (isValid) {
      console.log('✅ Password verification successful - login should work now!');
    } else {
      console.log('❌ Password verification failed - something went wrong');
    }
    
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

resetAdminPassword();