import express from "express";
import { getInstagramPosts } from "../controllers/instagramController.js";

const router = express.Router();

// GET /api/instagram
router.get("/", getInstagramPosts);

export default router;
