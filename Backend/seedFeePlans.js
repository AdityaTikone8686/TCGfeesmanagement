import mongoose from "mongoose";
import FeePlan from "./models/feePlan.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedFeePlans = async () => {
  try {
    // Clear existing fee plans
    await FeePlan.deleteMany({});
    console.log("Cleared existing fee plans");

    // Create sample fee plans
    const feePlans = [
      {
        planName: "Monthly Plan",
        amount: 1000,
        durationInDays: 30,
        description: "Monthly cricket training subscription"
      },
      {
        planName: "Quarterly Plan",
        amount: 2500,
        durationInDays: 90,
        description: "3-month cricket training subscription"
      },
      {
        planName: "Half Yearly Plan",
        amount: 4500,
        durationInDays: 180,
        description: "6-month cricket training subscription"
      },
      {
        planName: "Yearly Plan",
        amount: 8000,
        durationInDays: 365,
        description: "Annual cricket training subscription"
      },
      {
        planName: "Weekly Plan",
        amount: 300,
        durationInDays: 7,
        description: "Weekly cricket training subscription"
      }
    ];

    const createdPlans = await FeePlan.insertMany(feePlans);
    console.log("Fee plans seeded successfully:");
    createdPlans.forEach(plan => {
      console.log(`- ${plan.planName}: ₹${plan.amount} (${plan.durationInDays} days)`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding fee plans:", error);
    process.exit(1);
  }
};

// Run the seeding
connectDB().then(() => {
  seedFeePlans();
}); 