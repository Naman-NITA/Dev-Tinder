
const express = require("express");

 const connectDB = require("./config/database"); 

const app = express();

const User = require("./models/user");

app.use(express.json());

 // signup the user to the database
 app.post("/signup" , async ( req, res) => {

  
   console.log(req.body);

  //Creating a new instance of the User model
       const user = new User(req.body);
    try {
      await user.save();  
      res.send("User Added Successfully 2");
    } catch (error) {
      res.status(400).send("Error saving the user:" + err.message);
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

  // get all the data from the database
  app.get("/feed" ,async (req,res) => {
    
     try { 
      const users = await User.find({});

      res.send(users);
      
     } catch (error) {
      res.status(400).send("Something went wrong");
     }

  });


  //Deleted the data from the database

  app.delete("/delete" , async(req,res) =>{
     
     const userId = req.body.userId;

     try {
       
      const user = await User.findByIdAndDelete(userId);

      res.send("User deleted Successfully");

     } catch (error) {
       res.status(400).send("Something went wrong");

     }
     
  });


  // Updqate the data from the database

   app.patch("/user" , async (req,res) => {
    const userId = req.body.userId;

    const data = req.body;
    try {
      await User.findByIdAndUpdate({_id : userId } , data);

      res.send("User Updated successfully");

      
    } catch (error) {
      res.status(400).send("Something went wrong");
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





 