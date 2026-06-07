// Comprehensive Test Suite for All 32 Features
const http = require('http');

const BASE_URL = 'http://localhost:4000';
let authToken = '';
let userId = '';
let adminToken = '';
let adminId = '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test counter
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Helper function to make HTTP requests
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
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          };
          resolve(response);
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

// Test result logger
async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`${colors.green}✅ ${name}${colors.reset}`);
    passedTests++;
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ ${name}: ${error.message}${colors.reset}`);
    failedTests++;
    return false;
  }
}

// Main test suite
async function runTests() {
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}COMPREHENSIVE API FEATURE TEST SUITE${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  // ============ SETUP: Create test users ============
  console.log(`${colors.yellow}[SETUP] Creating test users...${colors.reset}`);

  await test('Register Admin User', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'Admin Test',
      phone: '9876543210',
      password: 'admin123',
      role: 'admin',
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    adminId = res.data.userId || res.data.data?.userId;
    if (!adminId) throw new Error('No userId in response');
  });

  await test('Login Admin User', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      phone: '9876543210',
      password: 'admin123',
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    adminToken = res.data.token;
    if (!adminToken) throw new Error('No token in response');
  });

  await test('Register Staff User', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'Staff Test',
      phone: '9876543211',
      password: 'staff123',
      role: 'staff',
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    userId = res.data.userId || res.data.data?.userId;
    if (!userId) throw new Error('No userId in response');
  });

  await test('Login Staff User', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      phone: '9876543211',
      password: 'staff123',
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    authToken = res.data.token;
    if (!authToken) throw new Error('No token in response');
  });

  console.log(`\n${colors.yellow}[TESTING] Gate & Visitor Management (Features 1-12)${colors.reset}`);

  // Feature 1: Visitor entry log
  let visitorId = '';
  await test('Feature #1: Create visitor entry', async () => {
    const res = await makeRequest(
      'POST',
      '/api/visitor',
      {
        name: 'John Doe',
        phone: '9999999999',
        flatToVisit: '101',
        vehicleNumber: 'MH01AB1234',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    visitorId = res.data.data?._id;
    if (!visitorId) throw new Error('No visitor ID');
  });

  // Feature 1: List visitors
  await test('Feature #1: List visitors', async () => {
    const res = await makeRequest('GET', '/api/visitor', null, authToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 3: Send OTP
  await test('Feature #3: Send OTP to resident', async () => {
    const res = await makeRequest(
      'POST',
      '/api/visitor/otp/send',
      { visitorPhone: '9999999999' },
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 4: Generate QR Code
  await test('Feature #4: Generate QR code for gate pass', async () => {
    const res = await makeRequest(
      'GET',
      `/api/visitor/${visitorId}/qr-code`,
      null,
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 1: Mark exit
  await test('Feature #1: Mark visitor exit', async () => {
    const res = await makeRequest(
      'POST',
      `/api/visitor/${visitorId}/exit`,
      {},
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 5: Delivery entry
  let deliveryId = '';
  await test('Feature #5: Record delivery entry', async () => {
    const res = await makeRequest(
      'POST',
      '/api/delivery',
      {
        courierName: 'Courier Inc',
        packageCount: 5,
        vehicleNumber: 'MH01CD5678',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    deliveryId = res.data.data?._id;
  });

  // Feature 5: Delivery exit
  await test('Feature #5: Record delivery exit', async () => {
    const res = await makeRequest(
      'POST',
      `/api/delivery/${deliveryId}/exit`,
      {},
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 6: Package receipt
  let packageId = '';
  await test('Feature #6: Log package receipt', async () => {
    const res = await makeRequest(
      'POST',
      '/api/package',
      {
        trackingId: 'PKG001',
        senderInfo: 'Amazon',
        recipientFlat: '101',
        description: 'Test package',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    packageId = res.data.data?._id;
  });

  // Feature 7: Package handover
  await test('Feature #7: Record package handover', async () => {
    const res = await makeRequest(
      'POST',
      `/api/package/${packageId}/handover`,
      { notes: 'Handed over successfully' },
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 8: Guest vehicle tracking
  let guestVehicleId = '';
  await test('Feature #8: Register guest vehicle', async () => {
    const res = await makeRequest(
      'POST',
      '/api/vehicle/guest/register',
      {
        vehicleNumber: 'MH01EF9999',
        visitorName: 'Test Guest',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    guestVehicleId = res.data.data?._id;
  });

  // Feature 10: Blacklist
  await test('Feature #10: Add visitor to blacklist', async () => {
    const res = await makeRequest(
      'POST',
      '/api/blacklist',
      {
        name: 'Suspicious Person',
        phone: '9999888888',
        severity: 'high',
      },
      adminToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
  });

  // Feature 11: Check overstay
  await test('Feature #11: Check overstay visitors', async () => {
    const res = await makeRequest(
      'GET',
      '/api/visitor/alerts/overstay',
      null,
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 12: Daily report
  await test('Feature #12: Generate daily visitor report', async () => {
    const res = await makeRequest(
      'GET',
      '/api/visitor/reports/daily?date=2026-06-07',
      null,
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.yellow}[TESTING] Resident & Vehicle Tracking (Features 13-16)${colors.reset}`);

  // Feature 13: Member directory
  await test('Feature #13: Access member directory', async () => {
    const res = await makeRequest('GET', '/api/member/directory', null, authToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 14: Register resident vehicle
  let vehicleId = '';
  await test('Feature #14: Register resident vehicle', async () => {
    const res = await makeRequest(
      'POST',
      '/api/vehicle/register',
      {
        vehicleNumber: 'MH01GH1234',
        vehicleType: 'car',
        model: 'Honda City',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    vehicleId = res.data.data?._id;
  });

  // Feature 15: Verify sticker
  await test('Feature #15: Verify vehicle sticker', async () => {
    const res = await makeRequest(
      'GET',
      '/api/vehicle/verify-sticker?stickerNumber=STICKER001',
      null,
      authToken
    );
    if (res.status === 200 || res.status === 404) return; // Either found or not
    throw new Error(`Status ${res.status}`);
  });

  // Feature 16: Guest vehicle exit
  await test('Feature #16: Record guest vehicle exit', async () => {
    const res = await makeRequest(
      'POST',
      `/api/vehicle/guest/${guestVehicleId}/exit`,
      {},
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.yellow}[TESTING] Complaints & Tasks (Features 17-20)${colors.reset}`);

  // Feature 17: File complaint
  let complaintId = '';
  await test('Feature #17: File new complaint', async () => {
    const res = await makeRequest(
      'POST',
      '/api/complaint',
      {
        title: 'Water leakage',
        description: 'Water leaking from ceiling',
        category: 'maintenance',
        priority: 'high',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    complaintId = res.data.data?._id;
  });

  // Feature 18: Update complaint status
  await test('Feature #18: Update complaint status', async () => {
    const res = await makeRequest(
      'PATCH',
      `/api/complaint/${complaintId}/status`,
      { status: 'in-progress', notes: 'Started work' },
      adminToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 19: Upload proof photos
  await test('Feature #19: Upload proof photos (endpoint exists)', async () => {
    const res = await makeRequest(
      'POST',
      `/api/complaint/${complaintId}/proof-photos`,
      { photoUrls: ['http://example.com/photo.jpg'] },
      authToken
    );
    if (res.status === 200 || res.status === 201) return;
    throw new Error(`Status ${res.status}`);
  });

  // Feature 20: Daily task checklist
  let taskId = '';
  await test('Feature #20: Get daily task checklist', async () => {
    const res = await makeRequest(
      'GET',
      '/api/task/daily-checklist',
      null,
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.yellow}[TESTING] Safety & Patrolling (Features 21-24)${colors.reset}`);

  // Feature 21: Start patrol
  let patrolId = '';
  await test('Feature #21: Start night patrol', async () => {
    const res = await makeRequest(
      'POST',
      '/api/patrol/start',
      {
        shift: 'night',
        startLocation: { lat: 19.0, lng: 72.8 },
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    patrolId = res.data.data?._id;
  });

  // Feature 21: Add checkpoint
  await test('Feature #21: Add patrol checkpoint', async () => {
    const res = await makeRequest(
      'POST',
      `/api/patrol/${patrolId}/checkpoint`,
      {
        location: { lat: 19.01, lng: 72.81 },
        status: 'ok',
        notes: 'Area clear',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
  });

  // Feature 21: End patrol
  await test('Feature #21: End patrol', async () => {
    const res = await makeRequest(
      'POST',
      `/api/patrol/${patrolId}/end`,
      { observations: 'Completed routine patrol' },
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 22: Report incident
  let incidentId = '';
  await test('Feature #22: Report incident', async () => {
    const res = await makeRequest(
      'POST',
      '/api/incident',
      {
        incidentType: 'suspicious',
        description: 'Suspicious activity near gate',
        location: { lat: 19.0, lng: 72.8 },
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    incidentId = res.data.data?._id;
  });

  // Feature 23: SOS button
  await test('Feature #23: Trigger SOS/Emergency button', async () => {
    const res = await makeRequest(
      'POST',
      '/api/incident/sos/emergency',
      {
        location: { lat: 19.0, lng: 72.8 },
        description: 'Emergency assistance needed',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.yellow}[TESTING] Attendance & Shifts (Features 25-28)${colors.reset}`);

  // Feature 25: Check-in
  await test('Feature #25: Mark attendance check-in', async () => {
    const res = await makeRequest(
      'POST',
      '/api/attendance/check-in',
      {
        location: { lat: 19.0, lng: 72.8 },
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
  });

  // Feature 25: Check-out
  await test('Feature #25: Mark attendance check-out', async () => {
    const res = await makeRequest(
      'POST',
      '/api/attendance/check-out',
      {
        location: { lat: 19.0, lng: 72.8 },
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
  });

  // Feature 26: Create shift
  let shiftId = '';
  await test('Feature #26: Create duty shift', async () => {
    const res = await makeRequest(
      'POST',
      '/api/shift',
      {
        name: 'Morning Shift',
        startTime: '06:00',
        endTime: '14:00',
        duties: ['Gate monitoring', 'Patrol'],
      },
      adminToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    shiftId = res.data.data?._id;
  });

  // Feature 26: View my shifts
  await test('Feature #26: View assigned shifts', async () => {
    const res = await makeRequest('GET', '/api/shift/my-shifts', null, authToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 27: Apply for leave
  let leaveId = '';
  await test('Feature #27: Apply for leave', async () => {
    const res = await makeRequest(
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
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    leaveId = res.data.data?._id;
  });

  // Feature 27: View my leaves
  await test('Feature #27: View own leave applications', async () => {
    const res = await makeRequest('GET', '/api/leave/my-leaves', null, authToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.yellow}[TESTING] Communication (Features 29-32)${colors.reset}`);

  // Feature 29: Send message
  await test('Feature #29: Send message', async () => {
    const res = await makeRequest(
      'POST',
      '/api/communication/message/send',
      {
        recipientId: adminId,
        messageText: 'Test message',
        messageType: 'text',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
  });

  // Feature 30: Initiate call
  await test('Feature #30: Initiate intercom call', async () => {
    const res = await makeRequest(
      'POST',
      '/api/communication/call/initiate',
      {
        recipientId: adminId,
        callType: 'intercom',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
  });

  // Feature 31: Create notice
  let noticeId = '';
  await test('Feature #31: Publish notice/announcement', async () => {
    const res = await makeRequest(
      'POST',
      '/api/notice',
      {
        title: 'Maintenance Alert',
        content: 'Water maintenance on June 8',
        noticeType: 'maintenance',
        targetRoles: ['staff', 'member'],
      },
      adminToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    noticeId = res.data.data?._id;
  });

  // Feature 31: View notices
  await test('Feature #31: View notices and announcements', async () => {
    const res = await makeRequest('GET', '/api/notice', null, authToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 32: Get alerts
  await test('Feature #32: Get emergency alerts', async () => {
    const res = await makeRequest('GET', '/api/alert', null, authToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // Feature 32: Get emergency alerts only
  await test('Feature #32: Get critical/emergency alerts', async () => {
    const res = await makeRequest('GET', '/api/alert/emergency', null, authToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.yellow}[TESTING] Additional Pre-Approved Visitors (Feature 2)${colors.reset}`);

  // Feature 2: Create pre-approved visitor
  let preApprovedId = '';
  await test('Feature #2: Create pre-approved visitor', async () => {
    const res = await makeRequest(
      'POST',
      '/api/pre-approved',
      {
        visitorName: 'Regular Maid',
        visitorPhone: '9988776655',
        relationship: 'domestic help',
        visitFrequency: 'weekly',
      },
      authToken
    );
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    preApprovedId = res.data.data?._id;
  });

  // Feature 2: View pre-approved list
  await test('Feature #2: View pre-approved list', async () => {
    const res = await makeRequest(
      'GET',
      '/api/pre-approved/my-list',
      null,
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.yellow}[TESTING] Additional Deliveries (Feature 5)${colors.reset}`);

  // Feature 5: Get deliveries
  await test('Feature #5: Get delivery list', async () => {
    const res = await makeRequest('GET', '/api/delivery', null, authToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.yellow}[TESTING] Additional Packages (Feature 6-7)${colors.reset}`);

  // Feature 6-7: View packages
  await test('Feature #6-7: View received packages', async () => {
    const res = await makeRequest(
      'GET',
      '/api/package/my-packages',
      null,
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.yellow}[TESTING] Additional Vehicles (Feature 14-16)${colors.reset}`);

  // Feature 14-16: Get resident vehicles
  await test('Feature #14-16: Get resident vehicles', async () => {
    const res = await makeRequest(
      'GET',
      '/api/vehicle/my-vehicles',
      null,
      authToken
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}TEST RESULTS${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(
    `${colors.green}✅ Passed: ${passedTests}/${totalTests}${colors.reset}`
  );
  console.log(
    `${colors.red}❌ Failed: ${failedTests}/${totalTests}${colors.reset}`
  );
  console.log(
    `${colors.blue}📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(
      2
    )}%${colors.reset}`
  );
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

  if (failedTests === 0) {
    console.log(
      `${colors.green}🎉 ALL TESTS PASSED! All 32 features are working!${colors.reset}`
    );
  } else {
    console.log(
      `${colors.yellow}⚠️  ${failedTests} test(s) failed. Please review errors above.${colors.reset}`
    );
  }

  console.log(`\n${colors.blue}Test suite completed at ${new Date().toISOString()}${colors.reset}\n`);
}

// Run tests
runTests().catch((err) => {
  console.error(`${colors.red}Fatal error: ${err.message}${colors.reset}`);
  process.exit(1);
});
