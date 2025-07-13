import User from "../models/User.js";
import Payment from "../models/Payment.js";
import FeePlan from "../models/feePlan.js";

export const getReportSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    // Validate inputs
    if (month && (isNaN(month) || month < 1 || month > 12)) {
      return res.status(400).json({ error: "Invalid month" });
    }
    if (year && isNaN(year)) {
      return res.status(400).json({ error: "Invalid year" });
    }
    let paymentFilter = {};
    if (year) {
      const start = new Date(`${year}-${month || "01"}-01`);
      const end = new Date(start);
      if (month) {
        end.setMonth(end.getMonth() + 1);
      } else {
        end.setFullYear(end.getFullYear() + 1);
      }
      paymentFilter.createdAt = { $gte: start, $lt: end };
    }
    
    // Only include payments that have a subscription (approved payments)
    paymentFilter.subscription = { $exists: true, $ne: null };
    
    // Use User model for students with active subscriptions
    const [students, payments] = await Promise.all([
      User.find({ role: "user" }).populate({
        path: "activeSubscription",
        populate: {
          path: "plan",
          select: "planName amount description"
        }
      }),
      Payment.find(paymentFilter),
    ]);
    const totalStudents = students.length;
    const totalPayments = payments.length;
    const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalExpected = students.reduce((sum, s) => {
      const planAmount = s.activeSubscription?.plan?.amount || 0;
      return sum + planAmount;
    }, 0);
    const totalDue = Math.max(totalExpected - totalCollected, 0);
    const planCount = {};
    for (let s of students) {
      const planName = s.activeSubscription?.plan?.planName;
      if (planName) {
        planCount[planName] = (planCount[planName] || 0) + 1;
      }
    }
    const popularPlan = Object.entries(planCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    res.json({
      totalStudents,
      totalPayments,
      totalCollected: Number(totalCollected.toFixed(2)),
      totalDue: Number(totalDue.toFixed(2)),
      averageCollectedPerStudent: totalStudents > 0 ? +(totalCollected / totalStudents).toFixed(2) : 0,
      feePlansUsed: Object.keys(planCount).length,
      popularPlan,
    });
  } catch (err) {
    next(err);
  }
};
