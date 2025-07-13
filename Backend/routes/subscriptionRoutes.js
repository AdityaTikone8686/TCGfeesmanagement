import express from "express";
import {
  createSubscription,
  getAllSubscriptions,
  getUserSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription
} from "../controllers/subscriptionController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔁 CRUD Routes (Admin only)
router.post("/", protect, adminOnly, createSubscription);                // Create
router.get("/", protect, adminOnly, getAllSubscriptions);                // Read all
router.get("/user", protect, getUserSubscriptions);                      // Get user's subscriptions
router.get("/:id", protect, getSubscriptionById);                        // Read one (user can view their own)
router.put("/:id", protect, adminOnly, updateSubscription);              // Update
router.delete("/:id", protect, adminOnly, deleteSubscription);           // Delete

export default router;
