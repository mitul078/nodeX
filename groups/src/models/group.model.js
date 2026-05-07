const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    createdBy: { type: String, required: [true, "USERID IS REQUIRED"] },
    groupName: { type: String, required: [true, "GROUPNAME IS REQUIRED"] },
    description: { type: String },
    coverUrl: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model("Group", groupSchema)