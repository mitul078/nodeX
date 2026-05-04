const mongoose = require("mongoose")
const env = require("./env")

async function connectDB() {
    await mongoose.connect(env.mongo_uri)
        .then(() => console.log("NODEX-AUTHSERVICE DATABASE CONNECTED"))
}

module.exports = connectDB