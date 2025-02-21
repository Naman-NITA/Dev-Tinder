const express = require("express");
const { userAuth } = require("../middlewares/auth");


const profileRouter = express.Router();

const { ValidateProfileData} = require("../utils/validation");




profileRouter.get("/profile/view" , userAuth   , async (req , res) => {

  try {
   const  user =  req.user;
   res.send(user);

  } catch (error) {

   res.status(400).send("ERROR : " + error.message);
   
  }

});

profileRouter.patch("/profile/edit" , userAuth , async(req,res) => {

    try {
      if (!ValidateProfileData(req)) {
        throw new Error("Invalid edit request: Some fields are not allowed.");
      }
  

     const logedInuser = req.user;
    
      Object.keys(req.body).forEach((key) => (logedInuser[key] = req.body[key]));


      await logedInuser.save();
    

      res.json({
        message : `${logedInuser.firstName} , Your Profile updated Successfully`,
        data : logedInuser,
      });   

    } catch (error) {

      res.status(400).send("ERROR : " + error.message);
      
    }

});


module.exports  = profileRouter