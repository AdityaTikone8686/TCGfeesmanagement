import express from "express";
import Match from "../models/Match.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* GET all matches */
router.get("/", async (req, res) => {
  const matches = await Match.find().sort({ date: 1 });
  res.json(matches);
});

/* ADD match (admin) */
router.post("/", adminAuth, async (req, res) => {
  const match = await Match.create(req.body);
  res.status(201).json(match);
});

/* UPDATE match (admin) */
router.put("/:id", adminAuth, async (req, res) => {
  const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(match);
});

/* DELETE match (admin) */
router.delete("/:id", adminAuth, async (req, res) => {
  await Match.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;


