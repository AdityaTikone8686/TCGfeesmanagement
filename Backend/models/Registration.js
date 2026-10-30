import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({

  // ==========================================
  // EXISTING REGISTRATION FIELDS
  // ==========================================

  refNum: {
    type: String,
    index: true
  },

  fname: String,
  lname: String,
  dob: String,
  gender: String,
  parent: String,
  phone: {
    type: String,
    index: true
  },
  email: {
    type: String,
    index: true
  },
  address: String,
  level: String,
  role: String,
  batch: String,
  duration: String,
  notes: String,

  createdAt: {
    type: Date,
    default: Date.now
  },

  // ==========================================
  // ADMISSION STATUS MANAGEMENT
  // ==========================================

  status: {
    type: String,
    enum: [
      "pending",
      "under_review",
      "approved",
      "rejected",
      "waitlisted",
      "payment_pending",
      "payment_submitted",
      "payment_verified",
      "admission_confirmed"
    ],
    default: "pending",
    index: true
  },

  statusUpdatedAt: {
    type: Date
  },

  adminRemarks: {
    type: String,
    default: ""
  },

  // ==========================================
  // APPROVAL DETAILS
  // ==========================================

  approvedBy: {
    type: mongoose.Schema.Types.Mixed
  },

  approvedAt: {
    type: Date
  },

  // ==========================================
  // REJECTION DETAILS
  // ==========================================

  rejectedBy: {
    type: mongoose.Schema.Types.Mixed
  },

  rejectedAt: {
    type: Date
  },

  rejectionReason: {
    type: String
  },

  // ==========================================
  // WAITLIST DETAILS
  // ==========================================

  waitlistReason: {
    type: String
  },

  // ==========================================
  // BATCH ASSIGNMENT
  // ==========================================

  assignedBatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    default: null
  },

  batchName: {
    type: String
  },

  // ==========================================
  // FEE PLAN
  // ==========================================

  feePlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeePlan",
    default: null
  },

  // ==========================================
  // STUDENT CONVERSION
  // ==========================================

  convertedStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  convertedAt: {
    type: Date
  }

}, {
  versionKey: '__v',
  timestamps: true
});

export default mongoose.model("Registration", registrationSchema);
