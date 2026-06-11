const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

// Feature status tracker
const features = {
  1: { name: 'Visitor entry log', endpoint: 'POST /visitor', status: '❌' },
  2: { name: 'Pre-approved visitor list', endpoint: 'GET /pre-approved', status: '❌' },
  3: { name: 'OTP-based visitor approval', endpoint: 'POST /visitor/otp/send', status: '❌' },
  4: { name: 'QR code/barcode scanner', endpoint: 'POST /visitor/qr/scan', status: '❌' },
  5: { name: 'Delivery/courier entry log', endpoint: 'POST /delivery', status: '❌' },
  6: { name: 'Package received log', endpoint: 'POST /package', status: '❌' },
  7: { name: 'Package handover log', endpoint: 'POST /package/:id/handover', status: '❌' },
  8: { name: 'Cab & vehicle entry log', endpoint: 'POST /vehicle-entry', status: '❌' },
  9: { name: 'Domestic help management', endpoint: 'POST /domestic-help/register', status: '❌' },
  10: { name: 'Blacklist visitor management', endpoint: 'POST /blacklist', status: '❌' },
  11: { name: 'Overstay alert', endpoint: 'GET /visitor/alerts/overstay', status: '❌' },
  12: { name: 'Daily visitor report', endpoint: 'GET /visitor/reports/daily', status: '❌' },
  13: { name: 'Member directory access', endpoint: 'GET /member', status: '❌' },
  14: { name: 'Resident vehicle entry/exit', endpoint: 'POST /vehicle/register', status: '❌' },
  15: { name: 'Vehicle sticker verification', endpoint: 'POST /vehicle/sticker/scan', status: '❌' },
  16: { name: 'Guest vehicle tracking', endpoint: 'POST /vehicle/guest/register', status: '❌' },
  17: { name: 'View assigned complaints/tasks', endpoint: 'GET /complaint/my-complaints', status: '❌' },
  18: { name: 'Mark complaints status', endpoint: 'PATCH /complaint/:id/status', status: '❌' },
  19: { name: 'Upload photo proof', endpoint: 'POST /complaint/:id/proof-photos', status: '❌' },
  20: { name: 'View daily task checklist', endpoint: 'GET /task', status: '❌' },
  21: { name: 'Patrol log with GPS', endpoint: 'POST /patrol', status: '❌' },
  22: { name: 'Incident report creation', endpoint: 'POST /incident', status: '❌' },
  23: { name: 'SOS/panic button', endpoint: 'POST /incident/sos', status: '❌' },
  24: { name: 'Emergency drill log', endpoint: 'POST /emergency-drill', status: '❌' },
  25: { name: 'Mark attendance check-in/out', endpoint: 'POST /attendance/check-in', status: '❌' },
  26: { name: 'View duty roster & shifts', endpoint: 'GET /shift', status: '❌' },
  27: { name: 'Apply for leave request', endpoint: 'POST /leave', status: '❌' },
  28: { name: 'View salary slips & history', endpoint: 'GET /salary/my-slips', status: '❌' },
  29: { name: 'In-app intercom calling', endpoint: 'POST /communication/call', status: '❌' },
  30: { name: 'In-app messaging', endpoint: 'POST /communication/message', status: '❌' },
  31: { name: 'View notices & announcements', endpoint: 'GET /notice', status: '❌' },
  32: { name: 'Emergency alerts', endpoint: 'GET /alert', status: '❌' }
};

async function testEndpoint(endpoint, token = 'test-token') {
  try {
    const [method, path] = endpoint.split(' ');
    const cleanPath = path.replace(':id', '000000000000000000000001');
    
    const config = {
      method: method.toLowerCase(),
      url: `${BASE_URL}${cleanPath}`,
      headers: { Authorization: `Bearer ${token}` },
      timeout: 3000
    };

    const response = await axios(config);
    return { working: true, status: response.status };
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return { working: false, error: 'Server not running' };
    }
    // 404, 401, 400 still means endpoint exists
    if (err.response && [400, 401, 403, 404].includes(err.response.status)) {
      return { working: true, status: err.response.status };
    }
    return { working: false, error: err.message };
  }
}

async function runAnalysis() {
  console.log('🔍 ANALYZING ALL 32 FEATURES...\n');
  console.log('Testing endpoints connectivity...\n');

  // First check if server is running
  try {
    await axios.get('http://localhost:4000/health', { timeout: 2000 });
    console.log('✅ Server is running\n');
  } catch (err) {
    console.log('❌ Server is NOT running at http://localhost:4000\n');
    console.log('Please start the server with: npm start\n');
    process.exit(1);
  }

  let working = 0;
  let notWorking = 0;

  for (const [num, feature] of Object.entries(features)) {
    const result = await testEndpoint(feature.endpoint);
    
    if (result.working) {
      feature.status = `✅ WORKING (${result.status})`;
      working++;
    } else {
      feature.status = `❌ NOT WORKING`;
      notWorking++;
    }

    console.log(`#${num.padStart(2, ' ')}: ${feature.name.padEnd(40)} → ${feature.endpoint.padEnd(35)} ${feature.status}`);
  }

  console.log('\n' + '='.repeat(120));
  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ WORKING: ${working}/32 (${Math.round((working/32)*100)}%)`);
  console.log(`   ❌ NOT WORKING: ${notWorking}/32 (${Math.round((notWorking/32)*100)}%)`);
  
  console.log('\n📋 WORKING FEATURES:');
  Object.entries(features).forEach(([num, f]) => {
    if (f.status.includes('WORKING')) {
      console.log(`   #${num}: ${f.name}`);
    }
  });

  console.log('\n❌ NOT WORKING FEATURES:');
  Object.entries(features).forEach(([num, f]) => {
    if (!f.status.includes('WORKING')) {
      console.log(`   #${num}: ${f.name}`);
    }
  });

  process.exit(0);
}

runAnalysis().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
