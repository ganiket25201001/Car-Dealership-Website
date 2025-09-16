// API Test Script
const testAPI = async () => {
  try {
    console.log('🔍 Testing API endpoints...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health endpoint:', JSON.stringify(healthData, null, 2));
    } else {
      console.error('❌ Health endpoint failed:', healthResponse.status);
    }
    
    // Test leads endpoint
    const leadsResponse = await fetch('http://localhost:5000/api/v1/leads');
    if (leadsResponse.ok) {
      const leadsData = await leadsResponse.json();
      console.log(`✅ Leads endpoint: Found ${leadsData.data?.length || 0} leads`);
      if (leadsData.data?.length > 0) {
        console.log('   First lead:', leadsData.data[0].name);
      }
    } else {
      console.error('❌ Leads endpoint failed:', leadsResponse.status);
    }
    
    // Test team members endpoint
    const teamResponse = await fetch('http://localhost:5000/api/v1/team-members');
    if (teamResponse.ok) {
      const teamData = await teamResponse.json();
      console.log(`✅ Team members endpoint: Found ${teamData.data?.length || 0} members`);
      if (teamData.data?.length > 0) {
        console.log('   First member:', teamData.data[0].name);
      }
    } else {
      console.error('❌ Team members endpoint failed:', teamResponse.status);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

testAPI();