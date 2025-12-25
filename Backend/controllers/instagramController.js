import fetch from "node-fetch"; // or native fetch

export const getInstagramPosts = async (req, res) => {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    const response = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,permalink&access_token=${accessToken}`
    );
    const data = await response.json();

    res.json(data.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Instagram posts" });
  }
};
