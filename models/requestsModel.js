const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true 
    },
    status:{
        type:String,
        default:"pending"
    },
},{
    timestamps:true,
})

const requestModel = mongoose.model("requests", requestSchema);

module.exports = requestModel;