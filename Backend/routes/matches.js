import express from "express";
import Match from "../models/Match.js";
import { matchesAdminAuth } from "../middleware/matchesAuth.js";

const router = express.Router();

/**
 * 🔓 PUBLIC
 * Anyone can view matches (mobile + laptop)
 */
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch matches" });
  }
});

/**
 * 🔐 ADMIN ONLY
 * Create match
 */
router.post("/", matchesAdminAuth, async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ message: "Failed to create match" });
  }
});

/**
 * 🔐 ADMIN ONLY
 * Update match (score, overs, status, teams, etc.)
 */
router.put("/:id", matchesAdminAuth, async (req, res) => {
  try {
    const updated = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update match" });
  }
});

/**
 * 🔐 ADMIN ONLY
 * Delete match
 */
router.delete("/:id", matchesAdminAuth, async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete match" });
  }
});

export default router;


