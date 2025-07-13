import Payment from "../models/Payment.js";
import User from "../models/User.js";

// ➕ Add a new payment
export const addPayment = async (req, res, next) => {
  try {
    const { user, amount, email, description } = req.body;
    if (!user || !email || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment data" });
    }
    const payment = new Payment({ user, amount, email, description });
    await payment.save();
    res.status(201).json({
      message: "Payment recorded successfully",
      payment,
    });
  } catch (err) {
    next(err);
  }
};

// 🔍 Get all payments (Admin Only)
export const getAllPayments = async (req, res, next) => {
  const admin = req.admin;
  if (!admin || !admin.isAdmin) {
    return res.status(403).json({ message: "Not an admin" });
  }
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ payments });
  } catch (err) {
    next(err);
  }
};

// 🔍 Get payments by user ID
export const getPaymentsByUser = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.params.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ payments });
  } catch (err) {
    next(err);
  }
};

// ✏️ Update payment
export const updatePayment = async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    const updateFields = {};
    if (amount !== undefined && typeof amount === "number" && amount >= 0)
      updateFields.amount = amount;
    if (description) updateFields.description = description;
    const updated = await Payment.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment updated", payment: updated });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Delete payment
export const deletePayment = async (req, res, next) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted" });
  } catch (err) {
    next(err);
  }
};

// 📧 Get payments by user email (for logged-in user only)
export const getPaymentsByUserEmail = async (req, res, next) => {
  const tokenEmail = req.user.email;
  const paramEmail = req.params.email;
  if (!tokenEmail) {
    return res.status(401).json({ message: "Email not found in token" });
  }
  if (tokenEmail.toLowerCase() !== paramEmail.toLowerCase()) {
    return res.status(403).json({ message: "Forbidden: Email mismatch" });
  }
  try {
    const user = await User.findOne({ email: paramEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const payments = await Payment.find({ user: user._id });
    res.json({ payments });
  } catch (err) {
    next(err);
  }
};
