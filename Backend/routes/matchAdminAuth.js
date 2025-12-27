import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const ADMIN_EMAIL = process.env.MATCHES_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.MATCHES_ADMIN_PASSWORD;

// POST /api/matches-admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, isAdmin: true },
      process.env.MATCHES_JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid matches admin credentials" });
});

export default router;
