import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Hardcoded admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
});

export default router;
