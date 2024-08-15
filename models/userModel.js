const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    identificationType:{
        type:String,
        required:true 
    },
    identificationNumber:{
        type:String,
        required:true 
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    balence:{
        type:Number,
        default:0
    },
    isVerified:{
        type:Boolean,
        default:false 
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
}, {timeStamps: true},
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
