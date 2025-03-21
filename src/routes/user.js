const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { populate } = require("../models/user");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"];


// Get all connection requests for the logged-in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const loggedInUserRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested", 
    }).populate("fromUserId" , ["firstName" , "lastName" , "photoUrl" ,"age" , "gender" , "about" , "skills"]);

    res.json({
      message: "Data fetched successfully",
      data: loggedInUserRequests,  
    });
  } catch (error) {
   
    res.status(400).send("Error: " + error.message); // ✅ Fixed `req.status(400)` → `res.status(400)`
  }
}); 


userRouter.get("/user/connection" , userAuth , async (req,res) => {
   
   try {

    const loggedInUser = req.user;

    // rahul => smita =>accepted
    //smita => naman => accepted   

    // total connection smita have


    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {toUserId : loggedInUser._id,status : "accepted"},
        {fromUserId : loggedInUser._id, status : "accepted"},
      ]
    }).populate("fromUserId" , ["firstName" , "lastName" , "photoUrl" ,"age" , "gender" , "about" , "skills"]).populate("fromUserId" , ["firstName" , "lastName" , "photoUrl" ,"age" , "gender" , "about" , "skills"]);


    const data = connectionRequest.map((row) => {
       
       if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId;
       }
       return row.fromUserId;
    })  

       
     res.json({data});


    
   } catch (error) {

    res.status(400).send({message : error.message});
    
   }

})

userRouter.get("/user/connection" , userAuth , async (req,res) => {
   
  try {

   const loggedInUser = req.user;

   // rahul => smita =>accepted
   //smita => naman => accepted   

   // total connection smita have


   const connectionRequest = await ConnectionRequest.find({
     $or: [
       {toUserId : loggedInUser._id,status : "accepted"},
       {fromUserId : loggedInUser._id, status : "accepted"},
     ]
   }).populate("fromUserId" , ["firstName" , "lastName" , "photoUrl" ,"age" , "gender" , "about" , "skills"]).populate("fromUserId" , ["firstName" , "lastName" , "photoUrl" ,"age" , "gender" , "about" , "skills"]);


   const data = connectionRequest.map((row) => {
      
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
       return row.toUserId;
      }
      return row.fromUserId;
   })  

      
    res.json({data});

   

   
  } catch (error) {

   res.status(400).send({message : error.message});
   
  }

})


userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; // Use req.user instead of res.user

    const page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 10;
   
     limit = limit >50 ? 50 : limit;


    const skip = (page-1)*limit;

    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // User should see all the user cards except:
    // 0. His own card
    // 1. His connection
    // 2. Ignored people
    // 3. Already sent connection requests
    // 4. Add contribution

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }, // 
      ],
    }).select("fromUserId toUserId"); 


    const hideUserFromFedd = new Set();

    connectionRequest.forEach((req) => {
      hideUserFromFedd.add(req.fromUserId.toString());
      hideUserFromFedd.add(req.toUserId.toString());
    }) 


    const  users = await User.find({
      $and: [
      {_id : {$nin : Array.from(hideUserFromFedd)}},
      {_id: {$ne : loggedInUser._id}},
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);
   
    //  console.log(users);

    // console.log(hideUserFromFedd);    // they are the user need to hide them

    res.send(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});





module.exports = userRouter;
