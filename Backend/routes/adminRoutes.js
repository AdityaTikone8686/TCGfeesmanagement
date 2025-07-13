import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

import {
	loginAdmin,
	getAllStudents,
	getAllPayments,
	getAllFeePlans,
	createStudent,
	deleteStudent,
	updateStudent,
	getAdminStatus,
	updateAdminPassword
} from "../controllers/adminControllers.js";


import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Admin Login
router.post("/login", loginAdmin);

// 🟢 Admin Status
router.get("/status", protect, adminOnly, getAdminStatus);

// ✅ Admin Registration (with isAdmin: true)
router.post("/register", async (req, res, next) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return next({ statusCode: 400, message: "All fields are required" });
	}

	try {
		const existing = await Admin.findOne({ email });
		if (existing) {
			return next({ statusCode: 400, message: "Admin already exists" });
		}

		const admin = await Admin.create({
			name,
			email,
			password,
			isAdmin: true,
		});

		const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "7d" });

		res.status(201).json({
			token,
			admin: {
				id: admin._id,
				name: admin.name,
				email: admin.email,
				isAdmin: admin.isAdmin,
			},
		});
	} catch (error) {
		next(error);
	}
});

// ✅ Protected Admin Routes
router.get("/students", protect, adminOnly, getAllStudents);
router.get("/payments", protect, adminOnly, getAllPayments);
router.get("/feeplans", protect, adminOnly, getAllFeePlans);

// ➕ Create student with linked fee plan
router.post("/students", protect, adminOnly, createStudent);

// Delete student 
router.delete("/students/:id", protect, adminOnly, deleteStudent);

// Update student 
router.put("/students/:id", protect, adminOnly, updateStudent);

// 🔐 Update Admin Password
router.put("/password", protect, adminOnly, updateAdminPassword);

export default router;
