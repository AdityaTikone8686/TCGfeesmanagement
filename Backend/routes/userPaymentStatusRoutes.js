import express from "express";
import { getUserPaymentStatus } from "../controllers/userPaymentStatusController.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/:email", protect, getUserPaymentStatus);

export default router;
