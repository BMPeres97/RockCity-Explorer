const mongoose = require("mongoose");

let mongoMemoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rockcity_explorer";

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(
      `[Database] Could not connect to primary MongoDB: ${err.message}`,
    );

    if (!mongoMemoryServer) {
      console.log(
        "[Database] Starting in-memory MongoDB server for local development...",
      );
      const { MongoMemoryServer } = require("mongodb-memory-server");
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(
        `[Database] In-memory MongoDB connected successfully at: ${memoryUri}`,
      );
      return conn;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
