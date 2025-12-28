import express from "express";
import Match from "../models/Match.js";

const router = express.Router();

// 🔓 Public – get all matches
router.get("/", async (req, res) => {
  const matches = await Match.find().sort({ createdAt: -1 });
  res.json(matches);
});

// 🔐 Admin – create match
router.post("/", async (req, res) => {
  const match = new Match(req.body);
  await match.save();
  res.status(201).json(match);
});

// 🔐 Admin – update match
router.put("/:id", async (req, res) => {
  const updated = await Match.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// 🔐 Admin – delete match
router.delete("/:id", async (req, res) => {
  await Match.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;


