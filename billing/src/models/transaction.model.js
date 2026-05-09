const mongoose = require("mongoose")
const transactionSchema = new mongoose.Schema({

    userId: { type: String, required: [true, "USERID IS REQUIRED"] },
    orderId: { type: String, required: [true, "ORDERID IS REQUIRED"] },
    paymentId: { type: String, default: null },
    plan: { type: String, required: [true, "PLAN IS REQUIRED"] },
    amount: { type: Number, required: [true, "AMOUNT IS REQUIRED "] },
    status: { type: String, enum: ["success", "failed", "pending"], default: "pending" }

}, { timestamps: true })

module.exports = mongoose.model("Transaction", transactionSchema)