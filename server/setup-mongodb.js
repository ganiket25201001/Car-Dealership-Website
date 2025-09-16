const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const { Lead, TeamMember, User } = require('./models');

// Sample data
const sampleTeamMembers = [
  {
    name: 'Admin User',
    email: 'admin@hsrmotors.com',
    password: 'Admin123!',
    role: 'Admin',
    department: 'Management',
    phone: '+91-9876543210',
    status: 'active'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@hsrmotors.com',
    password: 'Password123!',
    role: 'Sales Manager',
    department: 'Sales',
    phone: '+91-9876543211',
    status: 'active'
  },
  {
    name: 'Mike Wilson',
    email: 'mike.wilson@hsrmotors.com',
    password: 'Password123!',
    role: 'Sales Representative',
    department: 'Sales',
    phone: '+91-9876543212',
    status: 'active'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@hsrmotors.com',
    password: 'Password123!',
    role: 'Sales Representative',
    department: 'Sales',
    phone: '+91-9876543213',
    status: 'active'
  },
  {
    name: 'James Smith',
    email: 'james.smith@hsrmotors.com',
    password: 'Password123!',
    role: 'Sales Representative',
    department: 'Sales',
    phone: '+91-9876543214',
    status: 'active'
  }
];

const sampleLeads = [
  {
    name: 'John Anderson',
    email: 'john.anderson@gmail.com',
    phone: '+91-9876543001',
    source: 'website',
    status: 'new',
    vehicleInterest: {
      type: 'sedan',
      budget: { min: 800000, max: 1200000 },
      timeline: 'within_month',
      features: ['automatic', 'fuel_efficient', 'spacious']
    },
    notes: 'Interested in fuel-efficient sedan for family use',
    priority: 'medium'
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@gmail.com',
    phone: '+91-9876543002',
    source: 'facebook',
    status: 'contacted',
    vehicleInterest: {
      type: 'suv',
      budget: { min: 1500000, max: 2500000 },
      timeline: 'within_3_months',
      features: ['4wd', 'luxury', 'safety']
    },
    notes: 'Looking for premium SUV, price sensitive',
    priority: 'high',
    interactions: [
      {
        type: 'call',
        description: 'Initial contact call - showed interest in premium SUV models',
        outcome: 'positive',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ]
  },
  {
    name: 'David Kim',
    email: 'david.kim@gmail.com',
    phone: '+91-9876543003',
    source: 'google',
    status: 'qualified',
    vehicleInterest: {
      type: 'hatchback',
      budget: { min: 600000, max: 900000 },
      timeline: 'within_month',
      features: ['compact', 'fuel_efficient', 'easy_parking']
    },
    notes: 'First-time buyer, needs guidance on financing options',
    priority: 'medium',
    interactions: [
      {
        type: 'email',
        description: 'Sent brochure and financing information',
        outcome: 'positive',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'meeting',
        description: 'Test drive scheduled and completed',
        outcome: 'positive',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    name: 'Lisa Chen',
    email: 'lisa.chen@gmail.com',
    phone: '+91-9876543004',
    source: 'referral',
    status: 'negotiating',
    vehicleInterest: {
      type: 'luxury',
      budget: { min: 3000000, max: 5000000 },
      timeline: 'within_month',
      features: ['luxury', 'performance', 'technology']
    },
    notes: 'High-value client, referred by existing customer',
    priority: 'high',
    interactions: [
      {
        type: 'meeting',
        description: 'Initial consultation and vehicle showcase',
        outcome: 'positive',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'call',
        description: 'Price negotiation discussion',
        outcome: 'neutral',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    name: 'Robert Taylor',
    email: 'robert.taylor@gmail.com',
    phone: '+91-9876543005',
    source: 'walk-in',
    status: 'new',
    vehicleInterest: {
      type: 'commercial',
      budget: { min: 1200000, max: 2000000 },
      timeline: 'within_3_months',
      features: ['cargo_space', 'fuel_efficient', 'durable']
    },
    notes: 'Small business owner looking for delivery vehicle',
    priority: 'medium'
  },
  {
    name: 'Jennifer Walsh',
    email: 'jennifer.walsh@gmail.com',
    phone: '+91-9876543006',
    source: 'website',
    status: 'contacted',
    vehicleInterest: {
      type: 'sports',
      budget: { min: 2500000, max: 4000000 },
      timeline: 'within_6_months',
      features: ['performance', 'style', 'technology']
    },
    notes: 'Enthusiast looking for high-performance vehicle',
    priority: 'high',
    interactions: [
      {
        type: 'email',
        description: 'Sent sports car catalog and specifications',
        outcome: 'positive',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@gmail.com',
    phone: '+91-9876543007',
    source: 'phone',
    status: 'converted',
    vehicleInterest: {
      type: 'sedan',
      budget: { min: 1000000, max: 1500000 },
      timeline: 'immediate',
      features: ['reliable', 'comfortable', 'fuel_efficient']
    },
    notes: 'Completed purchase of mid-range sedan',
    priority: 'low',
    conversionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    saleValue: 1250000,
    interactions: [
      {
        type: 'call',
        description: 'Initial inquiry about sedan models',
        outcome: 'positive',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'meeting',
        description: 'Showroom visit and test drive',
        outcome: 'positive',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'meeting',
        description: 'Final paperwork and vehicle delivery',
        outcome: 'positive',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    name: 'Amanda Foster',
    email: 'amanda.foster@gmail.com',
    phone: '+91-9876543008',
    source: 'twitter',
    status: 'lost',
    vehicleInterest: {
      type: 'suv',
      budget: { min: 1800000, max: 2500000 },
      timeline: 'within_month',
      features: ['spacious', 'safety', 'comfort']
    },
    notes: 'Lost to competitor due to better financing offer',
    priority: 'low',
    interactions: [
      {
        type: 'call',
        description: 'Follow-up call after social media inquiry',
        outcome: 'positive',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'email',
        description: 'Sent competitive offer',
        outcome: 'neutral',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'call',
        description: 'Final attempt to retain customer',
        outcome: 'negative',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await TeamMember.deleteMany();
    await Lead.deleteMany();
    await User.deleteMany();
    console.log('🗑️  Existing data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    throw error;
  }
};

// Seed team members
const seedTeamMembers = async () => {
  try {
    const createdMembers = await TeamMember.create(sampleTeamMembers);
    console.log('👥 Team members seeded:', createdMembers.length);
    return createdMembers;
  } catch (error) {
    console.error('❌ Error seeding team members:', error.message);
    throw error;
  }
};

// Seed leads
const seedLeads = async (teamMembers) => {
  try {
    // Assign leads to team members (excluding admin)
    const salesMembers = teamMembers.filter(member => 
      member.role === 'Sales Representative' || member.role === 'Sales Manager'
    );
    
    const leadsWithAssignment = sampleLeads.map((lead, index) => ({
      ...lead,
      assignedTo: salesMembers[index % salesMembers.length]._id
    }));
    
    // Add interactions with team member references
    leadsWithAssignment.forEach(lead => {
      if (lead.interactions) {
        lead.interactions = lead.interactions.map(interaction => ({
          ...interaction,
          performedBy: lead.assignedTo
        }));
      }
    });
    
    const createdLeads = await Lead.create(leadsWithAssignment);
    console.log('🎯 Leads seeded:', createdLeads.length);
    
    // Update team member performance stats
    for (const member of salesMembers) {
      const memberLeads = createdLeads.filter(lead => 
        lead.assignedTo.toString() === member._id.toString()
      );
      
      const convertedLeads = memberLeads.filter(lead => lead.status === 'converted');
      const activeLeads = memberLeads.filter(lead => 
        lead.status !== 'converted' && lead.status !== 'lost'
      );
      
      await TeamMember.findByIdAndUpdate(member._id, {
        'performance.leadsAssigned': memberLeads.length,
        'performance.activeLeads': activeLeads.length,
        'performance.currentMonthSales': convertedLeads.length,
        'performance.totalSales': convertedLeads.length
      });
    }
    
    console.log('📊 Team member performance updated');
    return createdLeads;
  } catch (error) {
    console.error('❌ Error seeding leads:', error.message);
    throw error;
  }
};

// Main seeding function
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await clearData();
    
    const teamMembers = await seedTeamMembers();
    const leads = await seedLeads(teamMembers);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   👥 Team Members: ${teamMembers.length}`);
    console.log(`   🎯 Leads: ${leads.length}`);
    
    console.log('\n🔐 Default Login Credentials:');
    console.log('   Admin: admin@hsrmotors.com / Admin123!');
    console.log('   Manager: sarah.johnson@hsrmotors.com / Password123!');
    console.log('   Sales Rep: mike.wilson@hsrmotors.com / Password123!');
    
    console.log('\n📊 Data Distribution:');
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} leads`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📖 MongoDB Setup Script for LeadFlow Pro

Usage: node setup-mongodb.js [options]

Options:
  --help, -h     Show this help message
  --clear, -c    Clear existing data only (no seeding)
  --force, -f    Force seed even in production

Environment Variables Required:
  MONGO_URI      MongoDB connection string

Examples:
  node setup-mongodb.js          # Full setup with sample data
  node setup-mongodb.js --clear  # Clear data only
  node setup-mongodb.js --force  # Force seed in production
  `);
  process.exit(0);
}

if (args.includes('--clear') || args.includes('-c')) {
  connectDB()
    .then(clearData)
    .then(() => {
      console.log('✅ Data cleared successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Clear failed:', error.message);
      process.exit(1);
    });
} else {
  // Check for production environment
  if (process.env.NODE_ENV === 'production' && !args.includes('--force')) {
    console.log('⚠️  Production environment detected. Use --force to seed in production.');
    process.exit(0);
  }
  
  // Run full seeding
  seedData();
}