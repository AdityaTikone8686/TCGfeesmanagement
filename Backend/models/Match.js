import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    teamA: {
      type: String,
      required: true,
    },
    teamB: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    overs: {
      type: Number,
      required: true,
    },
    liveLink: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "finished"],
      default: "scheduled",
    },
    score: {
      teamA: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
      },
      teamB: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
      },
    },
    winner: { type: String },
    loser: { type: String },
    currentOver: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;


