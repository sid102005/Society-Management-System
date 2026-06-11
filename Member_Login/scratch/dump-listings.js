require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const PropertyListing = require("../src/models/PropertyListing");
const Resident = require("../src/models/Resident");

async function check() {
  try {
    await connectDB();
    console.log("🔌 Connected successfully.");
    const listings = await PropertyListing.find({});
    console.log(`Found ${listings.length} listings:`);
    for (const listing of listings) {
      const resident = await Resident.findById(listing.residentId);
      console.log(`- ID: ${listing._id}, Title: "${listing.title}", Price: ${listing.price}, Resident: ${resident ? resident.email : 'Unknown'} (${listing.residentId})`);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
check();
