const express = require("express");


const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");

 

const User = require("../models/user");

const bcrypt =  require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate data (ensure this function is correctly validating all fields)
    validateSignUpData(req);

    // Extract all fields from the request body
    const { firstName, lastName, emailId, password, age, gender, photoUrl, about, skills } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user instance with all fields
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,  // Include age
      gender,  // Include gender
      photoUrl,  // Include photoUrl
      about,  // Include about
      skills,  // Include skills
    });

    // Save the user in the database
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("Email ID already exists");
    } else {
      res.status(400).send("ERROR: " + error.message);
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
          
      res.send(user);
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

