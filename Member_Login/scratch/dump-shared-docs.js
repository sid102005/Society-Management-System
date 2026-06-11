require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const SharedDocument = require("../src/models/SharedDocument");
const Resident = require("../src/models/Resident");

async function check() {
  try {
    await connectDB();
    console.log("🔌 Connected successfully.");
    const docs = await SharedDocument.find({});
    console.log(`Found ${docs.length} shared documents:`);
    for (const d of docs) {
      const resident = await Resident.findById(d.residentId);
      console.log(`- ID: ${d._id}`);
      console.log(`  Name: "${d.documentName}"`);
      console.log(`  Token: "${d.shareToken}"`);
      console.log(`  Expiry: ${d.expiryDate}`);
      console.log(`  Resident: ${resident ? resident.email : 'Unknown'} (${d.residentId})`);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
check();
