const mongoose = require("mongoose");
const http = require("http");
const Amenity = require("./src/models/Amenity");
const AmenityBooking = require("./src/models/AmenityBooking");
const Resident = require("./src/models/Resident");

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

async function setupDB() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/society", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await Amenity.deleteMany({ name: "Test Clubhouse" });
  await AmenityBooking.deleteMany({});
  
  const amenity = await Amenity.create({
    name: "Test Clubhouse",
    type: "Club House",
    capacity: 50,
    category: "Recreation",
    description: "A nice clubhouse for events.",
    isPaid: true,
    chargesPerHour: 500,
    operatingHours: {
      start: "08:00 AM",
      end: "10:00 PM"
    },
    rules: ["No smoking", "Clean up after use"],
    status: "Available",
    isActive: true
  });

  return amenity._id;
}

async function runTests() {
  console.log("🚀 Starting Phase 5 Tests (Amenity Booking)...\n");

  const amenityId = await setupDB();
  console.log("✅ Seeded test amenity:", amenityId);

  const email = `phase5_tester_${Date.now()}@example.com`;
  const userPayload = {
    fullName: "Phase5 Tester",
    email: email,
    phone: `911${Math.round(Math.random() * 1e7)}`,
    password: "Password@123",
    flatNumber: "301",
    wing: "E",
    residentType: "Owner",
  };

  const regRes = await request("POST", "/api/auth/register", userPayload);

  if (regRes.statusCode !== 201) {
    console.error("❌ User registration failed!", regRes.statusCode, regRes.body);
    process.exit(1);
  }

  const cookie = regRes.headers["set-cookie"][0].split(";")[0];
  const authHeaders = { Cookie: cookie };
  console.log("✅ User registered successfully.\n");

  try {
    // 30. List Amenities
    console.log("--- Testing Amenities ---");
    let res = await request("GET", "/api/amenities/amenities", null, authHeaders);
    console.log("List amenities:", res.statusCode, "Count:", res.body?.data?.amenities?.length);

    // 31. Create Booking
    res = await request("POST", "/api/amenities/bookings", {
      amenityId: amenityId.toString(),
      bookingDate: new Date().toISOString(),
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      duration: 2,
      notes: "Birthday party"
    }, authHeaders);
    
    console.log("Create booking:", res.statusCode, res.body?.success ? "Success" : res.body);
    const bookingId = res.body?.data?.booking?._id;

    // List Bookings
    res = await request("GET", "/api/amenities/bookings", null, authHeaders);
    console.log("List bookings:", res.statusCode, "Count:", res.body?.data?.bookings?.length);

    // 33. Cancel Booking
    if (bookingId) {
      res = await request("POST", `/api/amenities/bookings/${bookingId}/cancel`, null, authHeaders);
      console.log("Cancel booking:", res.statusCode, res.body?.success ? "Success" : res.body);
    }

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

runTests();
