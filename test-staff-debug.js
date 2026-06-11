// Debug staff registration issue
const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL('http://localhost:4000' + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: { 'Content-Type': 'application/json' },
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
  console.log('Test: Register multiple staff users');
  
  for (let i = 1; i <= 3; i++) {
    const phone = `987654321${i}`;
    console.log(`\n${i}. Registering staff with phone: ${phone}`);
    const res = await makeRequest('POST', '/api/auth/register', {
      name: `Staff ${i}`,
      phone: phone,
      password: 'staff123',
      role: 'staff',
    });
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:`, JSON.stringify(res.data, null, 2));
  }
  
  process.exit(0);
}

test().catch(console.error);
