import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // EXISTING USER FIELDS
    // ==========================================

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    // ==========================================
    // USER ROLE AND STATUS
    // ==========================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    status: {
      type: String,
      enum: ["active", "inactive", "cancelled"],
      default: "active"
    },

    // ==========================================
    // SUBSCRIPTION
    // ==========================================

    activeSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },

    // ==========================================
    // STUDENT MANAGEMENT
    // ==========================================

    studentId: {
      type: String,
      unique: true,
      sparse: true
    },

    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration"
    },

    registrationRef: {
      type: String
    },

    batch: {
      type: String
    },

    assignedBatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch"
    }

  },
  {
    timestamps: true
  }
);

// ==========================================
// HASH PASSWORD ONLY WHEN MODIFIED
// ==========================================

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();
  } catch (error) {
    next(error);
  }
});

// ==========================================
// PASSWORD MATCH
// ==========================================

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};

export default mongoose.model("User", userSchema);
