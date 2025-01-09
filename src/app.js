
const express = require("express");

 const connectDB = require("./config/database"); 

const app = express();

const User = require("./models/user");


 app.post("/signup" , async ( req, res) => {
       const user = new User({
        firstName : "Rahul",
        lastName : "kummar",
        emailId : "namank797999@gamial.com",
        password : "Naman@797999", 
       });

    try {
      await user.save();  
      res.send("User Added Successfully 2");
    } catch (error) {
      res.status(400).send("Error saving the user:" + err.message);
    }

 });


connectDB()
 .then(() => {
  console.log("Database connection established....");

  app.listen(3000 , () => {
    console.log("Server is running in port 3000...");
   });

 })
 .catch((err) => {
  console.log("Database cannot be connected!!");
 });





 