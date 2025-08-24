import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";

//  Generate JWT token
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//  User Registration
export const registerUser = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      role: "user",
    });
    const token = generateToken(newUser._id, newUser.email, newUser.role);
    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

//  User Login
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id, user.email, user.role);
    res.json({
      token,
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

// 💳 Get User Payment Status
export const getUserPaymentStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: "activeSubscription",
      populate: {
        path: "plan",
        select: "planName amount description durationInDays"
      }
    });
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (!user.activeSubscription) {
      return res.json({
        subscription: null,
        status: "No active subscription",
        message: "Please subscribe to a plan"
      });
    }

    const subscription = user.activeSubscription;
    const payments = await Payment.find({ user: user._id }).sort({ createdAt: -1 });
    
    const totalFee = subscription.plan.amount || 0;
    const paid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const due = Math.max(totalFee - paid, 0);
    const lastPayment = payments[0]?.createdAt || null;
    
    const status =
      totalFee === 0
        ? "N/A"
        : paid >= totalFee
        ? "Paid"
        : paid > 0
        ? "Partially Paid"
        : "Pending";

    res.json({
      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status,
      },
      paid,
      due,
      status,
      lastPayment,
    });
  } catch (err) {
    next(err);
  }
};

// 🟢 Get User Status
export const getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "activeSubscription",
      populate: {
        path: "plan",
        select: "planName amount description durationInDays"
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get subscription status
    let subscription = null;
    if (user.activeSubscription) {
      // Check if subscription has expired
      const now = new Date();
      if (user.activeSubscription.status === 'active' && user.activeSubscription.endDate < now) {
        // Update subscription status to expired
        await Subscription.findByIdAndUpdate(user.activeSubscription._id, { status: 'expired' });
        user.activeSubscription.status = 'expired';
        
        // Remove expired subscription from user's activeSubscription
        await User.findByIdAndUpdate(user._id, { $unset: { activeSubscription: "" } });
        user.activeSubscription = null;
      }
      
      subscription = {
        id: user.activeSubscription._id,
        plan: user.activeSubscription.plan,
        startDate: user.activeSubscription.startDate,
        endDate: user.activeSubscription.endDate,
        status: user.activeSubscription.status,
      };
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      subscription: subscription,
    });
  } catch (error) {
    next(error);
  }
};


