import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js"; // Update path if needed

dotenv.config(); // Loads .env (with MONGO_URI and others)

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📡 Connected to MongoDB");

    const email = "tikonecricketgurukul@gmail.com"; // <-- change to your email
    const password = "admin123@"; // <-- change to your password

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
    } else {
      // Create admin without hashing manually — Mongoose will do it
      const newAdmin = await Admin.create({
        name: "TCG ADMIN",
        email,
        password,
        isAdmin: true,
      });

      console.log("✅ Admin created:", newAdmin.email);
    }

    // Disconnect
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();