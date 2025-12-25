// routes/instagram.js
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", async (req, res) => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type&access_token=${process.env.INSTAGRAM_TOKEN}`
    );
    const data = await response.json();
    res.json(data.data); // return array of posts
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Instagram posts" });
  }
});

module.exports = router;
