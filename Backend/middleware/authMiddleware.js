import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token === "dummy-token") {
        return next({ statusCode: 401, message: "Dummy token not allowed" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (process.env.NODE_ENV !== "production") {
        // console.log("Decoded JWT:", decoded);
      }

      if (decoded.isAdmin) {
        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin || !admin.isAdmin) {
          return next({ statusCode: 403, message: "Invalid admin credentials" });
        }

        req.admin = admin;
      }

      next();
    } catch (err) {
      return next({ statusCode: 401, message: "Not authorized, token failed" });
    }
  } else {
    return next({ statusCode: 401, message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  return next({ statusCode: 403, message: "Access denied: Admins only" });
};
