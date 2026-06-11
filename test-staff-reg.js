// Simple test for staff registration
const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL('http://localhost:4000' + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  console.log('Test 1: Register Staff with phone 9876543211');
  let res = await makeRequest('POST', '/api/auth/register', {
    name: 'Staff Test',
    phone: '9876543211',
    password: 'staff123',
    role: 'staff',
  });
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(res.data, null, 2));

  console.log('\nTest 2: Register Staff with phone 9111111112');
  res = await makeRequest('POST', '/api/auth/register', {
    name: 'Staff Test 2',
    phone: '9111111112',
    password: 'staff123',
    role: 'staff',
  });
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(res.data, null, 2));

  console.log('\nTest 3: List all users (for debugging)');
  const mongoose = require('mongoose');
  mongoose.connect('mongodb+srv://siddheshtripathi2005_db_user:F5DWdeTswRePAIMY@cluster0.dwychrg.mongodb.net/?appName=Cluster0')
    .then(() => {
      return mongoose.connection.collection('users').find({}).toArray();
    })
    .then(users => {
      console.log('Users in DB:', JSON.stringify(users, null, 2));
      process.exit(0);
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

test().catch(console.error);
