import express from "express";
import Registration from "../models/Registration.js";

const router = express.Router();

// GET all registrations (ADMIN ONLY)
router.get("/", async (req, res) => {
  try {
    const data = await Registration.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
