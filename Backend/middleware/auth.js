import jwt from "jsonwebtoken";

const { verify } = jwt;

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next({ statusCode: 401, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, isAdmin }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next({ statusCode: 401, message: "Token expired" });
    }
    return next({ statusCode: 403, message: "Invalid or expired token" });
  }
};

export default authenticate;
