require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

const debugLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leadflow_pro');
    console.log('✅ Connected to MongoDB');
    
    const email = 'admin@leadflow.com';
    const password = 'admin123';
    
    console.log('🔍 Debug Login Process:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    
    // Step 1: Find user
    console.log('\n1️⃣ Finding user...');
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('✅ User found:');
    console.log('   ID:', user._id);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   IsActive:', user.isActive);
    console.log('   Password hash length:', user.password ? user.password.length : 'NO PASSWORD');
    
    // Step 2: Test password comparison
    console.log('\n2️⃣ Testing password comparison...');
    
    if (!user.password) {
      console.log('❌ User has no password set!');
      process.exit(1);
    }
    
    // Test direct bcrypt comparison
    console.log('   Testing direct bcrypt.compare...');
    const directCompare = await bcrypt.compare(password, user.password);
    console.log('   Direct bcrypt result:', directCompare);
    
    // Test user method
    console.log('   Testing user.comparePassword method...');
    const methodCompare = await user.comparePassword(password);
    console.log('   Method result:', methodCompare);
    
    // Test with different password
    console.log('   Testing with wrong password...');
    const wrongCompare = await user.comparePassword('wrongpassword');
    console.log('   Wrong password result:', wrongCompare);
    
    if (directCompare && methodCompare) {
      console.log('\n✅ PASSWORD COMPARISON WORKS!');
    } else {
      console.log('\n❌ PASSWORD COMPARISON FAILED!');
      
      // Let's try to rehash and compare
      console.log('\n🔧 Testing fresh hash...');
      const freshHash = await bcrypt.hash(password, 10);
      const freshCompare = await bcrypt.compare(password, freshHash);
      console.log('   Fresh hash works:', freshCompare);
      
      // Update user with fresh hash
      console.log('   Updating user with fresh hash...');
      await User.findByIdAndUpdate(user._id, { password: freshHash });
      console.log('   ✅ Password updated with fresh hash');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

debugLogin();