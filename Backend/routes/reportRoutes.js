import express from "express";
import { getReportSummary } from "../controllers/reportControllers.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ import auth middleware

const router = express.Router();

// 🔒 Auth-protected summary endpoint
router.get("/summary", protect, getReportSummary);

export default router;