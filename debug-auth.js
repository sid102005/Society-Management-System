const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:4000/api';
const JWT_SECRET = 'society_management_secret_key_2026';

// Generate test token
const testToken = jwt.sign(
  { id: 'test-user-123', role: 'staff', flat: 'A101' },
  JWT_SECRET,
  { expiresIn: '7d' }
);

console.log('🔧 DEBUG TEST\n');
console.log(`Generated Token:\n${testToken}\n`);

async function testEndpoint() {
  try {
    console.log('📤 Sending request to GET /api/package');
    console.log(`   Authorization: Bearer ${testToken.substring(0, 30)}...`);
    
    const response = await axios.get(`${BASE_URL}/package`, {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    console.log(`\n✅ Success! Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}`);
  } catch (err) {
    if (err.response) {
      console.log(`\n❌ Error Status: ${err.response.status}`);
      console.log(`   Response: ${JSON.stringify(err.response.data)}`);
      console.log(`\n   Request Headers Sent:`);
      console.log(`   ${JSON.stringify(err.config.headers, null, 2)}`);
    } else {
      console.log(`\n❌ Error: ${err.message}`);
    }
  }
}

testEndpoint().then(() => {
  console.log('\n\n🔍 Testing direct token verification:');
  try {
    const decoded = jwt.verify(testToken, JWT_SECRET);
    console.log(`✅ Token is valid:`, decoded);
  } catch (err) {
    console.log(`❌ Token verification failed:`, err.message);
  }
});
