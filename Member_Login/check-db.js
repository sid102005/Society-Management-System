require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Notice = require("./src/models/Notice");

async function check() {
  try {
    await connectDB();
    console.log("🔌 Connected successfully.");
    const dbs = await mongoose.connection.db.admin().listDatabases();
    console.log("Databases on cluster:", dbs.databases.map(d => d.name));
    const count = await Notice.countDocuments();
    console.log("Notices in society DB:", count);
    await mongoose.connection.close();
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}
check();
