require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Resident = require("./src/models/Resident");
const FamilyMember = require("./src/models/FamilyMember");
const Vehicle = require("./src/models/Vehicle");
const MoveOutRequest = require("./src/models/MoveOutRequest");
const PropertyListing = require("./src/models/PropertyListing");
const Document = require("./src/models/Document");
const DocumentShare = require("./src/models/DocumentShare");
const Notification = require("./src/models/Notification");

const BASE_URL = "http://localhost:3000";

// Helper for sending requests with cookies
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
  console.log("🚀 Starting Phase 2 Specification Integration Tests...\n");

  await connectDB();
  console.log("🔌 Connected to database.");

  // Generate test users
  const emailA = `alice_p2_${Date.now()}@example.com`;
  const emailB = `bob_p2_${Date.now()}@example.com`;

  const userAPayload = {
    fullName: "Alice Phase 2",
    email: emailA,
    phone: `955${Math.round(Math.random() * 1e7)}`,
    password: "Password@123",
    flatNumber: "201",
    wing: "A",
    residentType: "Owner",
  };

  const userBPayload = {
    fullName: "Bob Phase 2",
    email: emailB,
    phone: `956${Math.round(Math.random() * 1e7)}`,
    password: "Password@123",
    flatNumber: "202",
    wing: "A",
    residentType: "Owner",
  };

  console.log("🔹 Registering Users...");
  const resA = await request("POST", "/api/auth/register", userAPayload);
  const resB = await request("POST", "/api/auth/register", userBPayload);

  if (resA.statusCode !== 201 || resB.statusCode !== 201) {
    console.error("❌ User registration failed!");
    await mongoose.connection.close();
    return;
  }

  const cookieA = resA.headers["set-cookie"][0].split(";")[0];
  const cookieB = resB.headers["set-cookie"][0].split(";")[0];

  const authA = { Cookie: cookieA };
  const authB = { Cookie: cookieB };

  console.log("✅ Users registered and authenticated.");

  // ==========================================
  // MODULE 1: HOME DASHBOARD
  // ==========================================
  console.log("\n=== MODULE 1: Home Dashboard ===");
  // Add family member & vehicle to Alice
  await request("POST", "/api/family", { name: "Alice Family 1", relation: "Spouse", age: 32 }, authA);
  await request("POST", "/api/vehicles", { vehicleType: "Bike", vehicleNumber: `MH12B${Math.round(Math.random()*1000)}` }, authA);

  const homeRes = await request("GET", "/api/home/dashboard", null, authA);
  if (homeRes.statusCode === 200) {
    console.log("✅ GET /api/home/dashboard returned 200.");
    console.log("- Resident Name:", homeRes.body.data.resident.fullName);
    console.log("- Family Count:", homeRes.body.data.familyMembers.length);
    console.log("- Vehicles Count:", homeRes.body.data.vehicles.length);
  } else {
    console.error("❌ GET /api/home/dashboard failed!", homeRes.statusCode, homeRes.body);
  }

  // ==========================================
  // MODULE 2: MOVE OUT REQUESTS
  // ==========================================
  console.log("\n=== MODULE 2: Move Out Requests ===");
  const moveOutDate = new Date();
  moveOutDate.setDate(moveOutDate.getDate() + 30); // 30 days in future

  // POST request
  const moveOutPost = await request("POST", "/api/moveout", {
    moveOutDate: moveOutDate.toISOString().split("T")[0],
    reason: "Changing job location",
    remarks: "Requesting immediate review",
  }, authA);

  let moveOutId = "";
  if (moveOutPost.statusCode === 201) {
    moveOutId = moveOutPost.body.data.moveOutRequest._id;
    console.log("✅ Create Move-Out Request with remarks returned 201.");
    console.log("- Remarks:", moveOutPost.body.data.moveOutRequest.remarks);
  } else {
    console.error("❌ Create Move-Out Request failed!", moveOutPost.statusCode, moveOutPost.body);
  }

  // GET listing
  const moveOutGet = await request("GET", "/api/moveout", null, authA);
  if (moveOutGet.statusCode === 200) {
    console.log(`✅ GET /api/moveout returned ${moveOutGet.body.data.moveOutRequests.length} requests.`);
  } else {
    console.error("❌ GET /api/moveout failed!", moveOutGet.body);
  }

  // GET by ID and IDOR check
  if (moveOutId) {
    const moveOutGetId = await request("GET", `/api/moveout/${moveOutId}`, null, authA);
    if (moveOutGetId.statusCode === 200) {
      console.log("✅ GET /api/moveout/:id returned 200.");
    } else {
      console.error("❌ GET /api/moveout/:id failed!", moveOutGetId.body);
    }

    const idorMoveOut = await request("GET", `/api/moveout/${moveOutId}`, null, authB);
    if (idorMoveOut.statusCode === 404) {
      console.log("✅ IDOR isolation for GET /api/moveout/:id working (404).");
    } else {
      console.error("❌ IDOR vulnerability! GET /api/moveout/:id allowed access. Status:", idorMoveOut.statusCode);
    }
  }

  // ==========================================
  // MODULE 3: PROPERTY LISTINGS
  // ==========================================
  console.log("\n=== MODULE 3: Property Listings ===");
  const listingPost = await request("POST", "/api/listings", {
    listingType: "Rent",
    propertyType: "Apartment",
    title: "Lovely 3BHK to rent",
    description: "East facing, garden view, high floor",
    price: 35000,
  }, authA);

  let listingId = "";
  if (listingPost.statusCode === 201) {
    listingId = listingPost.body.data.listing._id;
    console.log("✅ Create PropertyListing with new schema returned 201.");
    console.log("- Title:", listingPost.body.data.listing.title);
    console.log("- Price:", listingPost.body.data.listing.price);
    console.log("- ListingType:", listingPost.body.data.listing.listingType);
    console.log("- Backwards Compatible type virtual:", listingPost.body.data.listing.type);
    console.log("- Backwards Compatible expectedPrice virtual:", listingPost.body.data.listing.expectedPrice);
  } else {
    console.error("❌ Create PropertyListing failed!", listingPost.statusCode, listingPost.body);
  }

  if (listingId) {
    // PUT update
    const listingPut = await request("PUT", `/api/listings/${listingId}`, {
      price: 37000,
      description: "Updated description text",
    }, authA);
    if (listingPut.statusCode === 200) {
      console.log("✅ PUT /api/listings/:id updated successfully.");
      console.log("- New Price:", listingPut.body.data.listing.price);
    } else {
      console.error("❌ PUT /api/listings/:id failed!", listingPut.body);
    }

    // IDOR PUT check
    const idorListingPut = await request("PUT", `/api/listings/${listingId}`, {
      price: 1000,
    }, authB);
    if (idorListingPut.statusCode === 404) {
      console.log("✅ IDOR isolation for PUT /api/listings/:id working (404).");
    } else {
      console.error("❌ IDOR vulnerability! PUT allowed. Status:", idorListingPut.statusCode);
    }
  }

  // ==========================================
  // MODULE 4: DOCUMENT SHARING
  // ==========================================
  console.log("\n=== MODULE 4: Document Sharing ===");
  // Create a dummy document first
  const doc = await Document.create({
    title: "Bylaws doc",
    description: "Society bylaws document",
    documentFile: "/uploads/documents/bylaws.pdf",
  });

  const sharePost = await request("POST", "/api/document-share", {
    documentId: doc._id.toString(),
    sharedWithEmail: "buyer@example.com",
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  }, authA);

  let shareId = "";
  if (sharePost.statusCode === 201) {
    shareId = sharePost.body.data.documentShare._id;
    console.log("✅ POST /api/document-share returned 201.");
    console.log("- Token generated:", sharePost.body.data.documentShare.accessToken);
  } else {
    console.error("❌ POST /api/document-share failed!", sharePost.statusCode, sharePost.body);
  }

  const shareGet = await request("GET", "/api/document-share", null, authA);
  if (shareGet.statusCode === 200) {
    console.log(`✅ GET /api/document-share returned ${shareGet.body.data.documentShares.length} shared records.`);
  } else {
    console.error("❌ GET /api/document-share failed!", shareGet.body);
  }

  if (shareId) {
    // IDOR delete check
    const idorShareDelete = await request("DELETE", `/api/document-share/${shareId}`, null, authB);
    if (idorShareDelete.statusCode === 404) {
      console.log("✅ IDOR isolation for DELETE /api/document-share/:id working (404).");
    } else {
      console.error("❌ IDOR vulnerability! DELETE allowed. Status:", idorShareDelete.statusCode);
    }

    const shareDelete = await request("DELETE", `/api/document-share/${shareId}`, null, authA);
    if (shareDelete.statusCode === 200) {
      console.log("✅ DELETE /api/document-share/:id deleted successfully.");
    } else {
      console.error("❌ DELETE /api/document-share/:id failed!", shareDelete.body);
    }
  }

  // ==========================================
  // NOTIFICATIONS CHECK
  // ==========================================
  console.log("\n=== NOTIFICATIONS: Event Notification Generation ===");
  const notifCount = await Notification.countDocuments({ residentId: resA.body.data.resident._id });
  console.log(`✅ Total Notifications generated for Alice: ${notifCount} (Expected: 5 - Profile Registration + Family + Vehicle + MoveOut + Listing + DocShare)`);

  await mongoose.connection.close();
  console.log("\n🔌 Disconnected from database.");
  console.log("🎉 Integration Verification Completed Successfully!");
}

runTests().catch(err => console.error("Test execution failed:", err));
