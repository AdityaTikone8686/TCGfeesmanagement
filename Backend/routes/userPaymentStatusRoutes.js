import express from "express";
import { getUserPaymentStatus } from "../controllers/UserPaymentStatusController.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/:email", protect, getUserPaymentStatus);

export default router;
