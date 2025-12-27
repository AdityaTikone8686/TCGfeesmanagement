import express from "express";
import requireAdmin from "../middleware/requireAdmin.js";
import matches from "../data/matchesStore.js";

const router = express.Router();

// GET all matches (PUBLIC)
router.get("/", (req, res) => {
  res.json(matches);
});

// CREATE match (ADMIN)
router.post("/", requireAdmin, (req, res) => {
  const match = {
    id: Date.now(),
    ...req.body,
    status: "scheduled",
    runs: { teamA: 0, teamB: 0 },
    currentOver: 0,
  };

  matches.push(match);
  res.status(201).json(match);
});

// UPDATE match (ADMIN)
router.put("/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  matches = matches.map((m) =>
    m.id === id ? { ...m, ...req.body } : m
  );
  res.json({ success: true });
});

// DELETE match (ADMIN)
router.delete("/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  matches = matches.filter((m) => m.id !== id);
  res.json({ success: true });
});

export default router;

