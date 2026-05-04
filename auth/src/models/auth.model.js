const mongoose = require("mongoose")
const authSchema = new mongoose.Schema({
    username: { type: String, required: [true, "USERNAME IS REQUIRED"] },
    password: { type: String, required: [true, "PASSWORD IS REQUIRED"] },
})

module.exports = mongoose.model("Auth", authSchema)