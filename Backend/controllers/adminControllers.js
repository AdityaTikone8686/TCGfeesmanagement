import User from "../models/User.js";
import Payment from "../models/Payment.js";
import FeePlan from "../models/feePlan.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🔐 Generate JWT token
const generateToken = (id, email, isAdmin) => {
	return jwt.sign({ id, email, isAdmin }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
};

// ✅ Admin Login Controller
export const loginAdmin = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

	try {
		const admin = await Admin.findOne({ email });

		if (admin && (await admin.matchPassword(password))) {
			const token = generateToken(admin._id, admin.email, admin.isAdmin);
			const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name || admin.email)}&background=random`;

			return res.json({
				token,
				admin: {
					id: admin._id,
					name: admin.name,
					email: admin.email,
					isAdmin: admin.isAdmin,
					photoURL,
				},
			});
		} else {
			res.status(401).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		next(error);
	}
};

// 📋 Get all users with role 'user' (students)
export const getAllStudents = async (req, res, next) => {
	try {
		const students = await User.find({ role: "user" }).populate({
			path: "activeSubscription",
			populate: {
				path: "plan",
				select: "planName amount description"
			}
		});
		res.json(students);
	} catch (error) {
		next(error);
	}
};

// 💰 Get all payments
export const getAllPayments = async (req, res, next) => {
	try {
		const payments = await Payment.find({}).sort({ createdAt: -1 });
		res.json(payments);
	} catch (error) {
		next(error);
	}
};

// 💼 Get all fee plans
export const getAllFeePlans = async (req, res, next) => {
	try {
		const plans = await FeePlan.find({});
		res.json(plans);
	} catch (error) {
		next(error);
	}
};

// ➕ Create new user with role 'user'
export const createStudent = async (req, res, next) => {
	const { name, email, phone, password } = req.body;
	if (!name || !email || !phone || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		const user = await User.create({
			name,
			email,
			phone,
			password,
			role: "user",
		});
		res.status(201).json({
			message: "User created successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				role: user.role,
			},
		});
	} catch (error) {
		next(error);
	}
};

// update student Details
export const updateStudent = async (req, res, next) => {
	try {
		let id = req.params.id;
		if (!id) return res.status(404).json({ error: "Id required" });
		
		const { password, ...otherFields } = req.body;
		
		// Find the user first
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Update all fields except password
		Object.assign(user, otherFields);
		
		// If password is provided, update it (this will trigger the hashing middleware)
		if (password && password.trim() !== '') {
			user.password = password;
		}

		// console.log(user);
		
		// Save the user (this will trigger the password hashing middleware)
		await user.save();

		res.status(200).json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				role: user.role,
			}
		});
	} catch (err) {
		next(err);
	}
};

// Delete Student
export const deleteStudent = async (req, res, next) => {
	try {
		// console.log(req.params.id)
		const deleted = await User.findByIdAndDelete(req.params.id);

		if (!deleted) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(204).send();
	} catch (err) {
		next(err);
	}
};

// 🟢 Get Admin Status
export const getAdminStatus = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name || admin.email)}&background=random`;
    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
        photoURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 🔐 Update Admin Password
export const updateAdminPassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long" });
  }

  try {
    const admin = await Admin.findById(req.user.id).select("+password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify current password
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
