 const validator = require("validator");

const validateSignupData = (req) => {
  const {firstName,lastName,emailId,password} = req.body;


  if(!firstName || !lastName){
    throw new Error("Name is not valid!");
  }
  else if(firstName.length < 4 || firstName.length >50){
    throw new Error("FirstName should be 4-50 characters")
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("please enter a strong Password");
  }
}; 

const  ValidateProfileData = (req) => {
  
  const allowedEditData = ["firstName", "lastName", "emailId", "gender", "age", "about", "skills"];

  // Check if request body exists and has at least one key
  if (!req.body || Object.keys(req.body).length === 0) {
    return false;
  }

  // Check if all provided fields are in the allowed list
  return Object.keys(req.body).every((field) => allowedEditData.includes(field));
};



// const ValidateProfileData = (req) => {
   
//   const allowedEditData = ["firstName" , "lastName" , "emailId" , "gender" , "age","about" , "skills"];

//   const isEditAllowed = Object.keys(req.body).every((field) => allowedEditData.includes(field));

//   return isEditAllowed;

// }



module.exports = {
 validateSignupData,
 ValidateProfileData,
};