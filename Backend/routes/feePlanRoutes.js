import express from "express";
import {
  createFeePlan,
  getAllFeePlans,
  updateFeePlan,
  deleteFeePlan,
} from "../controllers/feePlanControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createFeePlan);           // POST /api/feeplans
router.get("/", protect, adminOnly, getAllFeePlans);           // GET /api/feeplans
router.get("/public", getAllFeePlans);                         // GET /api/feeplans/public (public access)
router.put("/:id", protect, adminOnly, updateFeePlan);         // PUT /api/feeplans/:id
router.delete("/:id", protect, adminOnly, deleteFeePlan);      // DELETE /api/feeplans/:id

export default router;