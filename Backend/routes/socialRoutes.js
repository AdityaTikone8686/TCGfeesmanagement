import express from "express";
import { createPost, getPosts } from "../controllers/socialController.js";

const router = express.Router();

router.post("/", createPost); // Admin upload
router.get("/", getPosts);    // Website display

export default router;
