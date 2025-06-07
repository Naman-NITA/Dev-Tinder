

const express = require("express");

const connectDB = require("./config/database"); 

const app = express();






const cookieParser = require("cookie-parser");

const cors = require('cors');


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://427c-2409-40e5-112e-dab9-e0cd-3ec-315b-5f10.ngrok-free.app" // your frontend
  ],
  credentials: true,
}));

app.use(express.json());

app.use(cookieParser()); 






 const authRouter = require("./routes/auth");

 const request = require("./routes/requests");

 const profile = require("./routes/profile");

const profileRouter = require("./routes/profile");

const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");


   app.use("/" , authRouter);
 
   app.use("/" , profileRouter);


   app.use("/" , requestRouter);


   app.use("/" , userRouter);

   app.use("/",paymentRouter);
   
connectDB()
 .then(() => {
  console.log("Database connection established....");
  
  app.listen(3000 , () => {
    console.log("Server is running in port 3001 :" );
   });
 })


 .catch((err) => {
  console.log("Database cannot be connected!!");
 });






 