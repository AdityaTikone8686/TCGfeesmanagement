import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    teamA: String,
    teamB: String,
    date: String,
    time: String,
    overs: Number,
    status: {
      type: String,
      enum: ["scheduled", "live", "finished"],
      default: "scheduled",
    },
    runs: {
      teamA: { type: Number, default: 0 },
      teamB: { type: Number, default: 0 },
    },
    currentOver: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
