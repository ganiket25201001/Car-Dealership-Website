require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./models');

const debugUserFind = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leadflow_pro');
    console.log('✅ Connected to MongoDB');
    
    const email = 'admin@leadflow.com';
    
    console.log('🔍 Debug User Find:');
    console.log('   Looking for email:', email);
    
    // Try different find queries
    console.log('\n1️⃣ Find without isActive filter...');
    const user1 = await User.findOne({ email: email.toLowerCase() }).select('+password');
    console.log('   Result:', user1 ? `Found: ${user1.name} (${user1.email})` : 'Not found');
    if (user1) {
      console.log('   isActive:', user1.isActive);
      console.log('   password exists:', !!user1.password);
    }
    
    console.log('\n2️⃣ Find with isActive: true...');
    const user2 = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password');
    console.log('   Result:', user2 ? `Found: ${user2.name} (${user2.email})` : 'Not found');
    
    console.log('\n3️⃣ Find with isActive: { $ne: false }...');
    const user3 = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: { $ne: false }
    }).select('+password');
    console.log('   Result:', user3 ? `Found: ${user3.name} (${user3.email})` : 'Not found');
    
    console.log('\n4️⃣ Find all users with this email (any isActive value)...');
    const allUsers = await User.find({ email: email.toLowerCase() }).select('+password');
    console.log('   Count:', allUsers.length);
    allUsers.forEach((user, index) => {
      console.log(`   User ${index + 1}:`, {
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        hasPassword: !!user.password
      });
    });
    
    console.log('\n5️⃣ List ALL users in database...');
    const allUsersInDB = await User.find({});
    console.log('   Total users:', allUsersInDB.length);
    allUsersInDB.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - Active: ${user.isActive}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

debugUserFind();