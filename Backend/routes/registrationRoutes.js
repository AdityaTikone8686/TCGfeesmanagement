import express from "express";
import Registration from "../models/Registration.js";

const router = express.Router();

// POST: register student
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const newStudent = new Registration({
      ...data,
      createdAt: new Date(),
    });

    await newStudent.save();

    res.json({
      success: true,
      refNum: data.refNum,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register" });
  }
});

// GET all students (for admin)
router.get("/", async (req, res) => {
  const students = await Registration.find().sort({ createdAt: -1 });
  res.json(students);
});

export default router;
