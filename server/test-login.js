require('dotenv').config();
const fetch = require('node-fetch');

const testLogin = async () => {
  try {
    console.log('🧪 Testing login API directly...');
    
    const loginData = {
      email: 'admin@leadflow.com',
      password: 'admin123'
    };
    
    console.log('📤 Sending login request to http://localhost:5000/api/v1/auth/login');
    console.log('   Email:', loginData.email);
    console.log('   Password:', loginData.password);
    
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    console.log('\n📥 Response Status:', response.status);
    console.log('   Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('\n📄 Response Body:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Login SUCCESS!');
      console.log('   User:', data.data.user.name);
      console.log('   Email:', data.data.user.email);
      console.log('   Role:', data.data.user.role);
      console.log('   Token length:', data.data.token.length);
    } else {
      console.log('❌ Login FAILED!');
      try {
        const errorData = JSON.parse(responseText);
        console.log('   Error Message:', errorData.message);
      } catch (e) {
        console.log('   Raw Error:', responseText);
      }
    }
    
  } catch (error) {
    console.error('💥 Request failed:', error.message);
  }
};

testLogin();