import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js"; // ✅ uses pre-save hook

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB");

    const existingAdmin = await Admin.findOne({ email: "dtikone@gmail.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin with this email already exists.");
      return process.exit();
    }

    const admin = new Admin({
      name: "Super Admin",
      email: "dtikone@gmail.com",
      password: "admin123", // 🔐 raw password (will be hashed by pre-save)
      isAdmin: true,
    });

    await admin.save();
    console.log("✅ Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();