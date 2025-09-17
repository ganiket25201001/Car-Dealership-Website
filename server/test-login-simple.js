require('dotenv').config();
const https = require('https');
const http = require('http');

const testLogin = async () => {
  try {
    console.log('🧪 Testing login API directly...');
    
    const loginData = JSON.stringify({
      email: 'admin@leadflow.com',
      password: 'admin123'
    });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };
    
    console.log('📤 Sending login request to http://localhost:5000/api/v1/auth/login');
    console.log('   Email: admin@leadflow.com');
    console.log('   Password: admin123');
    
    const req = http.request(options, (res) => {
      console.log('\n📥 Response Status:', res.statusCode);
      console.log('   Response Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\n📄 Response Body:', data);
        
        if (res.statusCode === 200) {
          try {
            const responseData = JSON.parse(data);
            console.log('✅ Login SUCCESS!');
            console.log('   User:', responseData.data.user.name);
            console.log('   Email:', responseData.data.user.email);
            console.log('   Role:', responseData.data.user.role);
            console.log('   Token length:', responseData.data.token.length);
          } catch (e) {
            console.log('📄 Response parsing error:', e.message);
          }
        } else {
          console.log('❌ Login FAILED!');
          try {
            const errorData = JSON.parse(data);
            console.log('   Error Message:', errorData.message);
          } catch (e) {
            console.log('   Raw Error:', data);
          }
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('💥 Request failed:', error.message);
    });
    
    req.write(loginData);
    req.end();
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
};

testLogin();