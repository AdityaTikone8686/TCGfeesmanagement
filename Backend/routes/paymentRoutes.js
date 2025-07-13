import express from "express";
import {
  addPayment,
  getAllPayments,
  getPaymentsByUser,
  updatePayment,
  deletePayment,
  getPaymentsByUserEmail,
} from "../controllers/paymentControllers.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import  validatePaymentInput  from "../middleware/validatePayment.js";

const router = express.Router();

// Add payment (Admin only)
router.post("/", protect, adminOnly, validatePaymentInput, addPayment);

// Payments by user email
router.get("/by-email/:email", protect, getPaymentsByUserEmail);

// All payments (Admin only)
router.get("/", protect, adminOnly, getAllPayments);

// Payments by user ID
router.get("/by-user/:id", protect, getPaymentsByUser);

// Update and delete (Admin only)
router.put("/:id", protect, adminOnly, updatePayment);
router.delete("/:id", protect, adminOnly, deletePayment);

export default router;
