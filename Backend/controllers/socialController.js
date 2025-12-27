import SocialPost from "../models/SocialPost.js";

export const createPost = async (req, res) => {
  try {
    const { mediaUrl, mediaType, caption } = req.body;

    const post = await SocialPost.create({
      mediaUrl,
      mediaType,
      caption
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await SocialPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
