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
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "finished"], // updated
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
    winner: { type: String }, // added
    loser: { type: String },   // added
    currentOver: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;


const Match = mongoose.model("Match", matchSchema);
export default Match;

