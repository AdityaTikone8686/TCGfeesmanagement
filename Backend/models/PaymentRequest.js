import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    screenshot: {
      type: String, // Cloudinary URL
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    approvedAt: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      default: "upi",
    },
    transactionId: {
      type: String,
      default: "",
    },
    feePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeePlan",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentRequest", paymentRequestSchema); 