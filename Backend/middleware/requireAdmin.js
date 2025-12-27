import authenticate from "./auth.js";

const requireAdmin = [
  authenticate,
  (req, res, next) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  },
];

export default requireAdmin;
