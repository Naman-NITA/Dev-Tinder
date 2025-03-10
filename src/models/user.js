
 const mongoose = require('mongoose');
 
  const validator  = require("validator");

  const bcrypt = require("bcrypt");

  const jwt = require("jsonwebtoken");

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


  userSchema.index({firstName : 1 , lastName :1});


  userSchema.methods.getJWT = async function () {

    const user = this;

   const token = await jwt.sign({_id : user._id }, "DEV@Tinder$790" , {
      expiresIn : "1d",
     });

     return token;
  } 


  userSchema.methods.vaildatePassword = async function (passwordsInputByUser) {
    const user = this;

    const passwordsHash  = user.password;

    const isPasswordsValid = await bcrypt.compare(passwordsInputByUser, passwordsHash);

    return isPasswordsValid;
  };

 module.exports = mongoose.model("User",userSchema);