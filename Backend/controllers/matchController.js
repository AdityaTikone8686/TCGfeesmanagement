import Match from "../models/Match.js";
import { getIO } from "../socket.js"; // import socket instance

// ---------------- GET ALL MATCHES ----------------
export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: 1 });
    const now = new Date();

    for (let match of matches) {
      const matchTime = new Date(`${match.date}T${match.time}:00`);

      // ⚡ Auto-ongoing by time
      if (match.status === "scheduled" && now >= matchTime) {
        match.status = "ongoing";
        await match.save();

        // 🔴 Emit socket event after auto status change
        const io = getIO();
        io.emit("matchesUpdated");
      }
    }

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
};

// ---------------- START MATCH (ADMIN) ----------------
export const startMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    match.status = "ongoing";
    await match.save();

    const io = getIO();
    io.emit("matchesUpdated");

    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to start match" });
  }
};

// ---------------- END MATCH (ADMIN) ----------------
export const endMatch = async (req, res) => {
  try {
    const { winner, loser, scoreA, scoreB } = req.body;

    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    match.status = "finished";
    match.winner = winner;
    match.loser = loser;

    if (!match.score) {
      match.score = { teamA: { runs: 0, wickets: 0 }, teamB: { runs: 0, wickets: 0 } };
    }

    match.score.teamA.runs = scoreA?.runs || 0;
    match.score.teamA.wickets = scoreA?.wickets || 0;
    match.score.teamB.runs = scoreB?.runs || 0;
    match.score.teamB.wickets = scoreB?.wickets || 0;

    await match.save();

    const io = getIO();
    io.emit("matchesUpdated");

    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to end match" });
  }
};

// ---------------- UPDATE MATCH (ADMIN) ----------------
export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!match) return res.status(404).json({ message: "Match not found" });

    const io = getIO();
    io.emit("matchesUpdated");

    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update match" });
  }
};

// ---------------- DELETE MATCH (ADMIN) ----------------
export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const io = getIO();
    io.emit("matchesUpdated");

    res.json({ message: "Match deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete match" });
  }
};


