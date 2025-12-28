import Match from "../models/Match.js";
import { getIO } from "../socket.js"; // import socket instance

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: 1 });

    const now = new Date();

    for (let match of matches) {
      const matchTime = new Date(`${match.date}T${match.time}:00`);

      // ⚡ Auto-live by time
      if (match.status === "scheduled" && now >= matchTime) {
        match.status = "live";
        await match.save();

        // 🔴 Emit socket event after auto-live change
        const io = getIO();
        io.emit("matchesUpdated");
      }
    }

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch matches" });
  }
};

// 🔴 Update live score (ADMIN ONLY)
export const updateLiveScore = async (req, res) => {
  try {
    const { team, runs, wickets, over } = req.body;

    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (!match.score) {
      match.score = {
        teamA: { runs: 0, wickets: 0 },
        teamB: { runs: 0, wickets: 0 },
      };
    }

    // Update score
    match.score[team].runs = runs;
    match.score[team].wickets = wickets;
    match.currentOver = over;
    match.status = "live"; // force live when score updates

    await match.save();

    // 🔴 Emit socket event after live score update
    const io = getIO();
    io.emit("matchesUpdated");

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: "Failed to update live score" });
  }
};

