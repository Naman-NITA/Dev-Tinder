const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { populate } = require("../models/user");

const userRouter = express.Router();

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
    });

    


    
   } catch (error) {

    res.status(400).send({message : error.message});
    
   }

})

// get all the connection request which is accepted

module.exports = userRouter;
