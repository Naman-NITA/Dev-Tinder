
const express = require("express");

const connectDB = require("./config/database"); 

const app = express();





const cookieParser = require("cookie-parser");




app.use(express.json());

app.use(cookieParser()); 




 const authRouter = require("./routes/auth");

 const request = require("./routes/requests");

 const profile = require("./routes/profile");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");


   app.use("/" , authRouter);
 
   app.use("/" , profileRouter);


   app.use("/" , requestRouter);

   












  
  

connectDB()
 .then(() => {
  console.log("Database connection established....");

  app.listen(4000 , () => {
    console.log("Server is running in port 4000...");
   });

 })
 .catch((err) => {
  console.log("Database cannot be connected!!");
 });






 