const mongoose = require("mongoose");
const validator = require("validator");

 const schema = new  mongoose.Schema({

     username : {
         type : String,
         required : true,
         unique : [true,"Username already exist , try another"],
     },
     name : {
         type : String,
         required : true,
         
     },
     email : {
         type : String,
         required : true,
        unique : [true,"Email is already present"],
        validate(val)
        {
            if(!validator.isEmail(val))
                throw new Error("Invalid email");
        }
        
    }  , 
    password : {
        type:String,
        required : true
     },
    cpassword : {
        type:String,
        required : true
     },
     token :{
        type: String,
        required : true
     }
 })


 const User = new mongoose.model("User" , schema);

 module.exports = User;