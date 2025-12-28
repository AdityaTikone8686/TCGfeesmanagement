import Match from "../models/Match.js";

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
      }
    }

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch matches" });
  }
};
