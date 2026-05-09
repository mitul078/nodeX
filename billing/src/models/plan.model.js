const mongoose = require("mongoose")
const planSchema = new mongoose.Schema({
    userId: { type: String, required: [true, "USERID IS REQUIRED"] },
    plan: { type: String, enum: ["free", "pro", "business"], default: "free" },
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model("Plan", planSchema)