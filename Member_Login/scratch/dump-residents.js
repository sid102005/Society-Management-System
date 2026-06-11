require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Resident = require("../src/models/Resident");

async function check() {
  try {
    await connectDB();
    console.log("🔌 Connected successfully.");
    const residents = await Resident.find({});
    console.log(`Found ${residents.length} residents:`);
    for (const res of residents) {
      console.log(`- ID: ${res._id}, Email: ${res.email}, Name: ${res.fullName}`);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
check();
