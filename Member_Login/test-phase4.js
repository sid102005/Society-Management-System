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
  console.log("🚀 Starting Phase 4 Tests (Complaints & Requests)...\n");

  const email = `phase4_tester_${Date.now()}@example.com`;
  const userPayload = {
    fullName: "Phase4 Tester",
    email: email,
    phone: `911${Math.round(Math.random() * 1e7)}`,
    password: "Password@123",
    flatNumber: "201",
    wing: "D",
    residentType: "Tenant",
  };

  const regRes = await request("POST", "/api/auth/register", userPayload);

  if (regRes.statusCode !== 201) {
    console.error("❌ User registration failed!", regRes.statusCode, regRes.body);
    return;
  }

  const cookie = regRes.headers["set-cookie"][0].split(";")[0];
  const authHeaders = { Cookie: cookie };
  console.log("✅ User registered successfully.\n");

  try {
    // 24. Create Complaint
    console.log("--- Testing Complaints ---");
    let res = await request("POST", "/api/complaints", {
      category: "Maintenance",
      title: "Leaking Pipe",
      description: "The kitchen pipe is leaking."
    }, authHeaders);
    
    console.log("Create complaint:", res.statusCode, res.body?.success ? "Success" : res.body);
    const complaintId = res.body?.data?.complaint?._id;

    // 29. List Complaints
    res = await request("GET", "/api/complaints", null, authHeaders);
    console.log("List complaints:", res.statusCode, "Count:", res.body?.data?.complaints?.length);

    // 26. Add Comment
    if (complaintId) {
      res = await request("POST", `/api/complaints/${complaintId}/comment`, {
        message: "Any update on this?"
      }, authHeaders);
      console.log("Add comment:", res.statusCode, res.body?.success ? "Success" : res.body);

      // Update status to Resolved
      res = await request("PUT", `/api/complaints/${complaintId}`, {
        status: "Resolved"
      }, authHeaders);
      console.log("Resolve complaint:", res.statusCode, res.body?.success ? "Success" : res.body);

      // 27. Rate resolution
      res = await request("POST", `/api/complaints/${complaintId}/rate`, {
        rating: 5
      }, authHeaders);
      console.log("Rate complaint:", res.statusCode, res.body?.success ? "Success" : res.body);
    }

    // 28. Service Request
    console.log("\n--- Testing Service Requests ---");
    res = await request("POST", "/api/complaints/service/request", {
      category: "Intercom",
      title: "New Intercom Connection",
      description: "Please setup intercom in 201."
    }, authHeaders);
    console.log("Create service request:", res.statusCode, res.body?.success ? "Success" : res.body);

  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTests();
