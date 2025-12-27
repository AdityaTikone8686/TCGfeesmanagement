import express from "express";
import axios from "axios";

const router = express.Router();

// Get Instagram posts
router.get("/", async (req, res) => {
  try {
    const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!INSTAGRAM_ACCESS_TOKEN) {
      return res.status(500).json({ error: "Instagram access token missing" });
    }

    const response = await axios.get(
      `https://graph.instagram.com/me/media`,
      {
        params: {
          fields: "id,caption,media_type,media_url,permalink,thumbnail_url",
          access_token: INSTAGRAM_ACCESS_TOKEN
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching Instagram posts:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch Instagram posts" });
  }
});

export default router;
