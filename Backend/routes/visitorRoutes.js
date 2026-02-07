import express from "express";
import Visitor from "../models/Visitor.js";

const router = express.Router();

// Track visit + heartbeat
router.post("/track", async (req, res) => {
  const { visitorId } = req.body;

  await Visitor.findOneAndUpdate(
    { visitorId },
    { lastActive: new Date() },
    { upsert: true, new: true }
  );

  res.sendStatus(200);
});

// Get stats
router.get("/stats", async (req, res) => {
  const totalVisitors = await Visitor.countDocuments();

  const liveVisitors = await Visitor.countDocuments({
    lastActive: { $gte: new Date(Date.now() - 30 * 1000) },
  });

  res.json({ totalVisitors, liveVisitors });
});

export default router;
