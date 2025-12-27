const express = require("express");
const router = express.Router();
let matches = require("../data/matchesStore");
const { requireAdmin } = require("../middleware/auth");

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

module.exports = router;
