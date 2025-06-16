 const mongoose = require("mongoose");

 
//  mongodb+srv://namank797999:w6WMNyArqw3MoURW@cluster0.sbjtq.mongodb.net/


//  jo5BuyiuxTM719YL

//  namank89123

//  mongodb+srv://namank89123:jo5BuyiuxTM719YL@cluster0.loadk0k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

 const connectDB = async () => {
     
  await mongoose.connect(
    "mongodb+srv://namank89123:v3gZaTt5BO2mJDxk@cluster0.kmg6hgs.mongodb.net/Dev" 
  );
 }; 


 


  
 



 module.exports = connectDB;
 

 