import mongoose from "mongoose";

const socialPostSchema = new mongoose.Schema(
  {
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    caption: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("SocialPost", socialPostSchema);
