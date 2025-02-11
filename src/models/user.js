
 const mongoose = require('mongoose');
 
  const validator  = require("validator");

 const userSchema = new mongoose.Schema({

  firstName: {
   type: String,
   required : true,
   minLength:4,
   maxLength : 50,
  },

  lastName: {
    type: String
  },
 
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value), 
      message: (props) => `Invalid email address: ${props.value}`, 
    },
  },
  


  password : {
    type: String,
    required : true,
    validate: {
      validator: (value) => validator.isStrongPassword(value), 
      message: (props) => `Enter a strong passwords: ${props.value}`, 
    },
  },

  age: {
    type : Number,   
    min: 18,
    
  },

  gender: {
    type: String,
    validate(value){
     if(!["male","female","others"].includes(value)){
      throw new Error("Gender data is not valid");
     }
    },
  },

  photoUrl:{
    type : String,
    validate: {
      validator: (value) => validator.isURL(value), 
      message: (props) => `Invalid Photo url: ${props.value}`, 
    },
  },
 about : {
  type: String,
  default : "This is a default about of the user!",
 },
 skills: {
  type: [String],
 },

 },{
  timestamps:true,
 });

 module.exports = mongoose.model("User",userSchema);