import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    overs: { type: Number, default: 5 },
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
