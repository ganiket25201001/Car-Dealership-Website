require('dotenv').config();
const mongoose = require('mongoose');
const { Lead, TeamMember } = require('./models');

async function checkDatabase() {
  try {
    console.log('🔍 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connected successfully');
    console.log('🌐 Connected to:', process.env.MONGO_URI);
    
    // Get database stats
    const stats = await mongoose.connection.db.stats();
    console.log('\n📊 Database Statistics:');
    console.log(`   Database: ${stats.db}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Documents: ${stats.objects}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections Found:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Count documents
    const leadCount = await Lead.countDocuments();
    const teamMemberCount = await TeamMember.countDocuments();
    
    console.log('\n📋 Document Counts:');
    console.log(`   👥 Team Members: ${teamMemberCount}`);
    console.log(`   🎯 Leads: ${leadCount}`);
    
    // Check lead status distribution
    const leadStatusCounts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📈 Lead Status Distribution:');
    leadStatusCounts.forEach(status => 
      console.log(`   ${status._id}: ${status.count} leads`)
    );
    
    // Check team member roles
    const teamRoles = await TeamMember.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n👔 Team Member Roles:');
    teamRoles.forEach(role => 
      console.log(`   ${role._id}: ${role.count} members`)
    );
    
    console.log('\n✅ Database check completed successfully!');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔚 Database connection closed');
  }
}

checkDatabase();