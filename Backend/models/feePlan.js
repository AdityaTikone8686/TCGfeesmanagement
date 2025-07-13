import mongoose from "mongoose";

const feePlanSchema = new mongoose.Schema({
  planName: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  description: { type: String },
  durationInDays: { type: Number, required: true },  // 30, 90, etc.
}, { timestamps: true });

export default mongoose.model("FeePlan", feePlanSchema);
