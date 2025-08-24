import PaymentRequest from "../models/PaymentRequest.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Admin from "../models/Admin.js";
import Subscription from "../models/Subscription.js";
import FeePlan from "../models/feePlan.js";

// Create new payment request
export const createPaymentRequest = async (req, res, next) => {
  try {
    const { amount, description, paymentMethod, transactionId, feePlanId } = req.body;
    let screenshot = req.file?.path; // Could be Cloudinary URL or local path

    if (!amount || !description || !screenshot) {
      return res.status(400).json({ 
        message: "Amount, description, and screenshot are required" 
      });
    }

    // If using local storage, convert to accessible URL
    if (screenshot && !screenshot.startsWith('http')) {
      // For local storage, we'll use a relative path that can be served statically
      screenshot = `/uploads/${req.file.filename}`;
    }

    const paymentRequest = await PaymentRequest.create({
      user: req.user.id,
      amount: parseFloat(amount),
      description,
      screenshot,
      paymentMethod: paymentMethod || "UPI",
      transactionId: transactionId || "",
      feePlan: feePlanId || null,
    });

    const populatedRequest = await PaymentRequest.findById(paymentRequest._id)
      .populate("user", "name email phone")
      .populate("feePlan", "planName amount durationInDays");

    res.status(201).json({
      message: "Payment request submitted successfully",
      paymentRequest: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Get all payment requests (admin only)
export const getAllPaymentRequests = async (req, res, next) => {
  try {
    const paymentRequests = await PaymentRequest.find({})
      .populate("user", "name email phone")
      .populate("approvedBy", "name email")
      .populate("feePlan", "planName amount durationInDays")
      .sort({ createdAt: -1 });

    res.json(paymentRequests);
  } catch (error) {
    next(error);
  }
};

// Get user's payment requests
export const getUserPaymentRequests = async (req, res, next) => {
  try {
    const paymentRequests = await PaymentRequest.find({ user: req.user.id })
      .populate("approvedBy", "name email")
      .populate("feePlan", "planName amount durationInDays")
      .sort({ createdAt: -1 });

    res.json(paymentRequests);
  } catch (error) {
    next(error);
  }
};

// Get single payment request
export const getPaymentRequest = async (req, res, next) => {
  try {
    const paymentRequest = await PaymentRequest.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("approvedBy", "name email")
      .populate("feePlan", "planName amount durationInDays");

    if (!paymentRequest) {
      return res.status(404).json({ message: "Payment request not found" });
    }

    res.json(paymentRequest);
  } catch (error) {
    next(error);
  }
};

// Approve payment request (admin only)
export const approvePaymentRequest = async (req, res, next) => {
  try {
    const { adminNotes, transactionId } = req.body;
    const paymentRequest = await PaymentRequest.findById(req.params.id)
      .populate("user", "name email phone");

    if (!paymentRequest) {
      return res.status(404).json({ message: "Payment request not found" });
    }

    if (paymentRequest.status !== "pending") {
      return res.status(400).json({ 
        message: `Payment request has already been ${paymentRequest.status}. Cannot process again.` 
      });
    }

    // Use the selected fee plan or find matching fee plan based on payment amount
    let feePlan;
    if (paymentRequest.feePlan) {
      feePlan = await FeePlan.findById(paymentRequest.feePlan);
    } else {
      feePlan = await FeePlan.findOne({ amount: paymentRequest.amount });
    }
    
    if (!feePlan) {
      return res.status(400).json({ 
        message: `No fee plan found for this payment. Please ensure a fee plan is selected or create a fee plan with amount ${paymentRequest.amount}.` 
      });
    }

    // Update payment request status
    paymentRequest.status = "approved";
    paymentRequest.adminNotes = adminNotes || "";
    paymentRequest.approvedBy = req.user.id;
    paymentRequest.approvedAt = new Date();
    paymentRequest.transactionId = transactionId || paymentRequest.transactionId;

    await paymentRequest.save();
    // console.log(paymentRequest);
    // Create payment record
    const payment = await Payment.create({
      user: paymentRequest.user._id,
      amount: paymentRequest.amount,
      email: paymentRequest.user.email,
      description: paymentRequest.description,
      method: paymentRequest.paymentMethod.toLowerCase() || "upi",
      transactionId: paymentRequest.transactionId,
    });

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + feePlan.durationInDays);

    // Create subscription
    const subscription = await Subscription.create({
      user: paymentRequest.user._id,
      plan: feePlan._id,
      startDate,
      endDate,
      payment: payment._id,
      status: "active",
    });

    // Update payment with subscription reference
    await Payment.findByIdAndUpdate(payment._id, {
      subscription: subscription._id
    });

    // Update user's active subscription
    await User.findByIdAndUpdate(paymentRequest.user._id, {
      activeSubscription: subscription._id
    });

    // Populate the response data
    const populatedPaymentRequest = await PaymentRequest.findById(paymentRequest._id)
      .populate("user", "name email phone")
      .populate("approvedBy", "name email")
      .populate("feePlan", "planName amount durationInDays");

    const populatedSubscription = await Subscription.findById(subscription._id)
      .populate("plan", "planName amount durationInDays")
      .populate("payment");

    res.json({
      message: "Payment request approved and subscription created successfully",
      paymentRequest: populatedPaymentRequest,
      payment,
      subscription: populatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

// Reject payment request (admin only)
export const rejectPaymentRequest = async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    const paymentRequest = await PaymentRequest.findById(req.params.id);

    if (!paymentRequest) {
      return res.status(404).json({ message: "Payment request not found" });
    }

    if (paymentRequest.status !== "pending") {
      return res.status(400).json({ 
        message: `Payment request has already been ${paymentRequest.status}. Cannot process again.` 
      });
    }

    paymentRequest.status = "rejected";
    paymentRequest.adminNotes = adminNotes || "";
    paymentRequest.approvedBy = req.user.id;
    paymentRequest.approvedAt = new Date();

    await paymentRequest.save();

    res.json({
      message: "Payment request rejected",
      paymentRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Delete payment request (admin only)
export const deletePaymentRequest = async (req, res, next) => {
  try {
    const paymentRequest = await PaymentRequest.findByIdAndDelete(req.params.id);

    if (!paymentRequest) {
      return res.status(404).json({ message: "Payment request not found" });
    }

    res.json({ message: "Payment request deleted successfully" });
  } catch (error) {
    next(error);
  }
}; 