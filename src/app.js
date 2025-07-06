const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

// 🔥 Import payment routers separately
const { routerForWebhook, routerForOthers } = require("./routes/payment");

const app = express();
const PORT = 3001;

// ✅ CORS Setup
app.use(cors({
  origin: ["https://tinder-front-3zqs.vercel.app"],
  credentials: true,
}));

// ✅ Razorpay Webhook route comes BEFORE express.json
// This is CRITICAL
app.use("/payment/webhook", routerForWebhook); // handles express.raw

// ✅ Then apply express.json to all others
app.use(express.json());
app.use(cookieParser());

// ✅ Mount all other routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", routerForOthers); // includes /payment/create etc.

// ✅ Connect DB and Start Server
connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!");
    console.error("Error details:", err);
  });
