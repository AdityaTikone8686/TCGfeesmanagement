import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema(
  {
    // Existing user payment support
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // Link payment request to an admission registration
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      default: null,
      index: true
    },

    amount: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    // Optional until payment proof is submitted
    screenshot: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    adminNotes: {
      type: String,
      default: ""
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },

    approvedAt: {
      type: Date
    },

    paymentMethod: {
      type: String,
      default: "upi"
    },

    transactionId: {
      type: String,
      default: ""
    },

    feePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeePlan"
    },

    // Admission management fields
    createdByAdmin: {
      type: mongoose.Schema.Types.Mixed
    },

    proofSubmittedAt: {
      type: Date
    },

    proofRecordedBy: {
      type: mongoose.Schema.Types.Mixed
    },

    verifiedBy: {
      type: mongoose.Schema.Types.Mixed
    },

    verifiedAt: {
      type: Date
    },

    rejectionReason: {
      type: String,
      default: ""
    },

    rejectedBy: {
      type: mongoose.Schema.Types.Mixed
    },

    rejectedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("PaymentRequest", paymentRequestSchema);
