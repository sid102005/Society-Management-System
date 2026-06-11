require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  try {
    console.log("⏳ Attempting to connect...");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log("✅ MongoDB Connected Successfully!");

    const db = mongoose.connection.db;
    console.log(`\n📡 Current Database: ${db.databaseName}`);

    // Ping
    const pingResult = await db.admin().command({ ping: 1 });
    console.log("🏓 Ping Result:", pingResult);

    // List all databases
    const databasesList = await db.admin().listDatabases();
    console.log("\n📂 Databases on this Cluster:");
    databasesList.databases.forEach((d) => {
      console.log(`- ${d.name} (${(d.sizeOnDisk / 1024 / 1024).toFixed(4)} MB)`);
    });

    // List collections in the current database
    console.log(`\n📋 Collections in '${db.databaseName}':`);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log("⚠️ No collections found. Has the database been seeded?");
    } else {
      for (const colInfo of collections) {
        const colName = colInfo.name;
        const count = await db.collection(colName).countDocuments();
        console.log(`\n🔹 Collection: ${colName} (${count} documents)`);
        
        // Get indexes
        try {
          const indexes = await db.collection(colName).indexes();
          console.log("   Indexes:");
          indexes.forEach(idx => {
            console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
          });
        } catch (idxErr) {
          console.log(`   - Could not retrieve indexes: ${idxErr.message}`);
        }
      }
    }

    console.log("\n🎉 Connection and Verification Test Passed Successfully!");
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED");
    console.error(error);

    if (error.message.includes("Authentication failed")) {
      console.log("🔑 Username or password is incorrect. Check your connection string password!");
    }

    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("getaddrinfo")
    ) {
      console.log("🌐 DNS resolution issue. Ensure your internet connection is active!");
    }

    if (error.message.includes("timed out")) {
      console.log("⏰ Timeout issue. Check Atlas Network Access / IP Access List rules (allow access from anywhere 0.0.0.0/0)!");
    }

    if (error.message.includes("SSL") || error.message.includes("TLS")) {
      console.log("🔒 TLS/SSL issue");
    }
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB.");
  }
}

testConnection();
