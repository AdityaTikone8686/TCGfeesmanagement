import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Hardcoded Matches admin credentials (can be different from fees admin)
const MATCHES_ADMIN_EMAIL = process.env.MATCHES_ADMIN_EMAIL;
const MATCHES_ADMIN_PASSWORD = process.env.MATCHES_ADMIN_PASSWORD;

// POST /api/matches-admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === MATCHES_ADMIN_EMAIL && password === MATCHES_ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, isAdmin: true },
      process.env.MATCHES_JWT_SECRET, // Separate secret
      { expiresIn: "1d" }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
});

export default router;
