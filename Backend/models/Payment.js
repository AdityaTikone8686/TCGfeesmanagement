import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    enum: ['cash', 'online', 'upi'],
    default: 'cash',
  },
  email: String,
  description: String,
  transactionId: String,

  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },
}, {
  timestamps: true,
});

export default mongoose.model("Payment", paymentSchema);
