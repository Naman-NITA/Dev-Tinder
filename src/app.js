
const express = require("express");

const connectDB = require("./config/database"); 

const app = express();

const User = require("./models/user");

const bcrypt = require("bcrypt");

app.use(express.json());


const {validateSignupData} = require("./utils/validation");
const { isStrongPassword } = require("validator");

 

app.post("/signup", async (req, res) => {

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


app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordsValid = await bcrypt.compare(password, user.password);

    if (isPasswordsValid) {
      res.send("Login Successful !!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});




  //get user by email
  app.get("/user" , async(req,res) => {
    const userEmail  = req.body.
    emailId;
      
   try{
      const users = await User.find({emailId : userEmail});

      if(users.length === 0){
        res.status(404).send("User not found");
      }
      else{
        res.send(users);
      }
    } catch (error) {

      res.status(400).send("Something went wrong");
      
    }

  });

 
  app.get("/feed" ,async (req,res) => {
    
     try { 
      const users = await User.find({});

      res.send(users);
      
     } catch (error) {
      res.status(400).send("Something went wrong");
     }

  });






  app.delete("/delete" , async(req,res) =>{
     
     const userId = req.body.userId;

     try {
       
      const user = await User.findByIdAndDelete(userId);

      res.send("User deleted Successfully");

     } catch (error) {
       res.status(400).send("Something went wrong");

     }
     
  });




  app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId; 
    const data = req.body;
  
    try {
      const ALLOWED_UPDATE = ["gender", "photoUrl", "age", "about", "skills"];
  
    
      const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATE.includes(key)); 

      if(!isUpdateAllowed){
       throw new Error("Update not allowed");
      }

      if(data?.skills.length > 10){
        throw new Error("Skills cannot be more than 10"); 
      }
     
    const user = await User.findByIdAndUpdate({_id : userId} , data , {
          returnDocument : "after",
          runValidators : true,
    });
  
      // // Check if the user exists
      // if (!updatedUser) {
      //   return res.status(404).send("User not found");
      // }
  
      // Return the updated user
      // console.log(user);
      res.send("User updated successfully"); 
  
    } catch (error) {
      res.status(400).send("Something went wrong: " + error.message);
    }
  });
  
  


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






 