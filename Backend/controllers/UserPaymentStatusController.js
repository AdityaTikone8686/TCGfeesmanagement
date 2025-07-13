import Payment from "../models/Payment.js";
import FeePlan from "../models/feePlan.js";
import User from "../models/User.js";

export const getUserPaymentStatus = async (req, res, next) => {
  const email = req.user?.email;

  if (!email) {
    return res.status(401).json({ message: "Unauthorized. Email not found in token." });
  }

  try {
    const user = await User.findOne({ email }).populate({
      path: "activeSubscription",
      populate: {
        path: "plan",
        select: "planName amount description"
      }
    });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.activeSubscription) {
      return res.json({
        subscription: null,
        amount: 0,
        paid: 0,
        due: 0,
        status: "No active subscription",
        lastPayment: null,
        payments: [],
      });
    }

    const subscription = user.activeSubscription;
    const totalFee = parseFloat(subscription.plan.amount) || 0;
    const payments = await Payment.find({ user: user._id }).sort({ createdAt: -1 });

    const totalPaid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const due = Math.max(totalFee - totalPaid, 0);
    const latestPaymentDate = payments.length ? payments[0].createdAt : null;

    let status = "Pending";
    if (due <= 0 && totalFee > 0) status = "Paid";
    else if (due < totalFee && totalPaid > 0) status = "Partially Paid";
    else if (totalFee === 0) status = "N/A";

    return res.json({
      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status,
      },
      amount: totalFee,
      paid: totalPaid,
      due,
      status,
      lastPayment: latestPaymentDate,
      payments,
    });
  } catch (err) {
    next(err);
  }
};
