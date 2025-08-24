import Subscription from "../models/Subscription.js";
import FeePlan from "../models/feePlan.js";
import User from "../models/User.js";

// Create a new subscription
export const createSubscription = async (req, res, next) => {
  try {
    const { userId, planId, paymentId } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({ message: "userId and planId are required" });
    }

    const plan = await FeePlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Fee plan not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationInDays);

    const subscription = await Subscription.create({
      user: userId,
      plan: planId,
      startDate,
      endDate,
      payment: paymentId,
      status: "active",
    });

    // Update user's activeSubscription
    await User.findByIdAndUpdate(userId, { activeSubscription: subscription._id });

    res.status(201).json(subscription);
  } catch (err) {
    next(err);
  }
};

// 📌 Get all subscriptions (admin or reporting)
export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subs = await Subscription.find()
      .populate("user", "name email phone")
      .populate("plan", "planName amount durationInDays")
      .populate("payment");

    res.status(200).json(subs);
  } catch (err) {
    next(err);
  }
};

// 📌 Get user's subscriptions
export const getUserSubscriptions = async (req, res, next) => {
  try {
    const subs = await Subscription.find({ user: req.user.id })
      .populate("plan", "planName amount durationInDays")
      .populate("payment")
      .sort({ createdAt: -1 });

    // Check and update expired subscriptions
    const now = new Date();
    for (let sub of subs) {
      if (sub.status === 'active' && sub.endDate < now) {
        sub.status = 'expired';
        await sub.save();
        
        // Remove expired subscription from user's activeSubscription if it's the current one
        await User.findByIdAndUpdate(req.user.id, { $unset: { activeSubscription: "" } });
      }
    }

    res.status(200).json(subs);
  } catch (err) {
    next(err);
  }
};

// 📌 Get a single subscription by ID
export const getSubscriptionById = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("plan")
      .populate("payment");

    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json(sub);
  } catch (err) {
    next(err);
  }
};

// 📌 Update subscription status (e.g., cancel, expire)
export const updateSubscription = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !["active", "expired", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }

    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// 📌 Delete a subscription
export const deleteSubscription = async (req, res, next) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Subscription not found" });

    // Remove reference from user
    await User.findOneAndUpdate(
      { activeSubscription: req.params.id },
      { $unset: { activeSubscription: "" } }
    );

    res.status(200).json({ message: "Subscription deleted" });
  } catch (err) {
    next(err);
  }
};
