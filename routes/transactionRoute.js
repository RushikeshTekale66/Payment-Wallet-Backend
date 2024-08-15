const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/transactionModels");
const User = require("../models/userModel")

const router = require("express").Router();

const stripe = require("stripe")(process.env.stripe_key);
const {uuid} = require("uuidv4");


//Transaction money from 1 account to another
router.post("/transfer-funds", authMiddleware, async (req, res) => {
    try {
        //save the transaction
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();

        //decrease the sender balence
        await User.findByIdAndUpdate(req.body.sender, {
            $inc: { balence: -req.body.amount },
        })

        //increase the receiver balence
        await User.findByIdAndUpdate(req.body.receiver, {
            $inc: { balence: req.body.amount },
        })

        res.send({
            message: "Transaction Successful",
            data: newTransaction,
            success: true,

        })
    }
    catch (error) {
        res.send({
            message: "Transaction failed",
            data: error.message,
            success: false,
        })
    }
})

//Verify the account
router.post("/verify-account", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.receiver });
        if (user) {
            res.send({
                message: "Account Verified",
                data: user,
                success: true
            })
        }
        else {
            res.send({
                message: "account not found",
                data: null,
                success: false
            })
        }
    }
    catch (error) {
        res.send({
            message: "Account not found",
            data: error.message,
            success: false,
        })
    }
})
module.exports = router;

//get all transation for a user
router.post("/get-all-transactions-by-user", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [{ sender: req.body.userId }, { receiver: req.body.userId }]
        }).sort({ createdAt: -1 }).populate("sender").populate("receiver");
        // console.log("Transaction are", transactions);
        res.send({
            message: "Transaction fetched",
            data: transactions,
            success: true,
        })
    }
    catch (error) {
        res.send({
            message: "No transactions fetched",
            data: error.message,
            success: false
        })
    }
})

//deposite funds using stripe

router.post("/deposit-funds", authMiddleware, async (req, res) => {
    try {
        const { token, amount } = req.body;
        //create a customer
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        })
        console.log("Customer info " , customer);
        //create a charge
        const charge = await stripe.charges.create(
            {
                amount: amount,
                currency: "usd",
                customer: customer.id,
                receipt_email: token.email,
                description: "Deposited to wallet"
            },
            {
                idempotencyKey: uuid(),
            }
        );
        console.log("Charge info" , charge);

        //save the transaction
        if (charge.status === "succeeded") {
            const newTransaction = new Transaction({
                sender: req.body.userId,
                receiver: req.body.userId,
                amount: amount,
                type: "deposit",
                reference: "stripe deposit",
                status: "success",
            });
            await newTransaction.save();

            //increase the user's balence
            await User.findByIdAndUpdate(req.body.userId, {
                $inc: { balence: amount },
            })
            res.send({
                message: "Transaction successful",
                data: newTransaction,
                success: true
            })
        }
        else {
            res.send({
                message: "Transaction failed",
                data: charge,
                success: false
            });
        }
    }
    catch (error) {
        res.send({
            message: "Transaction failed",
            data: error.message,
            success: false
        });
    }
})