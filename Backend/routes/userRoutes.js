import express from "express";
import {
  loginUser,
  getUserPaymentStatus,
  registerUser,
  getUserStatus,
} from "../controllers/userControllers.js";

import { userProtect } from "../middleware/userAuthMiddleware.js";

const router = express.Router();

// 🔐 Login Route
router.post("/login", loginUser);

// 🟢 Register Route
router.post("/register", registerUser);

// 🟢 User Status
router.get("/status", userProtect, getUserStatus);

export default router;
