const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat"); 


const http = require("http");

const { routerForWebhook, routerForOthers } = require("./routes/payment");
const initializeSocket = require("./utils/socket");

const app = express();
const PORT = 3001;

// ✅ CORS Setup
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

// ✅ Razorpay Webhook route comes BEFORE express.json
// This is CRITICAL
app.use("/payment/webhook", routerForWebhook);  


app.use(express.json());
app.use(cookieParser());

// ✅ Mount all other routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", routerForOthers); 
app.use("/", chatRouter);


const server = http.createServer(app);
initializeSocket(server); 

// ✅ Connect DB and Start Server
connectDB()
  .then(() => {
    console.log("Database connection established....");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!");
    console.error("Error details:", err);
  });
