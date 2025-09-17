require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./models');

const debugIsActiveType = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leadflow_pro');
    console.log('✅ Connected to MongoDB');
    
    console.log('🔍 Debug isActive field type:');
    
    const user = await User.findOne({ email: 'admin@leadflow.com' });
    
    console.log('User found:', !!user);
    if (user) {
      console.log('isActive value:', user.isActive);
      console.log('isActive type:', typeof user.isActive);
      console.log('isActive === true:', user.isActive === true);
      console.log('isActive == true:', user.isActive == true);
      console.log('Boolean(isActive):', Boolean(user.isActive));
      
      // Let's fix it by explicitly setting it to boolean true
      console.log('\n🔧 Setting isActive to explicit boolean true...');
      await User.findByIdAndUpdate(user._id, { isActive: true });
      
      // Test again
      console.log('\n🧪 Testing query again...');
      const testUser = await User.findOne({ 
        email: 'admin@leadflow.com',
        isActive: true 
      }).select('+password');
      
      console.log('Query with isActive: true works now:', !!testUser);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

debugIsActiveType();