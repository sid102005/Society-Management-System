// Comprehensive Debug Test for All APIs
const http = require('http');

const BASE_URL = 'http://localhost:4000';
let authToken = '';
let adminToken = '';
let userId = '';
let adminId = '';

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
            headers: res.headers,
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, raw: true });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('\n========== AUTH SETUP ==========\n');

  // Step 1: Register Admin with unique phone
  const adminPhone = `9876543210`;
  console.log(`1. Registering Admin with phone: ${adminPhone}`);
  let res = await makeRequest('POST', '/api/auth/register', {
    name: 'Debug Admin',
    phone: adminPhone,
    password: 'admin123',
    role: 'admin',
  });
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));
  adminId = res.data?.userId || res.data?.data?.userId;

  // Step 2: Login Admin
  console.log(`\n2. Logging in Admin`);
  res = await makeRequest('POST', '/api/auth/login', {
    phone: adminPhone,
    password: 'admin123',
  });
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));
  adminToken = res.data?.token;

  // Step 3: Register Staff with unique phone
  const staffPhone = '9876543211';
  console.log(`\n3. Registering Staff with phone: ${staffPhone}`);
  res = await makeRequest('POST', '/api/auth/register', {
    name: 'Debug Staff',
    phone: staffPhone,
    password: 'staff123',
    role: 'staff',
  });
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));
  userId = res.data?.userId || res.data?.data?.userId;

  // Step 4: Login Staff
  console.log(`\n4. Logging in Staff`);
  res = await makeRequest('POST', '/api/auth/login', {
    phone: staffPhone,
    password: 'staff123',
  });
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));
  authToken = res.data?.token;

  if (!authToken || !adminToken) {
    console.error('\n❌ Failed to get auth tokens. Stopping tests.');
    return;
  }

  console.log('\n========== TESTING VISITOR ENDPOINTS ==========\n');

  // Test Visitor Endpoints
  console.log('1. Create Visitor (No Auth Required)');
  res = await makeRequest('POST', '/api/visitor', {
    name: 'John Visitor',
    phone: '9999999999',
    flatToVisit: '101',
    vehicleNumber: 'TEST001',
  });
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));
  const visitorId = res.data?.data?._id;

  console.log('\n2. List Visitors (Auth Required)');
  res = await makeRequest('GET', '/api/visitor', null, authToken);
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n3. Mark Visitor Exit');
  if (visitorId) {
    res = await makeRequest(
      'POST',
      `/api/visitor/${visitorId}/exit`,
      { staffId: userId },
      authToken
    );
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:`, JSON.stringify(res.data, null, 2));
  }

  console.log('\n========== TESTING DELIVERY ENDPOINTS ==========\n');

  console.log('1. Record Delivery Entry');
  res = await makeRequest(
    'POST',
    '/api/delivery',
    {
      parcelId: 'PKG123',
      courierName: 'FedEx',
      recipientFlat: '101',
      description: 'Test package',
    },
    authToken
  );
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));
  const deliveryId = res.data?.data?._id;

  console.log('\n2. List Deliveries');
  res = await makeRequest('GET', '/api/delivery', null, authToken);
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n========== TESTING COMPLAINT ENDPOINTS ==========\n');

  console.log('1. Create Complaint');
  res = await makeRequest(
    'POST',
    '/api/complaint',
    {
      title: 'Noise Issue',
      description: 'Neighbors making noise late night',
      category: 'noise',
      severity: 'medium',
      flat: '101',
    },
    authToken
  );
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));
  const complaintId = res.data?.data?._id;

  console.log('\n2. View Complaints');
  res = await makeRequest('GET', '/api/complaint/my-complaints', null, authToken);
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n========== TESTING ATTENDANCE ENDPOINTS ==========\n');

  console.log('1. Check In');
  res = await makeRequest('POST', '/api/attendance/check-in', {}, authToken);
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n2. View My Attendance');
  res = await makeRequest('GET', '/api/attendance/my-attendance', null, authToken);
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n========== TESTING LEAVE ENDPOINTS ==========\n');

  console.log('1. Apply for Leave');
  res = await makeRequest(
    'POST',
    '/api/leave/apply',
    {
      leaveType: 'casual',
      startDate: '2026-06-10',
      endDate: '2026-06-12',
      reason: 'Personal work',
    },
    authToken
  );
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n2. View My Leaves');
  res = await makeRequest('GET', '/api/leave/my-leaves', null, authToken);
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n========== TESTING NOTICE ENDPOINTS ==========\n');

  console.log('1. Create Notice (Admin Only)');
  res = await makeRequest(
    'POST',
    '/api/notice',
    {
      title: 'Maintenance Notice',
      content: 'Building maintenance on Monday',
      priority: 'high',
    },
    adminToken
  );
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n2. View Notices');
  res = await makeRequest('GET', '/api/notice', null, authToken);
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n========== TESTING VEHICLE ENDPOINTS ==========\n');

  console.log('1. Register Vehicle');
  res = await makeRequest(
    'POST',
    '/api/vehicle/register',
    {
      vehicleNumber: 'MH01AB1234',
      type: 'car',
      model: 'Honda City',
      color: 'White',
    },
    authToken
  );
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n2. Get My Vehicles');
  res = await makeRequest('GET', '/api/vehicle/my-vehicles', null, authToken);
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, JSON.stringify(res.data, null, 2));

  console.log('\n✅ Debug test completed');
}

runTests().catch(console.error);
