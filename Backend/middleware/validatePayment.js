// middleware/validatePayment.js
const validatePaymentInput = (req, res, next) => {
  const { user, amount } = req.body;
  if (!user || !amount) {
    return next({ statusCode: 400, message: "User and amount are required" });
  }
  next();
};
export default validatePaymentInput;