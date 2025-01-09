 const mongoose = require("mongoose");

 


 const connectDB = async () => {
     
  await mongoose.connect(
    "mongodb+srv://namank797999:w6WMNyArqw3MoURW@cluster0.sbjtq.mongodb.net/devTinder"  
  );
 }; 

 module.exports = connectDB;

 