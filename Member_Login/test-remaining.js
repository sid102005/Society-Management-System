require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Resident = require("./src/models/Resident");
const Amenity = require("./src/models/Amenity");
const Poll = require("./src/models/Poll");
const Event = require("./src/models/Event");
const EmergencyContact = require("./src/models/EmergencyContact");

const BASE_URL = "http://localhost:3000";

// Helper for sending HTTP requests
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

async function runRemainingTests() {
  console.log("🚀 Starting Integration Tests for Remaining Modules...\n");
  console.log("URI:", process.env.MONGODB_URI);

  // Connect to DB for setup
  await connectDB();
  console.log("🔌 Connected to database for test setup.");

  // Clear existing items and create test items
  await Amenity.deleteMany({});
  await Poll.deleteMany({});
  await Event.deleteMany({});
  await EmergencyContact.deleteMany({});

  const testAmenity = await Amenity.create({
    name: "Clubhouse Party Hall",
    description: "Spacious clubhouse hall for social events",
    type: "Club House",
    capacity: 100,
    chargesPerHour: 500,
    operatingHours: { start: "08:00", end: "22:00" },
    isActive: true,
  });

  const demoResident = await Resident.findOne({ email: "finance.demo@example.com" });

  const testPoll = await Poll.create({
    title: "Painting Society Gates",
    description: "Should we paint the main gates green or blue?",
    options: [
      { text: "Green", votes: 0 },
      { text: "Blue", votes: 0 }
    ],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in future
    status: "Active",
    createdBy: demoResident._id,
  });

  const testEvent = await Event.create({
    title: "Independence Day Carnival",
    description: "Grand community gathering with games and snacks",
    eventType: "Cultural",
    eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    startTime: "18:00",
    endTime: "21:00",
    location: "Central Park Lawn",
    organizer: "Cultural Committee",
    status: "Upcoming",
    maxParticipants: 100,
    currentParticipants: 0,
  });

  await EmergencyContact.create({
    name: "Gate 1 Security",
    phone: "9111222333",
    type: "Society Helpline",
  });

  console.log("📝 Seeded temporary test items in DB.");

  // Login
  const loginRes = await request("POST", "/api/auth/login", {
    email: "finance.demo@example.com",
    password: "Password@123",
  });

  if (loginRes.statusCode !== 200) {
    console.error("❌ Login failed!", loginRes.body);
    await mongoose.connection.close();
    return;
  }

  const cookie = loginRes.headers["set-cookie"][0].split(";")[0];
  const authHeader = { Cookie: cookie };
  console.log("🔑 Logged in successfully.");

  // ==========================================
  // MODULE 5: Amenity Booking
  // ==========================================
  console.log("\n=== MODULE 5: Amenity Booking ===");
  const listAmenitiesRes = await request("GET", "/api/amenities/amenities", null, authHeader);
  if (listAmenitiesRes.statusCode === 200) {
    console.log("✅ GET /api/amenities/amenities returned 200.");
  } else {
    console.error("❌ GET /api/amenities/amenities failed!", listAmenitiesRes.statusCode, listAmenitiesRes.body);
  }

  // Create booking
  const bookingDate = new Date();
  bookingDate.setDate(bookingDate.getDate() + 2); // 2 days in future
  const bookingRes = await request("POST", "/api/amenities/bookings", {
    amenityId: testAmenity._id.toString(),
    bookingDate: bookingDate.toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "12:00",
    duration: 2,
  }, authHeader);

  let bookingId = "";
  if (bookingRes.statusCode === 201) {
    bookingId = bookingRes.body.data.booking._id;
    console.log("✅ Create Booking returned 201.");
  } else {
    console.error("❌ Create Booking failed!", bookingRes.statusCode, bookingRes.body);
  }

  // ==========================================
  // MODULE 6: Safety & Emergency
  // ==========================================
  console.log("\n=== MODULE 6: Safety & Emergency ===");
  const triggerSosRes = await request("POST", "/api/emergency/sos", {
    alertType: "Medical",
    description: "Medical emergency in Block A",
  }, authHeader);
  if (triggerSosRes.statusCode === 201) {
    console.log("✅ Trigger SOS returned 201.");
  } else {
    console.error("❌ Trigger SOS failed!", triggerSosRes.statusCode, triggerSosRes.body);
  }

  const getContactsRes = await request("GET", "/api/emergency/contacts", null, authHeader);
  if (getContactsRes.statusCode === 200) {
    console.log("✅ GET /api/emergency/contacts returned 200.");
  } else {
    console.error("❌ GET /api/emergency/contacts failed!", getContactsRes.statusCode, getContactsRes.body);
  }

  // ==========================================
  // MODULE 7: Community & Communication
  // ==========================================
  console.log("\n=== MODULE 7: Community & Communication ===");
  // List Polls
  const pollsRes = await request("GET", "/api/community/polls", null, authHeader);
  if (pollsRes.statusCode === 200) {
    console.log("✅ GET /api/community/polls returned 200.");
  } else {
    console.error("❌ GET /api/community/polls failed!", pollsRes.statusCode, pollsRes.body);
  }

  // Vote on Poll
  const voteRes = await request("POST", `/api/community/polls/${testPoll._id}/vote`, {
    optionIndex: 0,
  }, authHeader);
  if (voteRes.statusCode === 200) {
    console.log("✅ Vote on Poll returned 200.");
  } else {
    console.error("❌ Vote on Poll failed!", voteRes.statusCode, voteRes.body);
  }

  // Event Registration
  const registerEventRes = await request("POST", `/api/community/events/${testEvent._id}/register`, {}, authHeader);
  if (registerEventRes.statusCode === 200) {
    console.log("✅ Register for Event returned 200.");
  } else {
    console.error("❌ Register for Event failed!", registerEventRes.statusCode, registerEventRes.body);
  }

  // ==========================================
  // MODULE 8: Visitor & Gate Management
  // ==========================================
  console.log("\n=== MODULE 8: Visitor & Gate Management ===");
  const visitorPreRes = await request("POST", "/api/visitors/preapprove", {
    visitorName: "Sunil Sharma",
    phone: "9988776655",
    purpose: "Guest Visit",
  }, authHeader);

  let visitorId = "";
  let visitorOtp = "";
  if (visitorPreRes.statusCode === 201) {
    visitorId = visitorPreRes.body.data.visitor._id;
    visitorOtp = visitorPreRes.body.data.otp;
    console.log("✅ Pre-approve Visitor returned 201.");
  } else {
    console.error("❌ Pre-approve Visitor failed!", visitorPreRes.statusCode, visitorPreRes.body);
  }

  if (visitorId && visitorOtp) {
    const approveRes = await request("POST", "/api/visitors/approve", {
      visitorId,
      otp: visitorOtp,
    }, authHeader);
    if (approveRes.statusCode === 200) {
      console.log("✅ Approve Visitor OTP returned 200.");
    } else {
      console.error("❌ Approve Visitor OTP failed!", approveRes.statusCode, approveRes.body);
    }
  }

  // Cleanup DB connections and test seeds
  await mongoose.connection.close();
  console.log("\n🔌 Disconnected from database.");
  console.log("🎉 Remaining Modules Integration Tests Finished!");
}

runRemainingTests().catch(err => console.error("Remaining tests failed:", err));
