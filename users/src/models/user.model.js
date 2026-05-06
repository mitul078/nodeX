const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({

    userId: { type: String, required: [true, "USERID REQUIRED"] },
    username: { type: String, required: [true, "USERNAME REQUIRED"] },
    email: { type: String, required: [true, "EMAIL IS REQUIRED"] },
    fullName: { type: String },
    avatarUrl: { type: String },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },
    phone: { type: String },
    isActive: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
