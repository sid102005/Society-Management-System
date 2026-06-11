const http = require("http");

const BASE_URL = "http://localhost:3000";

async function request(method, path, body = null, headers = {}) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json,
        });
      });
    });

    req.on("error", (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("🚀 Starting Phase 3 Tests...\n");

  const email = `phase3_tester_${Date.now()}@example.com`;
  const userPayload = {
    fullName: "Phase3 Tester",
    email: email,
    phone: `911${Math.round(Math.random() * 1e7)}`,
    password: "Password@123",
    flatNumber: "101",
    wing: "C",
    residentType: "Owner",
  };

  console.log("🔹 Registering Test User...");
  const regRes = await request("POST", "/api/auth/register", userPayload);

  if (regRes.statusCode !== 201) {
    console.error("❌ User registration failed!", regRes.statusCode, regRes.body);
    return;
  }

  const cookie = regRes.headers["set-cookie"][0].split(";")[0];
  const authHeaders = { Cookie: cookie };
  console.log("✅ User registered successfully.\n");

  try {
    // 17. Pre-approve visitor
    console.log("--- Testing Visitors ---");
    let res = await request("POST", "/api/visitors/preapprove", {
      visitorName: "John Doe",
      purpose: "Guest",
      phone: "9876543210",
      expectedVisitAt: new Date().toISOString()
    }, authHeaders);
    
    console.log("Pre-approve visitor:", res.statusCode, res.body);
    const visitorId = res.body?.data?.visitor?._id;

    // 18. Approve visitor
    if (visitorId) {
      res = await request("POST", "/api/visitors/approve", {
        visitorId: visitorId,
        otp: "123456"
      }, authHeaders);
      console.log("Approve visitor:", res.statusCode, res.body);
    }

    // 19. Visitor History
    res = await request("GET", "/api/visitors/history", null, authHeaders);
    console.log("Visitor history:", res.statusCode, res.body?.data?.length, "records");

    // 20. Add & Manage daily staff
    console.log("\n--- Testing Helpers ---");
    res = await request("POST", "/api/helpers", {
      helperName: "Jane Maid",
      role: "Maid",
      phone: "1112223334"
    }, authHeaders);
    console.log("Create helper:", res.statusCode, res.body);
    const helperId = res.body?.data?.helper?._id;

    res = await request("GET", "/api/helpers", null, authHeaders);
    console.log("List helpers:", res.statusCode, res.body?.data?.length, "records");

    if (helperId) {
      res = await request("POST", "/api/helpers/attendance", {
        helperId,
        attendanceDate: new Date().toISOString(),
        status: "Present"
      }, authHeaders);
      console.log("Mark attendance:", res.statusCode, res.body);
    }

    // 21. Gate pass generation (Delivery)
    console.log("\n--- Testing Delivery ---");
    res = await request("POST", "/api/delivery/authorize", {
      deliveryPartner: "Amazon",
      recipientName: "Phase3 Tester"
    }, authHeaders);
    console.log("Authorize delivery:", res.statusCode, res.body);

    // 22. SOS Alert
    console.log("\n--- Testing SOS ---");
    res = await request("POST", "/api/emergency/sos", {
      alertType: "Medical",
      description: "Need help!"
    }, authHeaders);
    console.log("Create SOS:", res.statusCode, res.body);

  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTests();
