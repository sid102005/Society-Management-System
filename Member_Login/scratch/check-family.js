require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Resident = require("../src/models/Resident");
const FamilyMember = require("../src/models/FamilyMember");

async function check() {
  try {
    await connectDB();
    const residents = await Resident.find({});
    console.log("Residents count:", residents.length);
    residents.forEach(r => console.log(`Resident: ID=${r._id}, Email=${r.email}, Name=${r.fullName}`));

    const family = await FamilyMember.find({});
    console.log("Family Members count:", family.length);
    family.forEach(f => console.log(`FamilyMember: ID=${f._id}, ResidentID=${f.residentId}, Name=${f.name}`));

    await mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
  }
}
check();
