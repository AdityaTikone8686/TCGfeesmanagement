import express from "express";
import matchesStore from "../data/matchesStore.js";
import { requireMatchesAdmin } from "../middleware/matchesAuth.js";

const router = express.Router();

// GET all matches (public)
router.get("/", (req, res) => {
  res.json(matchesStore);
});

// CREATE match (admin only)
router.post("/", requireMatchesAdmin, (req, res) => {
  const match = {
    id: Date.now(),
    ...req.body,
    status: "scheduled",
    runs: { teamA: 0, teamB: 0 },
    currentOver: 0,
  };

  matchesStore.push(match);
  res.status(201).json(match);
});

// UPDATE match (admin only)
router.put("/:id", requireMatchesAdmin, (req, res) => {
  const id = Number(req.params.id);
  const index = matchesStore.findIndex((m) => m.id === id);
  if (index !== -1) {
    matchesStore[index] = { ...matchesStore[index], ...req.body };
    res.json({ success: true });
  } else {
    res.status(404).json({ message: "Match not found" });
  }
});

// DELETE match (admin only)
router.delete("/:id", requireMatchesAdmin, (req, res) => {
  const id = Number(req.params.id);
  matchesStore = matchesStore.filter((m) => m.id !== id);
  res.json({ success: true });
});

export default router;


