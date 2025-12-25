import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import feePlanRoutes from "./routes/feePlanRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userPaymentStatusRoutes from "./routes/userPaymentStatusRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import paymentRequestRoutes from "./routes/paymentRequestRoutes.js";
import instagramRoutes from "./routes/instagram.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/feeplans", feePlanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment-status", userPaymentStatusRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payment-requests", paymentRequestRoutes);
app.use("/api/instagram", instagramRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Tikone Cricket Backend is running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`❌ Cannot ${req.method} ${req.originalUrl} here`);
});

// Global error handler
app.use(errorHandler);

// PORT handling
// On Vercel, process.env.PORT is provided automatically.
// Locally, you can set PORT in .env.local or via terminal (e.g., PORT=5001 node server.js)
const PORT = process.env.PORT || 5001;

if (!PORT) {
  console.error("❌ Error: PORT is not defined. For local testing, set PORT in .env.local or use 'PORT=5001 node server.js'");
  process.exit(1);
}

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
