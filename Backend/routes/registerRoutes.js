import express from "express";
import Registration from "../models/Registration.js";

const router = express.Router();

// 🔐 GET all registrations (ADMIN ONLY)
router.get("/", async (req, res) => {
  try {
    // 🔴 Admin check
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const data = await Registration.find().sort({ createdAt: -1 });
    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
