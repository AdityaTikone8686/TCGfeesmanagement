import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const userProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next({ statusCode: 401, message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next({ statusCode: 401, message: "User not found" });
    }

    req.user = user; // Attach full user object to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next({ statusCode: 401, message: "Token expired" });
    }
    return next({ statusCode: 401, message: "Invalid token" });
  }
};
