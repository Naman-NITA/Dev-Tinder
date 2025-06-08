const express = require("express");
const connectDB = require("./config/database"); 
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

const app = express();

// Use .env variable or fallback to 3001
const PORT = process.env.PORT || 3010;

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Mount routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

// Connect DB and start server
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
