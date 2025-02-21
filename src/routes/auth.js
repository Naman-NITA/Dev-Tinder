const express = require("express");


const authRouter = express.Router();

const { validateSignupData } = require("../utils/validation");

 

const User = require("../models/user");

const bcrypt =  require("bcrypt");

authRouter.post("/signup", async (req, res) => {

  try {

  // validation of data is required
  validateSignupData(req);

  // Encrypt the password
 

  const { firstName , lastName , emailId , password } = req.body;

  const passwordHash = await bcrypt.hash(password,10);

  console.log(passwordHash);


  

     
 // creating a new instance of the user model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });
 
    await user.save();
    res.status(201).send("User added successfully");
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("Email ID already exists");
    } else {
      res.status(400).send("ERROR : " + error.message);
    }
  }
}); 

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordsValid = await user.vaildatePassword(password);

    if (isPasswordsValid) {
       
   // Create a JWT Token

    
   const token = await user.getJWT();

  //  console.log(token);




        // Add the token to cookie ans send the response back to the user

        res.cookie("token" , token , {
          expires : new Date(Date.now() + 8 *3600000),
        }); 
          
      res.send("Login Successful !!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

 authRouter.post("/logout" , async(req,res) => {

       res.cookie("token" , null , {

        expires : new Date(Date.now()),

       });

       res.send("Logout Successfully !!");

 }); 

module.exports = authRouter;

