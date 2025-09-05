import mongoose from "mongoose";

async function connect_database() {
  const dbUri = process.env.DATABASE_URI;

  if (!dbUri) {
    console.error("❌ DATABASE_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process if DB connection fails
  }
}

export default connect_database;
