import express from "express";
import {
  createPaymentRequest,
  getAllPaymentRequests,
  getUserPaymentRequests,
  getPaymentRequest,
  approvePaymentRequest,
  rejectPaymentRequest,
  deletePaymentRequest,
} from "../controllers/paymentRequestControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { userProtect } from "../middleware/userAuthMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// User routes (protected)
router.post("/", userProtect, upload.single("screenshot"), createPaymentRequest);
router.get("/user", userProtect, getUserPaymentRequests);
router.get("/user/:id", userProtect, getPaymentRequest);

// Admin routes (protected)
router.get("/", protect, adminOnly, getAllPaymentRequests);
router.get("/:id", protect, adminOnly, getPaymentRequest);
router.put("/:id/approve", protect, adminOnly, approvePaymentRequest);
router.put("/:id/reject", protect, adminOnly, rejectPaymentRequest);
router.delete("/:id", protect, adminOnly, deletePaymentRequest);

export default router; 