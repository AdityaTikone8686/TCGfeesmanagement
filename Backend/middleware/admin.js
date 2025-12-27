const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next({
      statusCode: 403,
      message: "Admin access only",
    });
  }
  next();
};

export default requireAdmin;
