require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./models');

const checkUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leadflow_pro');
    console.log('✅ Connected to MongoDB');
    
    // Check total users
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    if (userCount === 0) {
      console.log('❌ No users found in database. You need to run setup.');
      process.exit(0);
    }
    
    // Get all users
    const users = await User.find({}, 'name email role createdAt isActive');
    
    console.log('\n👥 Users in database:');
    console.log('=====================================');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive !== false ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('-----------------------------------');
    });
    
    // Check for admin users
    const adminUsers = users.filter(u => u.role === 'admin');
    console.log(`\n🔑 Admin users found: ${adminUsers.length}`);
    
    if (adminUsers.length > 0) {
      console.log('\n💡 Try logging in with one of these admin accounts:');
      adminUsers.forEach(admin => {
        console.log(`   Email: ${admin.email}`);
        console.log(`   (Password should be what you set during creation)`);
      });
    }
    
    console.log('\n🛠️  To reset/clean database:');
    console.log('   1. In MongoDB shell: use leadflow_pro');
    console.log('   2. Drop users: db.users.deleteMany({})');
    console.log('   3. Drop groups: db.groups.deleteMany({})');
    console.log('   4. Drop leads: db.leads.deleteMany({})');
    console.log('   5. Then use setup mode on login page');
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

checkUsers();