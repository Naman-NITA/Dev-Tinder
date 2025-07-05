const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored" , "interested"];

    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Invalid Status type : " + status});

    }
    


    const toUser = await User.findById(toUserId);

    if(!toUser){
      return res.status(404).json({message : "User not found",});
    }

    // 6777f407f4b0c00100cf44a3
    //  if there is an existing Connection Request

     const existingConnectionRequest = await ConnectionRequest.findOne({
      $or : [
        {fromUserId , toUserId},
        {fromUserId : toUserId , toUserId : fromUserId},  
      ],
     }); 
     
     
     if(existingConnectionRequest){
      return res.status(400).send({meassage : "Connection Request Already Exist !"});
     } 

     


    

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: "Connection Request sent Successfully",
      data,
    });

  } catch (error) {
    // console.error(error);

    // Handle self-request error explicitly
    if (error.message === "Cannot send connection request to yourself!") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).send(req.user?.firstName + " couldn't send the connection request!");
  }
});


 
requestRouter.post("/request/review/:status/:requestId" , userAuth , async  (req , res) => {

  try {
    const loggedInUser = req.user;

    const {status , requestId } = req.params;


    //validate the status


    const allowedStatus = ["accepted" , "rejected"];



    if(!allowedStatus.includes(status)){
      return res.status(400).json({ message: "Status not allowed!" }); 
    }

 


    // Naman => rahul

    //loggedInUser == to userId means  rahul is loggedIn

    //status = interested

    // request Id should be valid

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId : loggedInUser._id,
      status : "interested",
    });
    if(!connectionRequest) {
      return res.status(404).json({meassge : "Connection request not found"});
    }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({meassge : "Connection request " + status ,data });
  } catch (error) {
    res.status(400).send("ERROR : " + error.meassage); 
  }
})



module.exports = requestRouter;
