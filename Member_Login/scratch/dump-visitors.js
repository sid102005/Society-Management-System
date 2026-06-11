require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Visitor = require("../src/models/Visitor");
const VisitorOTP = require("../src/models/VisitorOTP");
const Resident = require("../src/models/Resident");

async function check() {
  try {
    await connectDB();
    console.log("🔌 Connected successfully.");
    const visitors = await Visitor.find({});
    console.log(`Found ${visitors.length} visitors:`);
    for (const v of visitors) {
      const resident = await Resident.findById(v.residentId);
      const otpObj = await VisitorOTP.findOne({ visitorId: v._id });
      console.log(`- Visitor ID: ${v._id}`);
      console.log(`  Name: "${v.visitorName}"`);
      console.log(`  Status: ${v.status}`);
      console.log(`  Resident: ${resident ? resident.email : 'Unknown'} (${v.residentId})`);
      console.log(`  OTP Code: ${otpObj ? otpObj.otpCode : 'None'} (Expires: ${otpObj ? otpObj.expiresAt : 'N/A'})`);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
check();
