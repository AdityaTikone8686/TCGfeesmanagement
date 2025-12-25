const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get Instagram posts
router.get('/', async (req, res) => {
  try {
    // Long-lived token (server-side only)
    const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

    // Fetch posts from Instagram Graph API
    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    );

    res.json(response.data); // send to frontend
  } catch (error) {
    console.error('Error fetching Instagram posts:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
});

module.exports = router;
