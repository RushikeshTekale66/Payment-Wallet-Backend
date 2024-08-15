const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    reference:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
}, {
    timestamps:true,
});

const TransactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = TransactionModel;
