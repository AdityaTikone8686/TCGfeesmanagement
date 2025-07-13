import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js"; // Adjust path if needed

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
};

const seedUser = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: "user@example.com" });
    if (existing) {
      console.log("⚠️ Test user already exists");
      return process.exit(0);
    }

    const user = new User({
      name: "Test User",
      email: "dtikone5@gmail.com",
      password: "123456", // Will be hashed by the model
    });

    await user.save();
    console.log("✅ Test user created:", user.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedUser();